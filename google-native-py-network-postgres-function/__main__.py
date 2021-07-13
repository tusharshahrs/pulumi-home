"""A Google Native Cloud Python Pulumi program"""

import pulumi
from pulumi.resource import ResourceOptions
from pulumi_google_native.compute.v1 import Network as Network
from pulumi_google_native.storage.v1 import Bucket as Bucket
from pulumi_google_native.sqladmin.v1beta4 import Instance, SettingsArgs, database
from configs import getResourceName, projectName, stackName, subnet_cidr_blocks
import network

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
"""
Outputs:
  + bucket_name                     : "pulumi-gcp-native-demo-bucket-223cb30"
  + bucket_url                      : "https://www.googleapis.com/storage/v1/b/pulumi-gcp-native-demo-bucket-223cb30"
"""

bucket_emptyresourcename = Bucket(getResourceName(), project=project_name, labels=commonTags)
"""
Outputs:
  + bucket_emptyresourcename_name   : "pulumi-gcp-native-86cbd3a"
  + bucket_emptyresourcename_url    : "https://www.googleapis.com/storage/v1/b/pulumi-gcp-native-86cbd3a"
"""

# creates vpc
vpc = network.Vpc(getResourceName(f"{myname}"), network.VpcArgs(subnet_cidr_blocks=subnet_cidr_blocks, project = project_name,region = region_name ))

# Export the bucket name
pulumi.export('bucket_name', bucket.name)
# Export the bucket self-link
pulumi.export('bucket_url', bucket.self_link)

# Export the bucket name
pulumi.export('bucket_emptyresourcename_name', bucket_emptyresourcename.name)
# Export the bucket self-link
pulumi.export('bucket_emptyresourcename_url', bucket_emptyresourcename.self_link)

# Export the vpc
pulumi.export('vpc_name', vpc.network.name)
# Export the subnet names
pulumi.export('vpc_subnet_1_name', vpc.subnets[0].name)
pulumi.export('vpc_subnet_2_name', vpc.subnets[1].name)
pulumi.export('vpc_subnet_3_name', vpc.subnets[2].name)

database_instance = Instance(getResourceName(f"{myname}-database"),
                             project=project_name,
                             database_version="POSTGRES_13",
                             settings=SettingsArgs(activation_policy = "ALWAYS",
                                                   availability_type = "REGIONAL",
                                                   data_disk_size_gb = "20",
                                                   data_disk_type = "PD_SSD",
                                                   tier="db-f1-micro",
                                                   backup_configuration= {"enabled": True, "point_in_time_recovery_enabled": True}
                                                  
                             )
                             )
                             
pulumi.export('database_version', database_instance.database_version)
pulumi.export('database_name', database_instance.name)
pulumi.export('database_uri', database_instance.self_link)