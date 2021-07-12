"""A Google Native Cloud Python Pulumi program"""

import pulumi
from pulumi_google_native.storage import v1 as storage
from configs import getResourceName, projectName, stackName

# Generate common tags
# common tags.  need to pass in
commonTags = {
    "project": projectName,
    "stack": stackName,
}

config = pulumi.Config()
project_name = config.require('project')

myname = "demo"

# Restriction on passing name with project that has google in it: https://cloud.google.com/storage/docs/naming-buckets
# Create a Google Cloud resource (Storage Bucket)
bucket = storage.Bucket(getResourceName(f"{myname}-bucket"), project=project_name, labels=commonTags)
"""
Outputs:
  + bucket_name                     : "pulumi-gcp-native-demo-bucket-223cb30"
  + bucket_url                      : "https://www.googleapis.com/storage/v1/b/pulumi-gcp-native-demo-bucket-223cb30"
"""

bucket_emptyresourcename = storage.Bucket(getResourceName(), project=project_name, labels=commonTags)
"""
Outputs:
  + bucket_emptyresourcename_name   : "pulumi-gcp-native-86cbd3a"
  + bucket_emptyresourcename_url    : "https://www.googleapis.com/storage/v1/b/pulumi-gcp-native-86cbd3a"
"""

# Export the bucket name
pulumi.export('bucket_name', bucket.name)
# Export the bucket self-link
pulumi.export('bucket_url', bucket.self_link)

# Export the bucket name
pulumi.export('bucket_emptyresourcename_name', bucket_emptyresourcename.name)
# Export the bucket self-link
pulumi.export('bucket_emptyresourcename_url', bucket_emptyresourcename.self_link)