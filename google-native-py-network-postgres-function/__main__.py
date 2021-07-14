"""A Google Native Cloud Python Pulumi program"""

import pulumi
from pulumi.resource import ResourceOptions
from pulumi_google_native.compute.v1 import Network as Network
from pulumi_google_native.sqladmin.v1beta4.database import Database
from pulumi_google_native.storage.v1 import Bucket as Bucket
from pulumi_google_native.sqladmin.v1beta4 import Instance, SettingsArgs
from configs import getResourceName, projectName, stackName, subnet_cidr_blocks
import network
import database

# Generate common tags
# common tags.  need to pass in
commonTags = {
    "project": projectName,
    "stack": stackName,
}

config = pulumi.Config("google-native")
project_name = config.require("project")
region_name = config.require("region")

myname = "demo"

# Restriction on passing name with project that has google in it: https://cloud.google.com/storage/docs/naming-buckets

# Create a Google Cloud resource (Storage Bucket)
bucket = Bucket(getResourceName(f"{myname}-bucket"), project=project_name, labels=commonTags)

# creates vpc
vpc = network.Vpc(getResourceName(f"{myname}"), network.VpcArgs(subnet_cidr_blocks=subnet_cidr_blocks, project=project_name, region=region_name ))

# create postgres sql instance
postgres = database.Databases(getResourceName(f"{myname}"), database.DatabaseArgs(project=project_name, region=region_name, tags=commonTags ))

# Export the bucket name
pulumi.export('bucket_name', bucket.name)
# Export the bucket self-link
pulumi.export('bucket_url', bucket.self_link)


## Network Outputs
# Export the vpc name
pulumi.export('vpc_name', vpc.network.name)
# Export the vpc id
pulumi.export('vpc_id', vpc.network.id)
# Export the subnet names
pulumi.export('vpc_subnet_1_name', vpc.subnets[0].name)
pulumi.export('vpc_subnet_2_name', vpc.subnets[1].name)
pulumi.export('vpc_subnet_3_name', vpc.subnets[2].name)

# Database Outputs
# Export the sql instance name
pulumi.export("sqlinstance_name", postgres.sqlinstance.name)
# Export the sql instance urli link
pulumi.export("sqlinstance_uri", postgres.sqlinstance.self_link)
# Export the sql instance database version
pulumi.export("sqlinstance_database_engine_version", postgres.sqlinstance.database_version)


# Export the sqldatabase name
pulumi.export("sqldatabase_name", postgres.sqldatabase.name)

# Export the sqldatabase uri
pulumi.export("sqldatabase_uri", postgres.sqldatabase.self_link)