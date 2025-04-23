"""An AWS Python Pulumi program"""

from pulumi import Config, export
import pulumi_awsx as awsx


# importing local configs
config = Config()

my_vpc_cidr_block = config.get("vpc_cidr_block") or "10.0.0.0/23"
my_number_of_availability_zones = config.get_int("number_of_availability_zones") or 2
myname = config.get("nameset") or "demo"

# Create a VPC with the given CIDR block and number of availability zones
my_vpc = awsx.ec2.Vpc(
    f"{myname}-vpc",
    cidr_block=my_vpc_cidr_block,
    number_of_availability_zones=my_number_of_availability_zones,
    enable_dns_hostnames=True,
    enable_dns_support=True,
    nat_gateways=awsx.ec2.NatGatewayConfigurationArgs(strategy=awsx.ec2.NatGatewayStrategy.NONE),
    tags={
        "Name": f"{myname}-vpc",
    }
)

# Export the VPC ID
export("vpc_id", my_vpc.vpc_id)
# Create a public subnet in the VPC
export("public_subnet_ids", my_vpc.public_subnet_ids)
# Create a private subnet in the VPC
export("private_subnet_ids", my_vpc.private_subnet_ids)