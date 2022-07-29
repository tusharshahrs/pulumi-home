# AWS VPC via AWSX package multiple EC2 instances each with EBS Volumes in Python

AWS vpc built with [awsx package](https://www.pulumi.com/registry/packages/awsx/installation-configuration/) and multiple ec2 with one ebs volumes.  The instances can be launched as spot

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Create a Python virtualenv, activate it, and install dependencies
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
   pulumi config set aws:region ap-southeast-2 # any valid aws region
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-classic-py-multiple-ec2-ebs/dev/updates/49

        Type                                          Name                                 Status       
    +   pulumi:pulumi:Stack                           aws-classic-py-multiple-ec2-ebs-dev  creating..   
    +   ├─ awsx:ec2:Vpc                               demo-vpc                             created      
    +   │  └─ aws:ec2:Vpc                             demo-vpc                             created      
    +   │     ├─ aws:ec2:Subnet                       demo-vpc-public-1                    created      
    +   │     │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                    created      
    +   │     │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                    creating     
    +   │     │  │  └─ aws:ec2:Route                  demo-vpc-public-1                    creating     
    +   │     │  │  └─ aws:ec2:Route                  demo-vpc-public-1                    creating.    
    +   │     │  └─ aws:ec2:NatGateway                demo-vpc-1                           creating.    
    +   │     ├─ aws:ec2:Subnet                       demo-vpc-private-3                   created      
    +   │     │  └─ aws:ec2:RouteTable                demo-vpc-private-3                   created      
    +   │     │     └─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                   created      
    +   │     ├─ aws:ec2:InternetGateway              demo-vpc                             created      
    +   │     ├─ aws:ec2:InternetGateway              demo-vpc                             created      
    +   │     ├─ aws:ec2:Subnet                       demo-vpc-private-2                   created      
    +   │     │  └─ aws:ec2:NatGateway                demo-vpc-1                           created      
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                   created      
    +   pulumi:pulumi:Stack                           aws-classic-py-multiple-ec2-ebs-dev  creating...  
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-3                    created      
    +   │  │  │  ├─ aws:ec2:RouteTable                demo-vpc-public-3                    created     
    +   │  │  │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                    created     
    +   │  │  │  │  └─ aws:ec2:Route                  demo-vpc-public-3                    created     
    +   │  │  │  ├─ aws:ec2:Eip                       demo-vpc-3                           created     
    +   │  │  │  └─ aws:ec2:NatGateway                demo-vpc-3                           created     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-2                    created     
    +   │  │  │  ├─ aws:ec2:Eip                       demo-vpc-2                           created     
    +   │  │  │  ├─ aws:ec2:RouteTable                demo-vpc-public-2                    created     
    +   │  │  │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                    created     
    +   │  │  │  │  └─ aws:ec2:Route                  demo-vpc-public-2                    created     
    +   │  │  │  └─ aws:ec2:NatGateway                demo-vpc-2                           created     
    +   │  │  └─ aws:ec2:Subnet                       demo-vpc-private-1                   created     
    +   │  │     └─ aws:ec2:RouteTable                demo-vpc-private-1                   created     
    +   │  │        ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                   created     
    +   │  │        └─ aws:ec2:Route                  demo-vpc-private-1                   created     
    +   │  └─ aws:ec2:SecurityGroup                   demo-securitygroup                   created     
    +   ├─ aws:ec2:KeyPair                            demo-key                             created     
    +   ├─ aws:ec2:Instance                           webserver-0-0                        created     
    +   └─ aws:ec2:Instance                           webserver-0-1                        created     
    
    Outputs:
        ami_id                       : "ami-0dc96254d5535925f"
        key_id                       : "demo-key-2fae359"
        number_of_availabililty_zones: 3
        number_of_natgateways        : 1
        private_subnets              : [
            [0]: "subnet-01b6cf193dfb293a3"
            [1]: "subnet-013d7551ff2610bf0"
            [2]: "subnet-0d93d155eb239f1d2"
        ]
        private_subnets_0            : "subnet-01b6cf193dfb293a3"
        private_subnets_1            : "subnet-013d7551ff2610bf0"
        private_subnets_2            : "subnet-0d93d155eb239f1d2"
        public_subnets               : [
            [0]: "subnet-09570c91cf47fca9f"
            [1]: "subnet-0359bfa05d4496080"
            [2]: "subnet-09904132e271411bb"
        ]
        public_subnets_0             : "subnet-09570c91cf47fca9f"
        public_subnets_1             : "subnet-0359bfa05d4496080"
        public_subnets_2             : "subnet-09904132e271411bb"
        security_group_name          : "demo-securitygroup-923c7f6"
        server_names                 : [
            [0]: "webserver-0-0"
            [1]: "webserver-0-1"
        ]
        vpc_cidr_block               : "10.0.0.0/24"
        vpc_id                       : "vpc-03a0c9b8325462c82"

    Resources:
        + 38 created

    Duration: 3m20s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (16):
    OUTPUT                         VALUE
    ami_id                         ami-0dc96254d5535925f
    key_id                         demo-key-2fae359
    number_of_availabililty_zones  3
    number_of_natgateways          1
    private_subnets                ["subnet-01b6cf193dfb293a3","subnet-013d7551ff2610bf0","subnet-0d93d155eb239f1d2"]
    private_subnets_0              subnet-01b6cf193dfb293a3
    private_subnets_1              subnet-013d7551ff2610bf0
    private_subnets_2              subnet-0d93d155eb239f1d2
    public_subnets                 ["subnet-09570c91cf47fca9f","subnet-0359bfa05d4496080","subnet-09904132e271411bb"]
    public_subnets_0               subnet-09570c91cf47fca9f
    public_subnets_1               subnet-0359bfa05d4496080
    public_subnets_2               subnet-09904132e271411bb
    security_group_name            demo-securitygroup-923c7f6
    server_names                   ["webserver-0-0","webserver-0-1"]
    vpc_cidr_block                 10.0.0.0/24
    vpc_id                         vpc-03a0c9b8325462c82
   ```

1. Destroy the stack
   ```bash
   pulumi destroy -y
   ```

1. Clean Up.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```