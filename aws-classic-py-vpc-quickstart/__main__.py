"""An AWS Python Pulumi program"""

import pulumi
from pulumi_aws import s3
import pulumi_aws_quickstart_vpc as quick_vpc

name = "demo"

# Note, this creates 3 NAT gateways, this is what you want for prodution, however, for
# dev this can bexpensive.  You will have to use something else besides quickstart for dev
# or be willing to pay for 3 nat gateways in dev
myVpc = quick_vpc.Vpc(f"{name}-vpc",
    enable_dns_hostnames=True,
    enable_dns_support=True,
    create_flow_logs=False,
    create_nat_gateways=True,
    cidr_block="10.0.0.0/23",
    availability_zone_config=[
        quick_vpc.AvailabilityZoneArgs(availability_zone="us-east-2a",private_subnet_a_cidr="10.0.1.0/26",public_subnet_cidr="10.0.0.0/25"),
        quick_vpc.AvailabilityZoneArgs(availability_zone="us-east-2b",private_subnet_a_cidr="10.0.1.64/26",public_subnet_cidr="10.0.0.128/26"),
        quick_vpc.AvailabilityZoneArgs(availability_zone="us-east-2c",private_subnet_a_cidr="10.0.1.128/25",public_subnet_cidr="10.0.0.192/26"),        
    ],
)

pulumi.export("vpc_id", myVpc.vpc_id)
pulumi.export("publicSubnetIDS", myVpc.public_subnet_ids)
pulumi.export("privateSubnetIDS", myVpc.private_subnet_ids)
pulumi.export("natgatewayIPS", myVpc.nat_gateway_ips)