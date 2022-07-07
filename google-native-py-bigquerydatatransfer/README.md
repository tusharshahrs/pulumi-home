# Google Native with BigQuery Data Transfer in Python

A Google Native stack with a big query data transfer in python.  The big query data transfer configuration is created as a data transfer and another job in scheduled queries

## Prerequisites

Before trying to deploy this example, please make sure you have performed all of the following tasks:
- [Downloaded & installed the Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Signed up for Google Cloud](https://cloud.google.com/free/)
- [Connect Pulumi to your Google Cloud Account](https://www.pulumi.com/docs/intro/cloud-providers/gcp/setup/)

## Special Issues

- Google buckets cannot have the word or variation of *google* in its name due to the following naming [rules](https://cloud.google.com/storage/docs/naming-buckets)

## Running the Example

1. Create a new stack, which is an isolated deployment target for this example.
    ```bash
    pulumi stack init dev
    ```

1. Set the required configuration variables for this program such as **project**, **region**, & **subnet cidr blocks**.

    ```bash
    pulumi config set google-native:project pulumi-ce-team # replace with your-gcp-project-here
    pulumi config set google-native:region us-central1 # replace with your gcp region
    pulumi config set gcp:project pulumi-ce-team # using classic so also have to set this
    ```

1. Create a Python virtualenv, activate it, and install dependencies:

    This installs the dependent packages for our Pulumi program.

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip3 install -r requirements.txt
    ```

1. Run `pulumi up` to preview and deploy changes.  After the preview is shown you will be
    prompted if you want to continue or not.

    ```bash
    pulumi up
    ```

    Results
    ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/google-native-py-bigquerydatatransfer/dev/updates/155

        Type                                         Name                                       Status      
    +   pulumi:pulumi:Stack                          google-native-py-bigquerydatatransfer-dev  created     
    +   ├─ google-native:storage/v1:Bucket           demo-mybucket                              created     
    +   └─ gcp:serviceAccount:Account                demo-serviceaccount                        created     
    +      └─ gcp:projects:IAMBinding                demo-iambinding                            created     
    +         └─ gcp:bigquery:Dataset                demo-dataset                               created     
    +            ├─ gcp:bigquery:DataTransferConfig  demo-datatransferconfig                    created     
    +            └─ gcp:bigquery:DataTransferConfig  demo-datatransferconfig-storage            created     
    
    Outputs:
        big_query_dataset_friendly_name                 : "demo_test_bigquery_dataset"
        big_query_dataset_id                            : "projects/pulumi-ce-team/datasets/demo_example_dataset_for_bigquery"
        big_query_permissions_id                        : "pulumi-ce-team/roles/bigquery.admin"
        big_query_permissions_role                      : "roles/bigquery.admin"
        data_transfer_config_query_config_scheduled     : "demo-data-transfer-query"
        data_transfer_config_query_config_scheduled_time: "first sunday of quarter 00:00"
        data_transfer_config_storage                    : "demo-data-transfer-storage"
        gcp_bucket_name                                 : "demo-mybucket-558dfb2"
        gcp_bucket_url                                  : "https://www.googleapis.com/storage/v1/b/demo-mybucket-558dfb2"
        google_bucket_url                               : "gs://demo-mybucket-558dfb2"
        my_service_account_format_for_permissions       : "serviceAccount:demobigsa@pulumi-ce-team.iam.gserviceaccount.com"
        service_account_email                           : "demobigsa@pulumi-ce-team.iam.gserviceaccount.com"
        service_account_id                              : "demobigsa"
        service_account_name                            : "projects/pulumi-ce-team/serviceAccounts/demobigsa@pulumi-ce-team.iam.gserviceaccount.com"

    Resources:
        + 7 created

    Duration: 15s
    ```

1.  Show the outputs
    
    ```bash
    pulumi stack output
    ```

    Results
    ```bash
    Current stack outputs (14):
    OUTPUT                                            VALUE
    big_query_dataset_friendly_name                   demo_test_bigquery_dataset
    big_query_dataset_id                              projects/pulumi-ce-team/datasets/demo_example_dataset_for_bigquery
    big_query_permissions_id                          pulumi-ce-team/roles/bigquery.admin
    big_query_permissions_role                        roles/bigquery.admin
    data_transfer_config_query_config_scheduled       demo-data-transfer-query
    data_transfer_config_query_config_scheduled_time  first sunday of quarter 00:00
    data_transfer_config_storage                      demo-data-transfer-storage
    gcp_bucket_name                                   demo-mybucket-558dfb2
    gcp_bucket_url                                    https://www.googleapis.com/storage/v1/b/demo-mybucket-558dfb2
    google_bucket_url                                 gs://demo-mybucket-558dfb2
    my_service_account_format_for_permissions         serviceAccount:demobigsa@pulumi-ce-team.iam.gserviceaccount.com
    service_account_email                             demobigsa@pulumi-ce-team.iam.gserviceaccount.com
    service_account_id                                demobigsa
    service_account_name                              projects/pulumi-ce-team/serviceAccounts/demobigsa@pulumi-ce-team.iam.gserviceaccount.com
    ```

1. Clean Up
   ```bash
   pulumi destroy -y
   ```

1. Results
   ```bash
   Destroying (dev)

    View Live: https://app.pulumi.com/shaht/google-native-py-bigquerydatatransfer/dev/updates/133

        Type                                      Name                                       Status      
    -   pulumi:pulumi:Stack                       google-native-py-bigquerydatatransfer-dev  deleted     
    -   ├─ gcp:projects:IAMBinding                demo-iambinding                            deleted     
    -   │  └─ gcp:bigquery:Dataset                demo-dataset                               deleted     
    -   │     └─ gcp:bigquery:DataTransferConfig  demo-datatransferconfig                    deleted     
    -   ├─ gcp:serviceAccount:Account             demo-serviceaccount                        deleted     
    -   └─ google-native:storage/v1:Bucket        demo-mybucket                              deleted     
    
    Outputs:
    - big_query_dataset_friendly_name                 : "demo_test_bigquery_dataset"
    - big_query_dataset_id                            : "projects/pulumi-ce-team/datasets/demo_example_dataset_for_bigquery"
    - big_query_permissions_id                        : "pulumi-ce-team/roles/bigquery.admin"
    - big_query_permissions_role                      : "roles/bigquery.admin"
    - data_transfer_config_query_config_scheduled     : "demo-data-transfer-query"
    - data_transfer_config_query_config_scheduled_time: "first sunday of quarter 00:00"
    - gcp_bucket                                      : "https://www.googleapis.com/storage/v1/b/demo-mybucket-b4731fc"
    - my_service_account_format_for_permissions       : "serviceAccount:demobigsa@pulumi-ce-team.iam.gserviceaccount.com"
    - service_account_email                           : "demobigsa@pulumi-ce-team.iam.gserviceaccount.com"
    - service_account_id                              : "demobigsa"
    - service_account_name                            : "projects/pulumi-ce-team/serviceAccounts/demobigsa@pulumi-ce-team.iam.gserviceaccount.com"

    Resources:
        - 7 deleted

    Duration: 12s

    The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained. 
    If you want to remove the stack completely, run 'pulumi stack rm dev'.
   ```