# Google Native with VPC, Postgres Server, and Cloud Function in Python

A Google Native stack with a vpc, postgres server, and cloud function in python.

## Prerequisites

Before trying to deploy this example, please make sure you have performed all of the following tasks:
- [Downloaded & installed the Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Signed up for Google Cloud](https://cloud.google.com/free/)
- [Connect Pulumi to your Google Cloud Account](https://www.pulumi.com/docs/intro/cloud-providers/gcp/setup/)

## Special Issues

- Google buckets cannot have the word or variation of *google* in its name due to the following naming [rules](https://cloud.google.com/storage/docs/naming-buckets)
- The CloudFunctions [name](https://www.pulumi.com/docs/reference/pkg/google-native/cloudfunctions/v1/function/#name_python) has to contain the following words:  *projects*, *locations*, and the word *functions*.
- Due to the CloudFunction name issue above, the [FunctionIamPolicy](https://www.pulumi.com/docs/reference/pkg/google-native/cloudfunctions/v1/functioniampolicy/) [function_id](https://www.pulumi.com/docs/reference/pkg/google-native/cloudfunctions/v1/functioniampolicy/#function_id_python) has a limit on cloudfunction name so we have to pass this in differently.
- Google native does not support a native sql user due to [this](https://github.com/pulumi/pulumi-google-native/issues/47) so we use google classic provider

## Running the Example

1. Create a new stack, which is an isolated deployment target for this example.
    ```bash
    pulumi stack init dev
    ```

1. Set the required configuration variables for this program such as **project**, **region**, & **subnet cidr blocks**.

    ```bash
    pulumi config set google-native:project [your-gcp-project-here]
    pulumi config set google-native:region us-central1 # any valid region
    pulumi config set subnet_cidr_blocks '["10.0.0.0/25","10.0.0.128/26","10.0.0.192/26"]'
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

    Previewing update (dev)

    View Live: https://app.pulumi.com/myuser/google-native-py-network-postgres-function/dev/previews/2cd793ab-893f-4bc0-9bf9-21eee09514f5

        Type                                              Name                                            Plan       
    +   pulumi:pulumi:Stack                               google-native-py-network-postgres-function-dev  create.    
    +   ├─ custom:network:VPC                             gcp-native-demo                                 create     
    +   │  └─ google-native:compute/v1:Network            gcp-native-demo-vpc                             create     
    +   │     ├─ google-native:compute/v1:Subnetwork      gcp-native-demo-subnet-0                        create     
    +   │     ├─ google-native:compute/v1:Subnetwork                gcp-native-demo-subnet-2                        create     
    +   pulumi:pulumi:Stack                                         google-native-py-network-postgres-function-dev  create     
    +   │     └─ google-native:compute/v1:Router                    gcp-native-demo-router                          create     
    +   ├─ custom:database:Postgres                                 gcp-native-demo                                 create     
    +   │  └─ google-native:sqladmin/v1beta4:Instance               gcp-native-demo-sqlinstance                     create     
    +   │     ├─ google-native:sqladmin/v1beta4:Database            gcp-native-demo-sqldatabase                     create     
    +   │     └─ gcp:sql:User                                       gcp-native-demo-sql-user                        create     
    +   ├─ custom:cloudfunctions:Function                           gcp-native-demo                                 create     
    +   │  ├─ google-native:storage/v1:Bucket                       gcp-native-demo-function-bucket                 create     
    +   │  │  └─ google-native:storage/v1:BucketObject              gcp-native-demo-function-bucketobject           create     
    +   │  └─ google-native:cloudfunctions/v1:Function              gcp-native-demo-function                        create     
    +   │     └─ google-native:cloudfunctions/v1:FunctionIamPolicy  gcp-native-demo-function-iampolicy              create     
    +   ├─ random:index:RandomString                                gcp-native-demo-function-random                 create     
    +   └─ random:index:RandomPassword                              gcp-native-demo-sqluser-password                create     
    
    Resources:
        + 18 to create

    Do you want to perform this update?  [Use arrows to move, enter to select, type to filter]
    yes
    > no
    details
    ```
1. Select **yes**

   Results
   ```bash
   Updating (dev)

    View Live: https://app.pulumi.com/myuser/google-native-py-network-postgres-function/dev/updates/195

        Type                                            Name                                            Status       
    +   pulumi:pulumi:Stack                             google-native-py-network-postgres-function-dev  creating.    
    +   ├─ custom:network:VPC                           gcp-native-demo                                 creating     
    +   │  └─ google-native:compute/v1:Network                      gcp-native-demo-vpc                             created      
    +   pulumi:pulumi:Stack                                         google-native-py-network-postgres-function-dev  creating.    
    +   │     ├─ google-native:compute/v1:Subnetwork                gcp-native-demo-subnet-1                        created      
    +   │     ├─ google-native:compute/v1:Subnetwork                gcp-native-demo-subnet-2                        created     
    +   │     └─ google-native:compute/v1:Router                    gcp-native-demo-router                          created     
    +   ├─ custom:database:Postgres                                 gcp-native-demo                                 created     
    +   │  └─ google-native:sqladmin/v1beta4:Instance               gcp-native-demo-sqlinstance                     created     
    +   │     ├─ google-native:sqladmin/v1beta4:Database            gcp-native-demo-sqldatabase                     created     
    +   │     └─ gcp:sql:User                                       gcp-native-demo-sql-user                        created     
    +   ├─ custom:cloudfunctions:Function                           gcp-native-demo                                 created     
    +   │  ├─ google-native:storage/v1:Bucket                       gcp-native-demo-function-bucket                 created     
    +   │  │  └─ google-native:storage/v1:BucketObject              gcp-native-demo-function-bucketobject           created     
    +   │  └─ google-native:cloudfunctions/v1:Function              gcp-native-demo-function                        created     
    +   │     └─ google-native:cloudfunctions/v1:FunctionIamPolicy  gcp-native-demo-function-iampolicy              created     
    +   ├─ random:index:RandomString                                gcp-native-demo-function-random                 created     
    +   └─ random:index:RandomPassword                              gcp-native-demo-sqluser-password                created     
    
    Outputs:
        cloudsql_database_name                   : "gcp-native-demo-sqldatabase-4066672"
        cloudsql_instance_database_engine_version: "POSTGRES_13"
        cloudsql_instance_name                   : "gcp-native-demo-sqlinstance-ce17991"
        serverless_name                          : "projects/pulumi-ce-team/locations/us-central1/functions/func-lq83WU"
        serverless_url                           : "https://us-central1-pulumi-ce-team.cloudfunctions.net/func-lq83WU"
        sql_user_name                            : "pulumiadmin"
        sql_user_password                        : "[secret]"
        vpc_name                                 : "gcp-native-demo-vpc-9adb2c9"
        vpc_subnet_1_name                        : "gcp-native-demo-subnet-0-3f6ab55"
        vpc_subnet_2_name                        : "gcp-native-demo-subnet-1-599734c"
        vpc_subnet_3_name                        : "gcp-native-demo-subnet-2-10a96f6"

    Resources:
        + 18 created

    Duration: 12m51s
   ```
1. View the stack outputs

    ```bash
    pulumi stack output
    ```
    Results
    ```bash
    Current stack outputs (11):
    OUTPUT                                     VALUE
    cloudsql_database_name                     gcp-native-demo-sqldatabase-4066672
    cloudsql_instance_database_engine_version  POSTGRES_13
    cloudsql_instance_name                     gcp-native-demo-sqlinstance-ce17991
    serverless_name                            projects/pulumi-ce-team/locations/us-central1/functions/func-lq83WU
    serverless_url                             https://us-central1-pulumi-ce-team.cloudfunctions.net/func-lq83WU
    sql_user_name                              pulumiadmin
    sql_user_password                          [secret]
    vpc_name                                   gcp-native-demo-vpc-9adb2c9
    vpc_subnet_1_name                          gcp-native-demo-subnet-0-3f6ab55
    vpc_subnet_2_name                          gcp-native-demo-subnet-1-599734c
    vpc_subnet_3_name                          gcp-native-demo-subnet-2-10a96f6
    ```

1. Check the deployed function endpoint

   ```bash
   curl "$(pulumi stack output serverless_url)"
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