"""An AWS Python Pulumi program"""

from pulumi import Config, export
import pulumi_awsx as awsx

# importing local configs
config = Config()
my_vpc_cidr_block = config.get("vpc_cidr_block") or "10.0.0.0/24"
my_number_of_availability_zones = config.get_int("number_of_availability_zones") or 3

# variable for name
myname = "demo"

# VPC
myvpc = awsx.ec2.Vpc(f"{myname}-vpc",
    cidr_block= my_vpc_cidr_block,
    number_of_availability_zones = my_number_of_availability_zones,
    enable_dns_hostnames=True,
    nat_gateways=awsx.ec2.vpc.NatGatewayConfigurationArgs(strategy =awsx.ec2.vpc.NatGatewayStrategy.SINGLE ),   
    tags={
        "Name":f"{myname}-vpc",
      },
)

export("vpc_id", myvpc.vpc_id)
export("vpc_public_subnetids",myvpc.public_subnet_ids )
export("vpc_private_subnetids",myvpc.private_subnet_ids )
export("vpc_natgateways",myvpc.nat_gateways[0].id)
"""
export const vpc_id = myvpc.vpcId;
export const vpc_natgateways = myvpc.natGateways[0].id;
export const vpc_public_subnetids = myvpc.publicSubnetIds;
export const vpc_private_subnetids = myvpc.privateSubnetIds;
"""