"""An AWS Python Pulumi program"""

import pulumi
from pulumi_aws import s3
import pulumi_aws_quickstart_vpc as quick_vpc

name = "demo"

myVpc = quick_vpc.Vpc(f"{name}-vpc",
    enable_dns_hostnames=True,
    enable_dns_support=True,
    create_flow_logs=False,
    create_nat_gateways=True,
    cidr_block="10.0.0.0/23",
    availability_zone_config=[quick_vpc.AvailabilityZoneArgs(
        availability_zone="us-east-2a",private_subnet_a_cidr="10.0.1.0/26",public_subnet_cidr="10.0.0.0/25",
        #availability_zone="us-east-2b",private_subnet_a_cidr="10.0.1.128/25",public_subnet_cidr="10.0.0.128/26",
        #(availability_zone="us-east-2c",private_subnet_a_cidr="10.0.1.0/26",public_subnet_cidr="10.0.0.192/26"), 
        )
    ],
)

