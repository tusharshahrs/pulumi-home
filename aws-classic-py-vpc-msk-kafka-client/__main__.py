"""An AWS Python Pulumi program"""

import pulumi
import pulumi_aws as aws
import pulumi_awsx as awsx
from pulumi import export, ResourceOptions, Config

# importing local configs
config = Config()
my_vpc_cidr_block = config.get("vpc_cidr_block") or "10.0.0.0/25"
my_number_of_nat_gateways_requested = config.get_int("number_of_nat_gateways") or 2
my_number_of_availability_zones = config.get_int("number_of_availability_zones") or 2
myname = "demo"

myvpc = awsx.ec2.Vpc(f"{myname}-vpc",
    cidr_block= my_vpc_cidr_block,
    number_of_availability_zones = my_number_of_availability_zones,
    nat_gateways = my_number_of_nat_gateways_requested
    )

export("vpc_id",myvpc.vpc_id)
export("vpc_cidr_block", my_vpc_cidr_block)
export("number_of_natgateways",my_number_of_nat_gateways_requested)
export("availabililty_zones",my_number_of_availability_zones)