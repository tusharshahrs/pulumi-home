# AWS AWSX Multilang Vpc Single Nat Gateway SecurityGroup vs SecurityGroupRules in Python

[AWSX](https://www.pulumi.com/registry/packages/awsx/)multilang VPC, igw, single nat gateway strategy, public and private subnets. [SecurityGroup](https://www.pulumi.com/registry/packages/aws/api-docs/ec2/securitygroup/) vs [SecurityGroupRules](https://www.pulumi.com/registry/packages/aws/api-docs/ec2/securitygrouprule/)

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
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
    View Live: https://app.pulumi.com/shaht/aws-classic-py-vpc-awsx-natgateway-strategy/dev/updates/10

   PENDING
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   PENDING
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```