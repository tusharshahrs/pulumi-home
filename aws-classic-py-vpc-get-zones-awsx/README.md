# AWS AWSX Multilang Vpc Single Nat Gateway, Public Subnets, Private Subnets, Availability Zones, NO APPLY, in Python

[AWSX](https://www.pulumi.com/registry/packages/awsx/) multilang VPC, igw, single nat gateway strategy, public and private subnets. We also return the availability zone without an apply.

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
    Updating (dev)

    View Live: https://app.pulumi.com/myuser/aws-classic-py-vpc-get-zones-awsx/dev/updates/8

        Type                              Name                                   Stat
    +   pulumi:pulumi:Stack               aws-classic-py-vpc-get-zones-awsx-dev  crea
    +   └─ awsx:ec2:Vpc                   demo-vpc                               
    +      └─ aws:ec2:Vpc                 demo-vpc                               
    +         ├─ aws:ec2:Subnet           demo-vpc-public-2                      
    +         ├─ aws:ec2:InternetGateway  demo-vpc                               
    +         ├─ aws:ec2:Subnet                       demo-vpc-private-2         
    +         │  └─ aws:ec2:RouteTable                demo-vpc-private-2       
    +         │     └─ aws:ec2:RouteTableAssociation  demo-vpc-private-2       
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-2          
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-3          
    +         │  └─ aws:ec2:RouteTable                demo-vpc-public-3        
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-1          
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-1          
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-1          
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-1          
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-1          
    +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3        
    +         │  └─ aws:ec2:RouteTable                demo-vpc-public-1        
    +         │  │  ├─ aws:ec2:Route                  demo-vpc-public-1      
    +         │  │  ├─ aws:ec2:Route                  demo-vpc-public-1      
    +         │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-1      
    +         │  └─ aws:ec2:NatGateway                demo-vpc-1               
    +   pulumi:pulumi:Stack                           aws-classic-py-vpc-get-zones-aw
    +         │  └─ aws:ec2:RouteTable                demo-vpc-private-1       
    +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1       
    +         │     └─ aws:ec2:Route                  demo-vpc-private-1       
    +         └─ aws:ec2:Subnet                       demo-vpc-private-3         
    +            └─ aws:ec2:RouteTable                demo-vpc-private-3         
    +               ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-3         
    +               └─ aws:ec2:Route                  demo-vpc-private-3         
    
    Outputs:
        vpc_az_zones         : 3
        vpc_cidrs            : "10.0.0.0/24"
        vpc_id               : "vpc-0628ca1a3ca7b1bf9"
        vpc_private_subnetids: [
            [0]: "subnet-059611ed6f0882f27"
            [1]: "subnet-06911eec37370ec0d"
            [2]: "subnet-0a627097b593ff685"
        ]
        vpc_public_subnetids : [
            [0]: "subnet-02598b43d88335fbe"
            [1]: "subnet-06297f9269b9706ab"
            [2]: "subnet-0e634cc679e7cde19"
        ]
        vpc_subnets1_az      : "us-east-2a"
        vpc_subnets1_id      : "subnet-02598b43d88335fbe"
        vpc_subnets1_tags    : {
            Name: "demo-vpc-public-1"
        }
        vpc_subnets2_az      : "us-east-2b"
        vpc_subnets2_id      : "subnet-06297f9269b9706ab"
        vpc_subnets2_tags    : {
            Name: "demo-vpc-public-2"
        }
        vpc_subnets3_az      : "us-east-2c"
        vpc_subnets3_id      : "subnet-0e634cc679e7cde19"
        vpc_subnets3_tags    : {
            Name: "demo-vpc-public-3"
        }
        vpc_subnets4_az      : "us-east-2a"
        vpc_subnets4_id      : "subnet-059611ed6f0882f27"
        vpc_subnets4_tags    : {
            Name: "demo-vpc-private-1"
        }
        vpc_subnets5_az      : "us-east-2b"
        vpc_subnets5_id      : "subnet-06911eec37370ec0d"
        vpc_subnets5_tags    : {
            Name: "demo-vpc-private-2"
        }
        vpc_subnets6_az      : "us-east-2c"
        vpc_subnets6_id      : "subnet-0a627097b593ff685"
        vpc_subnets6_tags    : {
            Name: "demo-vpc-private-3"
        }

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
   Current stack outputs (23):
    OUTPUT                 VALUE
    vpc_az_zones           3
    vpc_cidrs              10.0.0.0/24
    vpc_id                 vpc-0628ca1a3ca7b1bf9
    vpc_private_subnetids  ["subnet-059611ed6f0882f27","subnet-06911eec37370ec0d","subnet-0a627097b593ff685"]
    vpc_public_subnetids   ["subnet-02598b43d88335fbe","subnet-06297f9269b9706ab","subnet-0e634cc679e7cde19"]
    vpc_subnets1_az        us-east-2a
    vpc_subnets1_id        subnet-02598b43d88335fbe
    vpc_subnets1_tags      {"Name":"demo-vpc-public-1"}
    vpc_subnets2_az        us-east-2b
    vpc_subnets2_id        subnet-06297f9269b9706ab
    vpc_subnets2_tags      {"Name":"demo-vpc-public-2"}
    vpc_subnets3_az        us-east-2c
    vpc_subnets3_id        subnet-0e634cc679e7cde19
    vpc_subnets3_tags      {"Name":"demo-vpc-public-3"}
    vpc_subnets4_az        us-east-2a
    vpc_subnets4_id        subnet-059611ed6f0882f27
    vpc_subnets4_tags      {"Name":"demo-vpc-private-1"}
    vpc_subnets5_az        us-east-2b
    vpc_subnets5_id        subnet-06911eec37370ec0d
    vpc_subnets5_tags      {"Name":"demo-vpc-private-2"}
    vpc_subnets6_az        us-east-2c
    vpc_subnets6_id        subnet-0a627097b593ff685
    vpc_subnets6_tags      {"Name":"demo-vpc-private-3"}
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```