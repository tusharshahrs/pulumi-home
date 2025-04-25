"""An AWS Python Pulumi program"""

from pulumi import Config, export, ResourceOptions
import pulumi_awsx as awsx
import pulumi_aws as aws
import pulumi_tls as tls


# importing local configs
config = Config()

my_vpc_cidr_block = config.get("vpc_cidr_block") or "10.0.0.0/23"
my_number_of_availability_zones = config.get_int("number_of_availability_zones") or 3
myname = config.get("nameset") or "demo"
mynumber_of_servers = config.get_int("number_of_servers") or 3

awsConfig = Config("aws")
awsRegion = awsConfig.get("region")
if awsRegion == "us-west-2":
    myami = "ami-0d61ea20f09848335" # This is the AMI ID for Amazon Linux 2 in us-west-2; update as needed
elif awsRegion == "us-east-1":      
    myami = "ami-0e449927258d45bc4" # This is the AMI ID for Amazon Linux 2 in us-east-1; update as needed


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

# Create a key pair for the EC2 instance

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
export("mykeypair_id",mykeypair.id)

# Create a security group
security_group = aws.ec2.SecurityGroup(
    f"{myname}-securitygroup",
    vpc_id=my_vpc.vpc_id,
    description="Allow SSH inbound traffic",
    # No ingress rules for now
    #ingress=[
    #    {
    #        "protocol": "tcp",
    #        "from_port": 22,
    #        "to_port": 22,
    #        "cidr_blocks": ["0.0.0.0/0"],
    #    },
    #],
    egress=[
        {
            "protocol": "-1",
            "from_port": 0,
            "to_port": 0,
            "cidr_blocks": ["0.0.0.0/0"],
        },
    ],
    tags={
        "Name":f"{myname}-securitygroup",
    },
    opts=ResourceOptions(depends_on=[my_vpc])
)

export("security_group_id", security_group.id)

#export("private_subnet_id_0",my_vpc.private_subnet_ids[0])

# Launch 10 EC2 instances
instance_ids = []
for i in range(mynumber_of_servers):
    azlocation = i % 3
    if azlocation == 0 and awsRegion == "us-east-1":
        azlocation = azlocation + 1
    instance = aws.ec2.Instance(
        f"{myname}-instance-{i}",
        instance_type="t3a.nano",
        #instance_type="t3a.small",
        subnet_id=my_vpc.private_subnet_ids[(azlocation)], # This will distribute instances across the last 2 private subnets excluding us-east-1a (northern virginia does not work with instance type t3a.small
        associate_public_ip_address=False,   
        
        ami=myami,
        key_name=mykeypair.key_name,
        vpc_security_group_ids=[security_group.id],
        tags={
            "Name": f"{myname}-instance-{i}",
            "environment": "dev",
            "team": "finops",
            "purpose": "spotscheduler",
        },
    opts=ResourceOptions(depends_on=[my_vpc, security_group, mykeypair]),
    )
    instance_ids.append(instance.id)

export("ec2_instance_ids", instance_ids)


# Export the VPC ID
export("vpc_id", my_vpc.vpc_id)
# Create a public subnet in the VPC
export("public_subnet_ids", my_vpc.public_subnet_ids)
# Create a private subnet in the VPC
export("private_subnet_ids", my_vpc.private_subnet_ids)