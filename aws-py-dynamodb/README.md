# AWS Dynamodb Table in Python

Creates an aws dynamodb table in python with pulumi## Deploying and running the program

1. Create a new stack:

    ```bash
    pulumi stack init dev
    ```

1. Set the AWS region:

    ```bash
    pulumi config set aws:region us-east-2
    ```

1. Create a Python virtualenv, activate it, and install dependencies:

    This installs the dependent packages [needed](https://www.pulumi.com/docs/intro/concepts/how-pulumi-works/) for our Pulumi program.

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

    Result:
    ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/myuser/aws-py-dynamodb/dev/updates/5

        Type                   Name                 Status      
    +   pulumi:pulumi:Stack    aws-py-dynamodb-dev  created     
    +   └─ aws:dynamodb:Table  dev-test-table       created     
    
    Outputs:
        dynamodb_billing_mode          : "PROVISIONED"
        dynamodb_hash_key              : "databaseName"
        dynamodb_name                  : "dev-test-table"
        dynamodb_point_in_time_recovery: {
            enabled: false
        }
        dynamodb_read_capacity         : 1
        dynamodb_write_capacity        : 1

    Resources:
        + 2 created

    Duration: 11s

    ```

1. To see the resources that were created, run `pulumi stack output`:

    ```bash
    pulumi stack output
    ```

    Result
    ```bash
    Current stack outputs (6):
        OUTPUT                           VALUE
        dynamodb_billing_mode            PROVISIONED
        dynamodb_hash_key                databaseName
        dynamodb_name                    dev-test-table
        dynamodb_point_in_time_recovery  {"enabled":false}
        dynamodb_read_capacity           1
        dynamodb_write_capacity          1
    ```

1. To clean up resources, run **pulumi destroy**
   ```bash
   pulumi destroy -y
   ```