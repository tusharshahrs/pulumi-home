
# AWS VPC in python with awsx package

AWS VPC, igw, nat gateway, public and private subnets in python. MSK cluster. Kafka Topics

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Create a Python virtualenv, activate it, and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip3 install -r requirements.txt
   ```

1. View the current config settings. This will be empty.

   ```bash
   pulumi config
   ```

   ```bash
   KEY                     VALUE
   ```

1. Populate the config.  Here are aws [endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html)

      ```bash
   pulumi config set aws:region us-east-2 # any valid aws region
   pulumi config set vpc_cidr_block 10.0.0.0/22
   pulumi config set number_of_availability_zones 3
   pulumi config set number_of_nat_gateways 1 # optional
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

1. Error that was replicated

```bash
    Previewing update (dev)

    View Live: https://app.pulumi.com/shaht/aws-classic-py-vpc-msk-kafka-client/dev/previews/418bd3ad-a296-4315-b76e-dcdf88173e4a

        Type                  Name                                     Plan       
        pulumi:pulumi:Stack   aws-classic-py-vpc-msk-kafka-client-dev             
    +   └─ kafka:index:Topic  shaht-healthCheckTopic                   create     
    
    Outputs:
    + healthchecktopic_name        : "shaht-healthCheckTopic-1f7b169"

    Resources:
        + 1 to create
        41 unchanged

    Do you want to perform this update? yes
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-classic-py-vpc-msk-kafka-client/dev/updates/23

        Type                  Name                                     Status                  Info
        pulumi:pulumi:Stack   aws-classic-py-vpc-msk-kafka-client-dev  **failed**              1 error
    +   └─ kafka:index:Topic  shaht-healthCheckTopic                   **creating failed**     1 error
    
    Diagnostics:
    kafka:index:Topic (shaht-healthCheckTopic):
        error: 1 error occurred:
            * kafka: client has run out of available brokers to talk to: 3 errors occurred:
            * dial tcp 10.0.2.173:2181: i/o timeout
            * dial tcp 10.0.1.145:2181: i/o timeout
            * dial tcp 10.0.0.189:2181: i/o timeout
    
    pulumi:pulumi:Stack (aws-classic-py-vpc-msk-kafka-client-dev):
        error: update failed
```