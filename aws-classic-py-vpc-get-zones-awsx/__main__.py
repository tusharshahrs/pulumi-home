"""An AWS Python Pulumi program"""

from cgitb import enable
from pulumi import Config, export
import pulumi_awsx as awsx

# variable for name
name = "demo"
vpc_cidr_blocks = "10.0.0.0/24"
availability_zones = 3
# VPC
myvpc = awsx.ec2.Vpc(f"{name}-vpc",
    cidr_block= vpc_cidr_blocks,
    number_of_availability_zones = availability_zones,
    enable_dns_hostnames=True,
    enable_dns_support=True,
    nat_gateways=awsx.ec2.vpc.NatGatewayConfigurationArgs(strategy =awsx.ec2.vpc.NatGatewayStrategy.SINGLE ),   
    tags={
        "Name":f"{name}-vpc",
      },
)

export("vpc_id", myvpc.vpc_id)
export("vpc_public_subnetids",myvpc.public_subnet_ids)
export("vpc_private_subnetids",myvpc.private_subnet_ids)
export("vpc_az_zones",availability_zones);
export("vpc_cidrs",vpc_cidr_blocks);

# Patern seems to be that 0,2,4 are public subnets and that 1,3,5 are private subnets.

export("vpc_subnets1_id",myvpc.subnets[0].id);
export("vpc_subnets1_az",myvpc.subnets[0].availability_zone);
export("vpc_subnets1_tags",myvpc.subnets[0].tags);

export("vpc_subnets2_id",myvpc.subnets[2].id);
export("vpc_subnets2_az",myvpc.subnets[2].availability_zone);
export("vpc_subnets2_tags",myvpc.subnets[2].tags);

export("vpc_subnets3_id",myvpc.subnets[4].id);
export("vpc_subnets3_az",myvpc.subnets[4].availability_zone);
export("vpc_subnets3_tags",myvpc.subnets[4].tags);

export("vpc_subnets4_id",myvpc.subnets[1].id);
export("vpc_subnets4_az",myvpc.subnets[1].availability_zone);
export("vpc_subnets4_tags",myvpc.subnets[1].tags);

export("vpc_subnets5_id",myvpc.subnets[3].id);
export("vpc_subnets5_az",myvpc.subnets[3].availability_zone);
export("vpc_subnets5_tags",myvpc.subnets[3].tags);

export("vpc_subnets6_id",myvpc.subnets[5].id);
export("vpc_subnets6_az",myvpc.subnets[5].availability_zone);
export("vpc_subnets6_tags",myvpc.subnets[5].tags);