"""A Google Cloud Python Pulumi program"""

import email
from turtle import up
from urllib.request import BaseHandler
import pulumi
from pulumi_google_native.storage import v1 as storage
from pulumi_google_native.bigquerydatatransfer import v1 as bqdt
from pulumi import ResourceOptions, Output
import pulumi_gcp as gcp

name = "demo"
# Create a Google Cloud resource (Storage Bucket)
bucket = storage.Bucket(f"{name}-mybucket")

# Export the bucket self-link
pulumi.export('gcp_bucket', bucket.self_link)

# Create a service account
bq_service_account = gcp.serviceaccount.Account(f"{name}-serviceaccount",
    account_id=f"{name}bigsa",
    display_name = f"{name}_bigquery_service_account",
    description=f"{name} service account for bigquery")

# export service account information
pulumi.export("service_account_name", bq_service_account.name)
pulumi.export("service_account_email", bq_service_account.email)
pulumi.export("service_account_id",bq_service_account.account_id)

# Will need to get the project for bigquery
myproject = gcp.organizations.get_project()
# Need to create a string that is in the following format.  Note, this is a output and not really a string.
my_service_account_format_for_permissions = Output.concat("serviceAccount:",bq_service_account.email)

# export the string to validate the value we will pass later on in the program
pulumi.export("my_service_account_format_for_permissions",my_service_account_format_for_permissions)

# create a role for big query and bind it to the service account
big_query_permissions = gcp.projects.IAMBinding(f"{name}-iambinding",
    project=myproject.project_id,
    role="roles/bigquery.admin",
    members=[my_service_account_format_for_permissions]
    )

pulumi.export("big_query_permissions_id",big_query_permissions.id)
pulumi.export("big_query_permissions_role",big_query_permissions.role)

# Create a big query dataset
my_bigquery_dataset = gcp.bigquery.Dataset(f"{name}-dataset",
    #dataset_id="shaht_example_dataset",
    dataset_id=f"{name}_example_dataset_for_bigquery",
    #friendly_name="shaht_test_dataset",
    friendly_name=f"{name}_test_bigquery_dataset",
    #description="This is a tushar test description",
    description="This is a an example demo bigquery dataset created via pulumi code in python",
    default_table_expiration_ms=3600000,
    labels={
        "env": "default",
        "owner": "demo",
    },
    accesses=[
        #gcp.bigquery.DatasetAccessArgs(
        #    role="roles/bigquery.admin",
        #    user_by_email=bq_service_account.email,
        #),
        #gcp.bigquery.DatasetAccessArgs(
        #    role="roles/bigquery.dataOwner",
        #    user_by_email=bq_service_account.email,
        #),
        #gcp.bigquery.DatasetAccessArgs(
        #    role="OWNER",
        #    user_by_email=bq_service_account.email,
        #),
    ],
    opts=pulumi.ResourceOptions(depends_on=[big_query_permissions], parent=big_query_permissions)
    )

# Export the big query outputs
pulumi.export("big_query_dataset_friendly_name", my_bigquery_dataset.friendly_name)
pulumi.export("big_query_dataset_id", my_bigquery_dataset.id)

# This creates a scheduled data transfer config query.
query_config = gcp.bigquery.DataTransferConfig(f"{name}-datatransferconfig",
    display_name=f"{name}-data-transfer-query",
    location="us",
    data_source_id="scheduled_query",
    schedule="first sunday of quarter 00:00",
    destination_dataset_id=my_bigquery_dataset.dataset_id,
    params={
        "destination_table_name_template": "my_table",
        "write_disposition": "WRITE_APPEND",
        "query": "SELECT name FROM tabl WHERE x = 'y'",
    },
    #service_account_name=bq_service_account.name,
    service_account_name=bq_service_account.email,
    opts=pulumi.ResourceOptions(depends_on=[my_bigquery_dataset], parent=my_bigquery_dataset))

# export the outputs from the scheduled query that is created above
pulumi.export("data_transfer_config_query_config_scheduled",query_config.display_name)
pulumi.export("data_transfer_config_query_config_scheduled_time",query_config.schedule)

"""query_config_storage = gcp.bigquery.DataTransferConfig(f"{name}-datatransferconfig-storage",
    display_name=f"{name}-data-transfer-storage",
    location="us",
    data_source_id="google_cloud_storage",
    schedule="None",
    destination_dataset_id=my_bigquery_dataset.dataset_id,
    params={
        "destination_table_name_template": "my_table",
        "write_disposition": "WRITE_APPEND",
        "query": "SELECT name FROM table WHERE x = 'y'",
    },
    service_account_name=bq_service_account.email,
    opts=pulumi.ResourceOptions(depends_on=[my_bigquery_dataset,big_query_permissions], parent=my_bigquery_dataset))
"""