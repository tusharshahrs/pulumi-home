"""An AWS Python Pulumi program"""

from cgitb import enable
from pulumi import Config, export, ResourceOptions
import pulumi_awsx as awsx
from pulumi_aws import ec2

# importing local configs
config = Config()
my_vpc_cidr_block = config.get("vpc_cidr_block") or "10.0.0.0/24"
my_number_of_availability_zones = 3

# variable for name
myname = "demo"

# awsx vpc that is multilang
myvpc = awsx.ec2.Vpc(f'{myname}-vpc',
    cidr_block= my_vpc_cidr_block,
    number_of_availability_zones = my_number_of_availability_zones,
    enable_dns_hostnames=True,
    nat_gateways=awsx.ec2.vpc.NatGatewayConfigurationArgs(strategy =awsx.ec2.vpc.NatGatewayStrategy.SINGLE ), # To save cost, only do in dev.  In prod you would have 3 nats
    tags={
        "Name":f'{myname}-vpc',
        "awsx":"yes",
        "console":"no",
        "env":"dev"
      },
)

export("vpc_id", myvpc.vpc_id)
export("vpc_public_subnetids",myvpc.public_subnet_ids )
export("vpc_private_subnetids",myvpc.private_subnet_ids)
export("vpc_natgateways",myvpc.nat_gateways[0].id)


security_group_no_sg_rules = ec2.SecurityGroup(f'{myname}-securitygroup',
    vpc_id=myvpc.vpc_id,
    tags={'Name': f'{myname}-securitygroup' },
    egress=[
        ec2.SecurityGroupEgressArgs(
            cidr_blocks=['0.0.0.0/0'],
            from_port=443,
            to_port=443,
            protocol='tcp',
            description='Allow outbound access via https',
        ),
        ec2.SecurityGroupEgressArgs(
            cidr_blocks=['0.0.0.0/0'],
            from_port=80,  # After the 1st pulumi up, change the port to 81 to see only port change
            to_port=80,    # After the 1st pulumi up, change the port to 81 to see only port change
            protocol='tcp',
            description='Allow outbound access via http'
        ),
    ],
    ingress=[
        ec2.SecurityGroupIngressArgs(
            cidr_blocks=['0.0.0.0/0'],
            from_port=443,
            to_port=443,
            protocol='tcp',
            description='Allow HTTPS access inbound'
        ),
        ec2.SecurityGroupIngressArgs(
            cidr_blocks=['0.0.0.0/0'],
            from_port=80, 
            to_port=80,
            protocol='tcp',
            description='Allow HTTP access inbound'
        ),
    ],
    )

security_group_with_sg_rules = ec2.SecurityGroup(f'{myname}-securitygroup_with_sg_rules',
    vpc_id=myvpc.vpc_id,
    tags={'Name': f'{myname}-securitygroup_with_sg_rules' },
    )

security_group_rule1 = ec2.SecurityGroupRule(f'{myname}-securitygrouprules1',
    type="ingress",
    from_port=443,
    to_port=443,
    protocol="tcp",
    cidr_blocks=['0.0.0.0/0'],
    security_group_id=security_group_with_sg_rules.id,
)

security_group_rule2 = ec2.SecurityGroupRule(f'{myname}-securitygrouprules2',
    type="egress",
    from_port=81, # After the 1st pulumi up, change the port to 81 to see create-replace issue
    to_port=81,   # After the 1st pulumi up, change the port to 81 to see create-replace issue
    protocol="tcp",
    cidr_blocks=['0.0.0.0/0'],
    security_group_id=security_group_with_sg_rules.id,
)


export("security_group_name", security_group_no_sg_rules.id)
export("security_group_vpc", security_group_no_sg_rules.vpc_id)
export("security_group_egress", security_group_no_sg_rules.egress)
export("security_group_ingress", security_group_no_sg_rules.ingress)

export("security_group_with_rules_name", security_group_with_sg_rules.id)
export("security_group_with_rules_vpc", security_group_with_sg_rules.vpc_id)
export("security_group_with_rules_egress", security_group_rule1.id)
export("security_group_with_rules_ingress", security_group_rule2.id)

