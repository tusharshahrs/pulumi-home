# AWS AWSX Multilang Vpc Single Nat Gateway in Typescript

[AWSX](https://www.pulumi.com/registry/packages/awsx/)multilang VPC, igw, single nat gateway strategy, public and private subnets

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Install dependencies:
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
   Updating (dev)

    View Live: https://app.pulumi.com/myuser/aws-classic-ts-vpc-natgatway-strategy/dev/updates/7

        Type                              Name                                       Status       
    +   pulumi:pulumi:Stack               aws-classic-ts-vpc-natgatway-strategy-dev  creating...  
    +   pulumi:pulumi:Stack               aws-classic-ts-vpc-natgatway-strategy-dev  creating     
    +      └─ aws:ec2:Vpc                 demo-vpc                                   created      
    +         ├─ aws:ec2:InternetGateway  demo-vpc                                   created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-private-3                         created      
    +         │  └─ aws:ec2:RouteTable                demo-vpc-private-3                         created      
    +         │     └─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                         creating..   
    +   pulumi:pulumi:Stack                           aws-classic-ts-vpc-natgatway-strategy-dev  creating..   
    +         │  └─ aws:ec2:RouteTable                demo-vpc-private-2                         created      
    +   pulumi:pulumi:Stack                           aws-classic-ts-vpc-natgatway-strategy-dev  creating...  
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-1                          created      
    +         │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                          created      
    +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                          creating..   
    +         │  │  └─ aws:ec2:Route                  demo-vpc-public-1                          creating..   
    +         │  │  └─ aws:ec2:Route                  demo-vpc-public-1                          creating...  
    +         │  └─ aws:ec2:NatGateway                demo-vpc-1                                 creating...  
    +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                          created      
    +         │  └─ aws:ec2:RouteTable                demo-vpc-private-1                         created      
    +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                         created      
    +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                         created      
    +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                         created      
    +         │     └─ aws:ec2:Route                  demo-vpc-private-1                         created     
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-2                          created     
    +         │  └─ aws:ec2:RouteTable                demo-vpc-public-2                          created     
    +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                          created     
    +         │     └─ aws:ec2:Route                  demo-vpc-public-2                          created     
    +         └─ aws:ec2:Subnet                       demo-vpc-public-3                          created     
    +            └─ aws:ec2:RouteTable                demo-vpc-public-3                          created     
    +               ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                          created     
    +               └─ aws:ec2:Route                  demo-vpc-public-3                          created     
    
    Outputs:
        vpc_id               : "vpc-0b21c62431aa2fa6b"
        vpc_natgateways      : "nat-08a99c876b2cc1191"
        vpc_private_subnetids: [
            [0]: "subnet-0b4301b23c3f73a81"
            [1]: "subnet-0072e7c362103bb8e"
            [2]: "subnet-058e804b9c72f273f"
        ]
        vpc_public_subnetids : [
            [0]: "subnet-0d66b1b091945fa57"
            [1]: "subnet-015d7a90dc32c410b"
            [2]: "subnet-07d88a9c0823ff027"
        ]

    Resources:
        + 30 created

    Duration: 1m59s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (4):
    OUTPUT                 VALUE
    vpc_id                 vpc-0b21c62431aa2fa6b
    vpc_natgateways        nat-08a99c876b2cc1191
    vpc_private_subnetids  ["subnet-0b4301b23c3f73a81","subnet-0072e7c362103bb8e","subnet-058e804b9c72f273f"]
    vpc_public_subnetids   ["subnet-0d66b1b091945fa57","subnet-015d7a90dc32c410b","subnet-07d88a9c0823ff027"]
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```