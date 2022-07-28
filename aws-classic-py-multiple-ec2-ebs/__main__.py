"""An AWS Python Pulumi program"""

from multiprocessing.pool import TERMINATE
from telnetlib import ENCRYPT
import pulumi
import pulumi_aws as aws
import pulumi_awsx as awsx

from pulumi import export, ResourceOptions, Config
import json

# importing local configs
config = Config()
my_vpc_cidr_block = config.get("vpc_cidr_block") or "10.0.0.0/24"
my_number_of_nat_gateways_requested = config.get_int("number_of_nat_gateways") or 1
my_number_of_availability_zones = config.get_int("number_of_availability_zones") or 3
#myip = config.get_secret("my_ipaddress");

myname = "shaht"
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

# Get the AMI
ami = aws.ec2.get_ami(
    owners=['amazon'],
    most_recent=True,
    filters=[aws.ec2.GetAmiFilterArgs(
        name='name',
        values=['amzn2-ami-hvm-2.0.????????-x86_64-gp2'],
    )],
)

export("ami_id",ami.id)

key = aws.ec2.KeyPair(f"{myname}-key",public_key="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQD3F6tyPEFEzV0LX3X8BsXdMsQz1x2cEikKDEY0aIj41qgxMCP/iteneqXSIFZBp5vizPvaoIR3Um9xK7PGoW8giupGn+EPuxIA4cDM4vzOqOkiMPhz5XK0whEjkVzTo4+S0puvDZuwIsdiW9mxhJc7tgBNL0cYlWSYVkz4G/fslNfRPW5mYAM49f4fhtxPb5ok4Q2Lg9dPKVHO/Bgeu5woMc7RY0p1ej6D4CKFE6lymSDJpW0YHX/wqE9+cfEauh7xZcG0q9t2ta6F6fmX0agvpFyZo8aFbXeUBr7osSCJNgvavWbM/06niWrOvYX2xwWdhXmXSrbX8ZbabVohBK41 tushar@pulumi.com")
export("key_id",key.id)

security_group = aws.ec2.SecurityGroup(f"{myname}-securitygroup",
    description='Security group rules for egress and ingress',
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            cidr_blocks=["0.0.0.0/0"],
            from_port=0,
            to_port=0,
            protocol="-1",
            description="egress outbound rule for servers"
        )
    ],
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            protocol='tcp',
            from_port=443,
            to_port=443,
            cidr_blocks=['99.159.49.102/0'],
            description="ingress rules to server"
        )
    ]
    #ingress=[
    #    #{ 'protocol': 'icmp', 'from_port': 8, 'to_port': 0, 'cidr_blocks': ['0.0.0.0/0'] },
    #    { 'protocol': 'tcp', 'from_port': 443, 'to_port': 443, 'cidr_blocks': ['99.159.49.102/0'] }
    #    
    #],
)

export("security_group_name",security_group.name)
#size = "t2.nano"
size = "m4.2xlarge"

ips = []
hostnames = []

root_ebs= { "deleteOnTermination": True,
            #"volume_size": 12,
            "volume_size":600,
            "encrypted": True,
}

for x in range(1,5): # allows for creation of multiple of 3 instances, 3, 6, 9,12,..
 for az in aws.get_availability_zones().names: # spreads it across all az's
    #server = aws.ec2.Instance(f'web-server-{x}-{az}',
    server = aws.ec2.SpotInstanceRequest(f'webserver-{x}-{az}',
      instance_initiated_shutdown_behavior="terminate",
      instance_type=size,
      vpc_security_group_ids=[security_group.id],
      ami=ami.id,
      key_name=key.id,
      spot_price=0.25,
      availability_zone=az,
      root_block_device=root_ebs,
      tags={
          "Name":f'webservers-{x}-{az}',
      },
      #ebs_block_devices=[aws.ec2.InstanceEbsBlockDeviceArgs(
      #  delete_on_termination=True,
      #  encrypted=True,
      #  volume_size=10,
      #  device_name = "xvdd",
      #  tags={
      #    "Name":f'ebs-volume-{x}-{az}',
      #},
      #
      #)]
    opts=ResourceOptions(ignore_changes=["spot_price"]),
    )
    ips.append(server.public_ip)
    hostnames.append(server._name)

export("server_name",hostnames)