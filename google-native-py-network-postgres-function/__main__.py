"""A Google Native Cloud Python Pulumi program"""

import pulumi
from configs import getResourceName, project_name, stack_name, subnet_cidr_blocks
import network
import database
import cloudfunction

# Generate common tags
# common tags.  need to pass in
commonTags = {
    "project": project_name,
    "stack": stack_name,
}

config = pulumi.Config("google-native")
region_name = config.require("region")
file_archive_location = config.require("file_archive_path")

# creates a google vpc
vpc = network.Vpc(getResourceName(), network.VpcArgs(subnet_cidr_blocks=subnet_cidr_blocks,region=region_name ))

# create a google postgres sql instance, database, and sqluser
postgres = database.Databases(getResourceName(), database.DatabaseArgs(region=region_name, tags=commonTags ))

# create a google cloudfunction
serverlessfunction = cloudfunction.Functions(getResourceName(),cloudfunction.FunctionArgs(region=region_name, tags=commonTags, filearchivepath = file_archive_location))

## Network Outputs ##
# Export the vpc name
pulumi.export('vpc_name', vpc.network.name)
# Export the subnet names
pulumi.export('vpc_subnet_1_name', vpc.subnets[0].name)
pulumi.export('vpc_subnet_2_name', vpc.subnets[1].name)
pulumi.export('vpc_subnet_3_name', vpc.subnets[2].name)

## Cloud SQL Outputs ##
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

## Function Outputs ##
# Export the google bucket that has the function
pulumi.export("cloudfunction_bucket", serverlessfunction.buckets.name)
# Retrieveing the cloudfunction short name
functionname = serverlessfunction.cloudfunctions.name.apply(lambda functioname: functioname.split("/")[-1])
# Export the function name.  Default name includes project, region, and function name
pulumi.export("cloudfunction_name", serverlessfunction.cloudfunctions.name)
# Export the cloud function short name
pulumi.export("cloudfunction_short_name", functionname)
# Export the function url
pulumi.export("cloudfunction_url", serverlessfunction.cloudfunctions.https_trigger.url)