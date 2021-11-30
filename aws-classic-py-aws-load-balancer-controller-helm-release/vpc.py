"""An AWS Python Pulumi program"""

from pulumi_aws import ec2, get_availability_zones
from pulumi import export, ResourceOptions, Config
from pulumi_aws.get_region import get_region

# read local config settings - network
config = Config()
vpc_cidr_block = config.require("vpc_cidr_block")
public_subnets_cidr_blocks = config.require_object("public_subnet_cidr")
private_subnets_cidr_blocks = config.require_object("private_subnet_cidr")
number_of_nat_gateways_requested = config.get_int("number_of_nat_gateways") or 1

# In case the user passed in a number greater than 3 or less than 1, we set it to 1.
if (number_of_nat_gateways_requested <1) or (number_of_nat_gateways_requested>3):
    nat_gateways_allocated = 1
else: # Allocated the nat gateways to what the user requested.
    nat_gateways_allocated = number_of_nat_gateways_requested

myname = "demo-eks"

# create a vpc
vpc = ec2.Vpc(
    f"{myname}-vpc",
    cidr_block=vpc_cidr_block,
    instance_tenancy='default',
    enable_dns_hostnames=True,
    enable_dns_support=True,
    tags={
        'Name': f"{myname}-vpc",
    },
)

# igw = internet gateway router 
igw = ec2.InternetGateway(
    f"{myname}-igw",
    vpc_id=vpc.id,
    tags={
        'Name': f"{myname}-vpc-igw",
    },
    opts=ResourceOptions(parent=vpc),
)

# public route table
public_route_table = ec2.RouteTable(
    f"{myname}-public-route-table",
    vpc_id=vpc.id,
    routes=[ec2.RouteTableRouteArgs(
        cidr_block='0.0.0.0/0',
        gateway_id=igw.id,
    )],
    tags={
        'Name': f"{myname}-public-route-table", #'pulumi-vpc-rt',
    },
    opts=ResourceOptions(parent=vpc),
)

## Subnets, one for each AZ in a region

def get_aws_availability_zones():
    awszones = get_availability_zones()
    return awszones.names[:3] # returns items from 0, 1, 2 (so a total of 3 az's)

zones = get_aws_availability_zones()

## Security Group
security_group = ec2.SecurityGroup(
    f"{myname}-security-group",
    vpc_id=vpc.id,
    description='Allow all HTTP(s) traffic to VPC',
    tags={
        'Name': f"{myname}-security-group",
    },
    ingress=[
        ec2.SecurityGroupIngressArgs(
            cidr_blocks=['0.0.0.0/0'],
            from_port=443,
            to_port=443,
            protocol='tcp',
            description='Allow port 443 in bound'
        ),
        ec2.SecurityGroupIngressArgs(
            cidr_blocks=['0.0.0.0/0'],
            from_port=80,
            to_port=80,
            protocol='tcp',
            description='Allow port 80 in bound'
        ),
    ],
    egress=[
        ec2.SecurityGroupEgressArgs(
            cidr_blocks=["0.0.0.0/0"],
            from_port=0,
            to_port=0,
            protocol="-1",
            description="Allow outbound access"
        )
    ],
    opts=ResourceOptions(parent=vpc),
) 

# Mainly to save cost since nat gateways are so expensive
number_of_nat_gateways = 1
current_number_of_nat_gateways = 0


public_subnet_ids = []
private_subnet_ids = []

for zone, public_subnet_cidr, private_subnet_cidr in zip(zones, public_subnets_cidr_blocks, private_subnets_cidr_blocks):
    print("zone: " + zone)
    print("public cidr: " + public_subnet_cidr)
    print("private cidr: " + private_subnet_cidr)

    # Public Subnets
    public_subnet = ec2.Subnet(
        f"{myname}-public-subnet-{zone}",
        assign_ipv6_address_on_creation=False,
        vpc_id=vpc.id,
        map_public_ip_on_launch=True,
        cidr_block=public_subnet_cidr,
        availability_zone=zone,
        tags={
            'Name': f"{myname}-public-subnet-{zone}",
        },
        opts=ResourceOptions(parent=vpc),
    )
        
    # public subnet assocaition with public route table
    ec2.RouteTableAssociation(
        f'{myname}-public-rt-association-{zone}',
        route_table_id=public_route_table.id,
        subnet_id=public_subnet.id,
        opts=ResourceOptions(parent=public_subnet),
    )

    public_subnet_ids.append(public_subnet.id)
    
# Mainly to save cost since nat gateways are so expensive.
    if (current_number_of_nat_gateways < nat_gateways_allocated):  
    # Elastic IP for nat gateway
        current_number_of_nat_gateways+=1
        eip = ec2.Eip(
            f"{myname}-eip-nat-gateway-{zone}", 
            tags={
                'Name':f"{myname}-eip-nat-gateway-{zone}"
                },
        )

    # Nat Gateway
        nat_gateway = ec2.NatGateway(
            f"{myname}-natgw-{zone}",
            subnet_id=public_subnet.id,
            allocation_id=eip.id,
            tags={"name": f"{myname}-natgw-{zone}"},
            opts=ResourceOptions(parent=eip)
            )

    # Private Subnets
    private_subnet = ec2.Subnet(
        f"{myname}-private-subnet-{zone}",
        assign_ipv6_address_on_creation=False,
        vpc_id=vpc.id,
        map_public_ip_on_launch=False,
        cidr_block=private_subnet_cidr,
        availability_zone=zone,
        tags={
            'Name': f"{myname}-private-subnet-{zone}",
        },
        opts=ResourceOptions(parent=vpc),
    )
    
    # private route table
    private_route_table = ec2.RouteTable(
    f"{myname}-private-rt-{zone}",
        vpc_id=vpc.id,
        routes=[ec2.RouteTableRouteArgs(
            cidr_block='0.0.0.0/0',
            gateway_id=nat_gateway.id,
        )],
        tags={
            'Name': f"{myname}-private-rt-{zone}",
        },
        opts=ResourceOptions(parent=vpc),
    )

    # private subnet assocaition with private route table
    ec2.RouteTableAssociation(
        f'{myname}-private-rt-association-{zone}',
        route_table_id=private_route_table.id,
        subnet_id=private_subnet.id,
        opts=ResourceOptions(parent=private_route_table),
    )

    private_subnet_ids.append(private_subnet.id)

"""
export("vpc_name",vpc.id)
export("vpc_cidr_block", vpc.cidr_block)
export("internet_gateway", igw.id)
export("public_route_table", public_route_table.id)
export("availabililty_zones",zones)
export("security_group_name", security_group.name)
export("security_group_id", security_group.id)
export("public_subnets_ids",public_subnet_ids)
export("private_subnets_ids",private_subnet_ids)
export("number_of_natgateways",nat_gateways_allocated)
"""