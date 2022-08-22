# AWS AWSX Multilang Vpc Single Nat Gateway in Python

[AWSX](https://www.pulumi.com/registry/packages/awsx/)multilang VPC, igw, single nat gateway strategy, public and private subnets

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

        Type                              Name                                             Status       
    +   pulumi:pulumi:Stack               aws-classic-py-vpc-awsx-natgateway-strategy-dev  creating..   
    +   pulumi:pulumi:Stack               aws-classic-py-vpc-awsx-natgateway-strategy-dev  creating...  
    +   pulumi:pulumi:Stack               aws-classic-py-vpc-awsx-natgateway-strategy-dev  creating     
    +         ├─ aws:ec2:Subnet           demo-vpc-private-3                               created      
    +         │  └─ aws:ec2:RouteTable                demo-vpc-private-3                               created      
    +         │     └─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                               creating...  
    +         ├─ aws:ec2:Subnet                       demo-vpc-private-1                               created      
    +   pulumi:pulumi:Stack                           aws-classic-py-vpc-awsx-natgateway-strategy-dev  creating..   
    +         │     └─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                               created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-private-2                               created      
    +         │  └─ aws:ec2:RouteTable                demo-vpc-private-2                               created      
    +   pulumi:pulumi:Stack                           aws-classic-py-vpc-awsx-natgateway-strategy-dev  creating...  
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-2                                created      
    +         │  └─ aws:ec2:RouteTable                demo-vpc-public-2                                created      
    +         │     ├─ aws:ec2:Route                  demo-vpc-public-2                                creating     
    +         │     └─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                                created      
    +         ├─ aws:ec2:InternetGateway              demo-vpc                                         created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-3                                created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-3                                created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-3                                created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-3                                created      
    +         │  └─ aws:ec2:RouteTable                demo-vpc-public-3                                created     
    +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                                created     
    +         │     └─ aws:ec2:Route                  demo-vpc-public-3                                created     
    +         └─ aws:ec2:Subnet                       demo-vpc-public-1                                created     
    +            ├─ aws:ec2:Eip                       demo-vpc-1                                       created     
    +            ├─ aws:ec2:RouteTable                demo-vpc-public-1                                created     
    +            │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                                created     
    +            │  └─ aws:ec2:Route                  demo-vpc-public-1                                created     
    +            └─ aws:ec2:NatGateway                demo-vpc-1                                       created     
    
    Outputs:
        vpc_id               : "vpc-08b3a10b338069e8a"
        vpc_natgateways      : "nat-0db140524a0bd3cef"
        vpc_private_subnetids: [
            [0]: "subnet-0044ad9f69479262d"
            [1]: "subnet-058250c909461ece7"
            [2]: "subnet-054f27a154c5f757e"
        ]
        vpc_public_subnetids : [
            [0]: "subnet-0101ff85c54c5a1ce"
            [1]: "subnet-016a798eb42aab881"
            [2]: "subnet-040f12949af432a5c"
        ]

    Resources:
        + 30 created

    Duration: 2m39s
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (4):
    OUTPUT                 VALUE
    vpc_id                 vpc-08b3a10b338069e8a
    vpc_natgateways        nat-0db140524a0bd3cef
    vpc_private_subnetids  ["subnet-0044ad9f69479262d","subnet-058250c909461ece7","subnet-054f27a154c5f757e"]
    vpc_public_subnetids   ["subnet-0101ff85c54c5a1ce","subnet-016a798eb42aab881","subnet-040f12949af432a5c"]
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```