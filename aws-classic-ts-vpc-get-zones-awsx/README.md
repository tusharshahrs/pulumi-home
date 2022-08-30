# AWS AWSX Multilang Vpc Single Nat Gateway, Public Subnets, Private Subnets, Availability Zones, NO APPLY, in TypeScript

[AWSX](https://www.pulumi.com/registry/packages/awsx/) multilang VPC, igw, single nat gateway strategy, public and private subnets.  We also return the availability zone without an apply.

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

    View Live: https://app.pulumi.com/shaht/aws-classic-ts-vpc-get-zones-awsx/dev/updates/47

        Type                              Name                                   Status       
    +   pulumi:pulumi:Stack               aws-classic-ts-vpc-get-zones-awsx-dev  creating     
    +   └─ awsx:ec2:Vpc                   demo-vpc                               created      
    +   pulumi:pulumi:Stack               aws-classic-ts-vpc-get-zones-awsx-dev  creating.    
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-3                      creating     
    +         ├─ aws:ec2:Subnet                       demo-vpc-private-3                     created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-3                      creating.    
    +         │  └─ aws:ec2:RouteTable                demo-vpc-private-3                     created      
    +         │     └─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                     created      
    +         │  └─ aws:ec2:RouteTable                demo-vpc-public-3                      created      
    +         │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                      creating     
    +         │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                      creating.    
    +         │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                      creating.    
    +         │  └─ aws:ec2:Eip                       demo-vpc-1                             created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-2                      created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-2                      created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-2                      created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-2                      created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-2                      created      
    +         │  └─ aws:ec2:RouteTable                demo-vpc-public-2                      created      
    +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                      created      
    +         │     └─ aws:ec2:Route                  demo-vpc-public-2                      created     
    +         ├─ aws:ec2:Subnet                       demo-vpc-private-2                     created     
    +         │  └─ aws:ec2:RouteTable                demo-vpc-private-2                     created     
    +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                     created     
    +         │     └─ aws:ec2:Route                  demo-vpc-private-2                     created     
    +         ├─ aws:ec2:InternetGateway              demo-vpc                               created     
    +         └─ aws:ec2:Subnet                       demo-vpc-private-1                     created     
    +            └─ aws:ec2:RouteTable                demo-vpc-private-1                     created     
    +               ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                     created     
    +               └─ aws:ec2:Route                  demo-vpc-private-1                     created     
    
    Outputs:
        vpc_az_zones          : 3
        vpc_cidrs             : "10.0.0.0/24"
        vpc_id                : "vpc-0e9126cb1cad82e8f"
        vpc_private_subnet_ids: [
            [0]: "subnet-051f4129c8c29ba40"
            [1]: "subnet-09bc292dba7116717"
            [2]: "subnet-004934e4cfa67f559"
        ]
        vpc_public_subnet_ids : [
            [0]: "subnet-04a04cdf17b0a8da7"
            [1]: "subnet-061af0e8628bc4fb2"
            [2]: "subnet-069cb7af81138793b"
        ]
        vpc_subnets1_az       : "us-east-2a"
        vpc_subnets1_id       : "subnet-04a04cdf17b0a8da7"
        vpc_subnets1_tags     : {
            Name: "demo-vpc-public-1"
        }
        vpc_subnets2_az       : "us-east-2b"
        vpc_subnets2_id       : "subnet-061af0e8628bc4fb2"
        vpc_subnets2_tags     : {
            Name: "demo-vpc-public-2"
        }
        vpc_subnets3_az       : "us-east-2c"
        vpc_subnets3_id       : "subnet-069cb7af81138793b"
        vpc_subnets3_tags     : {
            Name: "demo-vpc-public-3"
        }
        vpc_subnets4_az       : "us-east-2a"
        vpc_subnets4_id       : "subnet-051f4129c8c29ba40"
        vpc_subnets4_tags     : {
            Name: "demo-vpc-private-1"
        }
        vpc_subnets5_az       : "us-east-2b"
        vpc_subnets5_id       : "subnet-09bc292dba7116717"
        vpc_subnets5_tags     : {
            Name: "demo-vpc-private-2"
        }
        vpc_subnets6_az       : "us-east-2c"
        vpc_subnets6_id       : "subnet-004934e4cfa67f559"
        vpc_subnets6_tags     : {
            Name: "demo-vpc-private-3"
        }

    Resources:
        + 30 created

    Duration: 2m9s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (23):
    OUTPUT                  VALUE
    vpc_az_zones            3
    vpc_cidrs               10.0.0.0/24
    vpc_id                  vpc-0e9126cb1cad82e8f
    vpc_private_subnet_ids  ["subnet-051f4129c8c29ba40","subnet-09bc292dba7116717","subnet-004934e4cfa67f559"]
    vpc_public_subnet_ids   ["subnet-04a04cdf17b0a8da7","subnet-061af0e8628bc4fb2","subnet-069cb7af81138793b"]
    vpc_subnets1_az         us-east-2a
    vpc_subnets1_id         subnet-04a04cdf17b0a8da7
    vpc_subnets1_tags       {"Name":"demo-vpc-public-1"}
    vpc_subnets2_az         us-east-2b
    vpc_subnets2_id         subnet-061af0e8628bc4fb2
    vpc_subnets2_tags       {"Name":"demo-vpc-public-2"}
    vpc_subnets3_az         us-east-2c
    vpc_subnets3_id         subnet-069cb7af81138793b
    vpc_subnets3_tags       {"Name":"demo-vpc-public-3"}
    vpc_subnets4_az         us-east-2a
    vpc_subnets4_id         subnet-051f4129c8c29ba40
    vpc_subnets4_tags       {"Name":"demo-vpc-private-1"}
    vpc_subnets5_az         us-east-2b
    vpc_subnets5_id         subnet-09bc292dba7116717
    vpc_subnets5_tags       {"Name":"demo-vpc-private-2"}
    vpc_subnets6_az         us-east-2c
    vpc_subnets6_id         subnet-004934e4cfa67f559
    vpc_subnets6_tags       {"Name":"demo-vpc-private-3"}
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```