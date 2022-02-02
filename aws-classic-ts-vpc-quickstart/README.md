# AWS VPC built-in TypeScript with Quickstart

## What Is This?

This example uses [AWS Quickstart VPC](https://www.pulumi.com/registry/packages/aws-quickstart-vpc/) for deploying your own vpc.  **COST WARNING** This creates `3` NAT gateways, these are EXPENSIVE for a dev environment.  Use **DIFFERENT** code and project/stack if you are using this in dev.  The VPC is built-in `TypeScript`.

## Prerequisites

* [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
* [Configure Pulumi to Use AWS](https://www.pulumi.com/docs/intro/cloud-providers/aws/setup/) (if your AWS CLI is configured, no further changes are required)

## Where are the settings?
 The settings are in `Pulumi`.stackname`.yaml`
 You will be creating a new file that holds your configs

## Creating a new `Pulumi`.stackname`.yaml`

 1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).
      ```bash
      pulumi stack init dev
      ```
 1. Now, install dependencies.

   ```bash
   npm install
   ```
 1. View the current config settings. This will be empty.
   ```bash
   pulumi config
   ```
   ```bash
   KEY                     VALUE
   ```
 1. Populate the config.

   Here are aws [endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html)
   ```bash
   pulumi config set aws:region us-east-2 # any valid aws region endpoint
   ```

    *Note* If you pick something besides *us-east-2*, you need to edit the *index.ts* file and update the 3 availability zones

1. View the current config settings
   ```bash
   pulumi config
   ```

   ```bash
   KEY                     VALUE
   aws:region              us-east-2
   ```

1. Launch
   ```bash
   pulumi up
   ```

1. Expected output

   ```bash
   View Live: https://app.pulumi.com/shaht/aws-classic-ts-vpc-quickstart/dev/updates/12

        Type                             Name                               Status       
    +   pulumi:pulumi:Stack              aws-classic-ts-vpc-quickstart-dev  creating...  
    +   └─ aws-quickstart-vpc:index:Vpc  demo-vpc                           creating..   
    +      ├─ aws:ec2:Vpc                demo-vpc-vpc                       created      
    +      ├─ aws:ec2:Eip                demo-vpc-elastic-ip-1              created      
    +      ├─ aws:ec2:Eip                    demo-vpc-elastic-ip-0                      created      
    +      ├─ aws:ec2:Eip                    demo-vpc-elastic-ip-2                      created      
    +      ├─ aws:ec2:Subnet                 demo-vpc-private-subnet-a-1                created      
    +      ├─ aws:ec2:Subnet                 demo-vpc-public-subnet-2                   created      
    +   pulumi:pulumi:Stack                  aws-classic-ts-vpc-quickstart-dev          creating...  
    +      ├─ aws:ec2:Subnet                 demo-vpc-public-subnet-0                   created      
    +      ├─ aws:ec2:RouteTable             demo-vpc-public-route-table-1              created     
    +      ├─ aws:ec2:Subnet                 demo-vpc-private-subnet-a-2                created     
    +      ├─ aws:ec2:RouteTable             demo-vpc-public-route-table-2              created     
    +      ├─ aws:ec2:RouteTable             demo-vpc-public-route-table-0              created     
    +      ├─ aws:ec2:Subnet                 demo-vpc-private-subnet-a-0                created     
    +      ├─ aws:ec2:Subnet                 demo-vpc-public-subnet-1                   created     
    +      ├─ aws:ec2:NatGateway             demo-vpc-nat-gateway-2                     created     
    +      ├─ aws:ec2:Route                  demo-vpc-public-route-1                    created     
    +      ├─ aws:ec2:NatGateway             demo-vpc-nat-gateway-0                     created     
    +      ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-route-table-association-2  created     
    +      ├─ aws:ec2:Route                  demo-vpc-public-route-2                    created     
    +      ├─ aws:ec2:Route                  demo-vpc-public-route-0                    created     
    +      ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-route-table-association-0  created     
    +      ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-route-table-association-1  created     
    +      └─ aws:ec2:NatGateway             demo-vpc-nat-gateway-1                     created     
    
    Outputs:
        natgatewayIPs   : [
            [0]: "3.133.186.194"
            [1]: "3.133.225.150"
            [2]: "3.141.208.132"
        ]
        privateSubnetIDs: [
            [0]: "subnet-0252ac777c8072766"
            [1]: "subnet-07766390b479faffc"
            [2]: "subnet-0ba224e19672849f0"
        ]
        publicSubnetIDs : [
            [0]: "subnet-0bfa5a8cf1104f62f"
            [1]: "subnet-04e35575a55220c3a"
            [2]: "subnet-07e7d90f097588018"
        ]
        vpcID           : "vpc-0563a705124282fe2"

    Resources:
        + 25 created

    Duration: 2m27s

1. Check the  [stack outputs](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)

   ```bash
   pulumi stack output
   ```

   ```bash
    Current stack outputs (4):
    OUTPUT            VALUE
    natgatewayIPs     ["3.133.186.194","3.133.225.150","3.141.208.132"]
    privateSubnetIDs  ["subnet-0252ac777c8072766","subnet-07766390b479faffc","subnet-0ba224e19672849f0"]
    publicSubnetIDs   ["subnet-0bfa5a8cf1104f62f","subnet-04e35575a55220c3a","subnet-07e7d90f097588018"]
    vpcID             vpc-0563a705124282fe2
   ```

1. Clean up.  
   ```bash
   pulumi destroy -y
   ```

1. Remove.   This will remove the Pulumi.dev.yaml file also
   ```bash
   pulumi stack rm dev -y
   ```