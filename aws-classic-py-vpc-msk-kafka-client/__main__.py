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
myip = config.get_secret("my_ipaddress");

myname = "demo"
# VPC
myvpc = awsx.ec2.Vpc(f"{myname}-vpc",
    cidr_block= my_vpc_cidr_block,
    number_of_availability_zones = my_number_of_availability_zones,
    nat_gateways = my_number_of_nat_gateways_requested
    )

export("vpc_id",myvpc.vpc_id)
export("vpc_cidr_block", my_vpc_cidr_block)
export("number_of_natgateways",my_number_of_nat_gateways_requested)
export("availabililty_zones",my_number_of_availability_zones)
export("public_subnets",myvpc.public_subnet_ids)
export("private_subnets",myvpc.private_subnet_ids)

## Security Group
security_group = aws.ec2.SecurityGroup(
    f"{myname}-security-group",
    vpc_id=myvpc.id,
    description='MSK Security Group for VPC',
    tags={
        'Name': f"{myname}-security-group",
    },
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            cidr_blocks=[myip],
            from_port=0,
            to_port=0,
            protocol='-1',
            description='ingress rule for msk cluster for clients'
        ),
        aws.ec2.SecurityGroupIngressArgs(
            cidr_blocks=[myip],
            from_port=22,
            to_port=22,
            protocol='tcp',
            description='my ssh rule for client server'
        ),
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            cidr_blocks=["0.0.0.0/0"],
            from_port=0,
            to_port=0,
            protocol="-1",
            description="egress outbound rule for msk cluster"
        )
    ],
    opts=ResourceOptions(parent=myvpc),
) 

export("security_group_name", security_group.name)
export("security_group_id", security_group.id)

# kms key
mykms = aws.kms.Key(f"{myname}-kms", description="msk kafka kms key")
export("kms_key_id", mykms.key_id)

#cloud watch loggroup
mycloudwatchloggroup = aws.cloudwatch.LogGroup(f"{myname}-kms-cloudwatch-loggroup")
export("cloudwatch_log_group_name",mycloudwatchloggroup.name)

mybucket = aws.s3.Bucket(f"{myname}-bucket",
    acl="private",
    force_destroy=True)

export("s3_bucket_name",mybucket.id)