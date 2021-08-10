# Google Native with VPC, Postgres Server, and Cloud Function in Python

A Google Native stack with a vpc, postgres server, and cloud function in python.

## Prerequisites

Before trying to deploy this example, please make sure you have performed all of the following tasks:
- [Downloaded & installed the Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Signed up for Google Cloud](https://cloud.google.com/free/)
- [Connect Pulumi to your Google Cloud Account](https://www.pulumi.com/docs/intro/cloud-providers/gcp/setup/)

## Special Issues

- Google buckets cannot have the word or variation of *google* in its name due to the following naming [rules](https://cloud.google.com/storage/docs/naming-buckets)
- Google native does not support a native sql user due to [this](https://github.com/pulumi/pulumi-google-native/issues/47) so we use google classic provider

## Running the Example

1. Create a new stack, which is an isolated deployment target for this example.
    ```bash
    pulumi stack init dev
    ```

1. Set the required configuration variables for this program such as **project**, **region**, & **subnet cidr blocks**.

    ```bash
    pulumi config set google-native:project pulumi-ce-team # replace with your-gcp-project-here
    pulumi config set google-native:region us-central1 # replace with your gcp region
    pulumi config set subnet_cidr_blocks '["10.0.0.0/25","10.0.0.128/26","10.0.0.192/26"]' 
    pulumi config set google-native:file_archive_path  ./pythonfunction  # Location of the python function
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

    Preview Results
    ```bash

    View Live: https://app.pulumi.com/myuser/google-native-py-network-postgres-function/dev/previews/08d803b5-d7b7-4adc-99da-39ff9678b0d2

     Type                                                              Name                                            Plan       
    +   pulumi:pulumi:Stack                                               google-native-py-network-postgres-function-dev  create     
    +   ├─ custom:network:VPC                                             gcp-native                                      create     
    +   │  └─ google-native:compute/v1:Network                            gcp-native-vpc                                  create     
    +   │     ├─ google-native:compute/v1:Subnetwork                      gcp-native-subnet-0                             create     
    +   │     ├─ google-native:compute/v1:Subnetwork                      gcp-native-subnet-1                             create     
    +   │     ├─ google-native:compute/v1:Subnetwork                      gcp-native-subnet-2                             create     
    +   │     └─ google-native:compute/v1:Router                          gcp-native-router                               create     
    +   ├─ custom:database:Postgres                                       gcp-native                                      create     
    +   │  └─ google-native:sqladmin/v1beta4:Instance                     gcp-native-sqlinstance                          create     
    +   │     ├─ google-native:sqladmin/v1beta4:Database                  gcp-native-sqldatabase                          create     
    +   │     └─ gcp:sql:User                                             gcp-native-sql-user                             create     
    +   ├─ custom:cloudfunctions:Function                                 gcp-native                                      create     
    +   │  └─ google-native:storage/v1:Bucket                             gcp-native-function-bucket                      create     
    +   │     └─ google-native:storage/v1:BucketObject                    gcp-native-function-bucketobject                create     
    +   │        └─ google-native:cloudfunctions/v1:Function              gcp-native-function                             create     
    +   │           └─ google-native:cloudfunctions/v1:FunctionIamPolicy  gcp-native-function-iam                         create     
    +   └─ random:index:RandomPassword                                    gcp-native-sqluser-password                     create     
    
    Resources:
        + 17 to create

    Do you want to perform this update?  [Use arrows to move, enter to select, type to filter]
    yes
    > no
    details
    ```
1. Select **yes**

   Results
   ```bash
   Updating (dev)

    View Live: https://app.pulumi.com/myuser/google-native-py-network-postgres-function/dev/updates/263

        Type                                                              Name                                            Status      
    +   pulumi:pulumi:Stack                                               google-native-py-network-postgres-function-dev  created     
    +   ├─ custom:network:VPC                                             gcp-native                                      created     
    +   │  └─ google-native:compute/v1:Network                            gcp-native-vpc                                  created     
    +   │     ├─ google-native:compute/v1:Subnetwork                      gcp-native-subnet-0                             created     
    +   │     ├─ google-native:compute/v1:Subnetwork                      gcp-native-subnet-1                             created     
    +   │     ├─ google-native:compute/v1:Subnetwork                      gcp-native-subnet-2                             created     
    +   │     └─ google-native:compute/v1:Router                          gcp-native-router                               created     
    +   ├─ custom:database:Postgres                                       gcp-native                                      created     
    +   │  └─ google-native:sqladmin/v1beta4:Instance                     gcp-native-sqlinstance                          created     
    +   │     ├─ google-native:sqladmin/v1beta4:Database                  gcp-native-sqldatabase                          created     
    +   │     └─ gcp:sql:User                                             gcp-native-sql-user                             created     
    +   ├─ custom:cloudfunctions:Function                                 gcp-native                                      created     
    +   │  └─ google-native:storage/v1:Bucket                             gcp-native-function-bucket                      created     
    +   │     └─ google-native:storage/v1:BucketObject                    gcp-native-function-bucketobject                created     
    +   │        └─ google-native:cloudfunctions/v1:Function              gcp-native-function                             created     
    +   │           └─ google-native:cloudfunctions/v1:FunctionIamPolicy  gcp-native-function-iam                         created     
    +   └─ random:index:RandomPassword                                    gcp-native-sqluser-password                     created     
    
    Outputs:
        cloudfunction_bucket                     : "gcp-native-function-bucket-d3edf76"
        cloudfunction_name                       : "projects/pulumi-ce-team/locations/us-central1/functions/gcp-native-function-2e67846"
        cloudfunction_short_name                 : "gcp-native-function-2e67846"
        cloudfunction_url                        : "https://us-central1-pulumi-ce-team.cloudfunctions.net/gcp-native-function-2e67846"
        cloudsql_database_name                   : "gcp-native-sqldatabase-b018586"
        cloudsql_instance_database_engine_version: "POSTGRES_13"
        cloudsql_instance_name                   : "gcp-native-sqlinstance-0cf610b"
        sql_user_name                            : "pulumiadmin"
        sql_user_password                        : "[secret]"
        vpc_name                                 : "gcp-native-vpc-59c5df0"
        vpc_subnet_1_name                        : "gcp-native-subnet-0-e3b7584"
        vpc_subnet_2_name                        : "gcp-native-subnet-1-6e97e36"
        vpc_subnet_3_name                        : "gcp-native-subnet-2-995d196"

    Resources:
        + 17 created

    Duration: 13m20s
   ```

1. View the stack outputs

    ```bash
    pulumi stack output
    ```

    Results
    ```bash
    Current stack outputs (13):
    OUTPUT                                     VALUE
    cloudfunction_bucket                       gcp-native-function-bucket-d3edf76
    cloudfunction_name                         projects/pulumi-ce-team/locations/us-central1/functions/gcp-native-function-2e67846
    cloudfunction_short_name                   gcp-native-function-2e67846
    cloudfunction_url                          https://us-central1-pulumi-ce-team.cloudfunctions.net/gcp-native-function-2e67846
    cloudsql_database_name                     gcp-native-sqldatabase-b018586
    cloudsql_instance_database_engine_version  POSTGRES_13
    cloudsql_instance_name                     gcp-native-sqlinstance-0cf610b
    sql_user_name                              pulumiadmin
    sql_user_password                          [secret]
    vpc_name                                   gcp-native-vpc-59c5df0
    vpc_subnet_1_name                          gcp-native-subnet-0-e3b7584
    vpc_subnet_2_name                          gcp-native-subnet-1-6e97e36
    vpc_subnet_3_name                          gcp-native-subnet-2-995d196
    ```

1. Check the deployed function endpoint

   ```bash
   curl "$(pulumi stack output cloudfunction_url)"
   ```
   Expected Results
   **Hello, World!  Welcome to Google Native in Python via Pulumi!**

1. Clean up your Google Cloud &  Pulumi resources

    ```bash
    pulumi destroy -y
    ```

1. Remove your stack
    ```bash
    pulumi stack rm dev -y
    ```