"""An AWS Python Pulumi program"""

from curses import keyname
import pulumi
import pulumi_aws as aws
import pulumi_tls as tls
import pulumi_kafka as kafka
from pulumi import export, ResourceOptions, Config, StackReference

# read local config settings - network
config = Config()
# reading in vpc StackReference Path from local config
mystackpaths = config.require("mystackpath")
mystoodupvpc = StackReference(mystackpaths)
public_subnets = mystoodupvpc.require_output("public_subnets")
subnetAz1 = public_subnets.apply(lambda public_subnet_ids: public_subnet_ids[0])
mysecuritygroup = mystoodupvpc.require_output("security_group_id")

myname = "shahtushar"

# ssh private key
sshPrivateKey = tls.PrivateKey(f"{myname}-privatekey",
    algorithm="RSA",
    rsa_bits= 4096,
)

export("sshPrivateKey_id",sshPrivateKey.id)

# ec2 key pair
mykeypair = aws.ec2.KeyPair(f"{myname}-keypair",
    public_key=sshPrivateKey.public_key_openssh
)

export("keypair_name",mykeypair.key_name)

# Get the AMI
ami = aws.ec2.get_ami(
    owners=['amazon'],
    most_recent=True,
    filters=[aws.ec2.GetAmiFilterArgs(
        name='name',
        values=['amzn2-ami-hvm-2.0.????????-x86_64-gp2'],
    )],
)

pulumi.export("my_ami_name", ami.name)
pulumi.export("my_ami_id", ami.id)

size = "t3a.micro"

#healthCheckTopic = kafka.Topic(f"{myname}-healthCheckTopic",
#    partitions = 3,
#    replication_factor= 3
#)

#export("healthchecktopic_name",healthCheckTopic.name)

# https://archive.apache.org/dist/kafka/2.6.2/
userData ="""#!/bin/bash
    sudo yum update -y
    sudo yum -y install curl
    sudo yum -y install java-1.8.0
    cd /home/ec2-user
    wget https://archive.apache.org/dist/kafka/2.6.2/kafka_2.12-2.6.2.tgz 

    tar -xzf kafka_2.12-2.6.2.tgz
    curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
    sudo yum install -y nodejs
    curl -fsSL https://get.pulumi.com | sh -s -- --version 3.35.0
    """

msk_client_instance = aws.ec2.Instance(f"{myname}-msk-instance",
    ami=ami.id,
    instance_type=size,
    ebs_optimized=True,
    user_data=userData,
    instance_initiated_shutdown_behavior="terminate",
    key_name=mykeypair.key_name,
    subnet_id=subnetAz1,
    vpc_security_group_ids=[mysecuritygroup],
    opts=ResourceOptions(depends_on=[mykeypair])
)

export("msk_ec2_client", msk_client_instance.id)