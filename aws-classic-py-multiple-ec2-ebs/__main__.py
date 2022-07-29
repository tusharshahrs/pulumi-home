"""An AWS Python Pulumi program"""

#from multiprocessing.pool import TERMINATE
#from telnetlib import ENCRYPT
import pulumi
import pulumi_aws as aws
import pulumi_awsx as awsx

from pulumi import export, ResourceOptions, Config, Output
import json

# importing local configs
config = Config()
my_vpc_cidr_block = config.get("vpc_cidr_block") or "10.0.0.0/24"
my_number_of_nat_gateways_requested = config.get_int("number_of_nat_gateways") or 1
my_number_of_availability_zones = config.get_int("number_of_availability_zones") or 3
#myip = config.get_secret("my_ipaddress");

# variable for name
myname = "demo"

# VPC
myvpc = awsx.ec2.Vpc(f"{myname}-vpc",
    cidr_block= my_vpc_cidr_block,
    number_of_availability_zones = my_number_of_availability_zones,
    nat_gateways = my_number_of_nat_gateways_requested,
    tags={
        "Name":f"{myname}-vpc",
      },
    )

export("vpc_id",myvpc.vpc_id)
export("vpc_cidr_block", my_vpc_cidr_block)
export("number_of_natgateways",my_number_of_nat_gateways_requested)
export("number_of_availabililty_zones",my_number_of_availability_zones)
export("public_subnets",myvpc.public_subnet_ids)
export("public_subnets_0",myvpc.public_subnet_ids[0])
export("public_subnets_1",myvpc.public_subnet_ids[1])
export("public_subnets_2",myvpc.public_subnet_ids[2])
export("private_subnets",myvpc.private_subnet_ids)
export("private_subnets_0",myvpc.private_subnet_ids[0])
export("private_subnets_1",myvpc.private_subnet_ids[1])
export("private_subnets_2",myvpc.private_subnet_ids[2])



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

# Create the keypair
key = aws.ec2.KeyPair(f"{myname}-key",public_key="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQD3F6tyPEFEzV0LX3X8BsXdMsQz1x2cEikKDEY0aIj41qgxMCP/iteneqXSIFZBp5vizPvaoIR3Um9xK7PGoW8giupGn+EPuxIA4cDM4vzOqOkiMPhz5XK0whEjkVzTo4+S0puvDZuwIsdiW9mxhJc7tgBNL0cYlWSYVkz4G/fslNfRPW5mYAM49f4fhtxPb5ok4Q2Lg9dPKVHO/Bgeu5woMc7RY0p1ej6D4CKFE6lymSDJpW0YHX/wqE9+cfEauh7xZcG0q9t2ta6F6fmX0agvpFyZo8aFbXeUBr7osSCJNgvavWbM/06niWrOvYX2xwWdhXmXSrbX8ZbabVohBK41 tushar@pulumi.com")
export("key_id",key.id)

# Create the security group and makes sure it is attached to the vpc
security_group = aws.ec2.SecurityGroup(f"{myname}-securitygroup",
    vpc_id=myvpc.vpc_id,
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
            cidr_blocks=['0.0.0.0/0'],
            description="ingress rules to server"
        )
    ],
    tags={
        "Name":f"{myname}-securitygroup",
    },

    opts=ResourceOptions(depends_on=myvpc,parent=myvpc),
)

export("security_group_name",security_group.name)

# size of ec2 instance
size = "t2.micro"
#size = "m4.2xlarge"

# set size, encryption and deletion of ebs ROOT volume
root_ebs= { "deleteOnTermination": True,
            "volume_size": 12,
            "encrypted": True,
}

# For collecting hostnames and ips to export
ips = []
hostnames = []


myrange = 1
for x in range(0,myrange): # allows for creation of multiple of 3 instances, 3, 6, 9,12,..
 #for az in aws.get_availability_zones().names: # spreads it across all az's
  for y in range(0,2): # spreads it across all 3 subnets that are attached to the vpc
    server = aws.ec2.Instance(f'webserver-{x}-{y}',
    #server = aws.ec2.SpotInstanceRequest(f'webserver-{x}-{y}', # spot instancetemplate for testing
      instance_initiated_shutdown_behavior="terminate",
      instance_type=size,
      ami=ami.id,
      key_name=key.id,
      #spot_price=0.25, # uncomment when using spot
      vpc_security_group_ids=[security_group.id],
      subnet_id=myvpc.public_subnet_ids[y],
      root_block_device=root_ebs,
      tags={
          "Name":f'webserver-{x}-publicsubnet-{y}',
          #"spot":"yes", # uncomment when using spot
      },
      ebs_block_devices=[aws.ec2.InstanceEbsBlockDeviceArgs(
        delete_on_termination=True,
        encrypted=True,
        volume_size=10,
        device_name = "xvdd",
        tags={
            "Name":f'ebs-volume-{x}-publicsubnet-{y}',
      },
      )],

    opts=ResourceOptions(ignore_changes=["spot_price"], depends_on=[security_group,key]),
    )
    ips.append(server.public_ip)
    hostnames.append(server._name)

export("server_names",hostnames)