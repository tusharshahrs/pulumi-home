"""A Google Native Cloud Python Pulumi program"""

import pulumi
from pulumi_google_native.compute.v1 import Network as Network
from configs import getResourceName, projectName, stackName, subnet_cidr_blocks
import network
import database
import cloudfunction

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

# creates a google vpc
vpc = network.Vpc(getResourceName(f"{myname}"), network.VpcArgs(subnet_cidr_blocks=subnet_cidr_blocks, project=project_name, region=region_name ))

# create a google postgres sql instance, database, and sqluser
#postgres = database.Databases(getResourceName(f"{myname}"), database.DatabaseArgs(project=project_name, region=region_name, tags=commonTags ))

# create a google cloudfunction
serverlessfunction = cloudfunction.Functions(getResourceName(f"{myname}"),cloudfunction.FunctionArgs(project=project_name, region=region_name, tags=commonTags))

### Outputs ###

## Network  ##
# Export the vpc name
pulumi.export('vpc_name', vpc.network.name)
# Export the subnet names
pulumi.export('vpc_subnet_1_name', vpc.subnets[0].name)
pulumi.export('vpc_subnet_2_name', vpc.subnets[1].name)
pulumi.export('vpc_subnet_3_name', vpc.subnets[2].name)
"""
## Cloud SQL ##
# Export the sql instance name
pulumi.export("cloudsql_instance_name", postgres.sqlinstance.name)
# Export the sql instance database version
pulumi.export("cloudsql_instance_database_engine_version", postgres.sqlinstance.database_version)
# Export the sqldatabase name
pulumi.export("cloudsql_database_name", postgres.sqldatabase.name)
# Export the sqluser name
pulumi.export("sql_user_name", postgres.sqluser.name)
# Export the sqluser password
pulumi.export("sql_user_password", postgres.sqluser.password)
"""
## Function ##
# Export the function name
pulumi.export("serverless_name", serverlessfunction.cloudfunctions.name)
# Export the function url
pulumi.export("serverless_url", serverlessfunction.cloudfunctions.https_trigger.url)