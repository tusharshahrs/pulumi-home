"""An AWS Python Pulumi program"""

import pulumi
import pulumi_aws as aws

awsConfig = pulumi.Config("aws")
awsRegion = awsConfig.get("region")

if  awsRegion != "us-east-2":
  raise ValueError("provider has bad region")

pulumi.export("aws_region_selected", awsRegion)
