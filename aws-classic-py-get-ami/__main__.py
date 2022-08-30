"""An AWS Python Pulumi program"""

import pulumi
from pulumi_aws import ec2

# Get the AMI
ami = ec2.get_ami(
    owners=['amazon'],
    most_recent=True,
    filters=[ec2.GetAmiFilterArgs(
        name='name',
        values=['amzn2-ami-k*-hvm-*-x86_64-gp2'],
    )],
)

pulumi.export("my_ami", ami.name)