
# AWS VPC in python

AWS VPC, igw, nat gateway, public and private subnets

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

   Setting subnets via [pulumi config set-all](https://www.pulumi.com/docs/reference/cli/pulumi_config_set-all/)

      ```bash
   pulumi config set aws:region us-east-2 # any valid aws region
   pulumi config set vpc_cidr_block 10.0.0.0/23
   pulumi config set number_of_nat_gateways 1 # optional
   pulumi config set-all --path --plaintext public_subnet_cidr[0]="10.0.0.0/25" --plaintext public_subnet_cidr[1]="10.0.0.128/26" --plaintext public_subnet_cidr[2]="10.0.0.192/26"
   pulumi config set-all --path --plaintext private_subnet_cidr[0]="10.0.1.0/26" --plaintext private_subnet_cidr[1]="10.0.1.64/26" --plaintext private_subnet_cidr[2]="10.0.1.128/25"
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
   Previewing update (dev)

    View Live: https://app.pulumi.com/shaht/aws-py-vpc/dev/previews/6a62b9a7-ad69-416c-b3d9-bbd4a97ac1bf

        Type                                    Name                                   Plan       
    +   pulumi:pulumi:Stack                     aws-py-vpc-dev                         create...  
    +   ├─ aws:ec2:Vpc                          demo-vpc                               create     
    +   │  ├─ aws:ec2:InternetGateway           demo-igw                               create     
    +   │  ├─ aws:ec2:RouteTable                demo-public-route-table                create     
    +   │  ├─ aws:ec2:SecurityGroup             demo-security-group                    create     
    +   │  ├─ aws:ec2:Subnet                    demo-private-subnet-us-east-2a          create     
    +   │  ├─ aws:ec2:Subnet                    demo-public-subnet-us-east-2a           create     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-public-rt-association-us-east-2a   create     
    +   pulumi:pulumi:Stack                     aws-py-vpc-dev                          create     9 messages
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-public-rt-association-us-east-2b   create     
    +   │  ├─ aws:ec2:Subnet                    demo-public-subnet-us-east-2c           create     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-public-rt-association-us-east-2c   create     
    +   │  ├─ aws:ec2:Subnet                    demo-private-subnet-us-east-2c          create     
    +   │  ├─ aws:ec2:Subnet                    demo-private-subnet-us-east-2b          create     
    +   │  ├─ aws:ec2:RouteTable                demo-private-rt-us-east-2a              create     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-private-rt-association-us-east-2a  create     
    +   │  ├─ aws:ec2:RouteTable                demo-private-rt-us-east-2b              create     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-private-rt-association-us-east-2b  create     
    +   │  └─ aws:ec2:RouteTable                demo-private-rt-us-east-2c              create     
    +   │     └─ aws:ec2:RouteTableAssociation  demo-private-rt-association-us-east-2c  create     
    +   └─ aws:ec2:Eip                          demo-eip-nat-gateway-us-east-2a         create     
    +      └─ aws:ec2:NatGateway                demo-natgw-us-east-2a                   create     
    
    Diagnostics:
    pulumi:pulumi:Stack (aws-py-vpc-dev):
        zone: us-east-2a
        public cidr: 10.0.0.0/25
        private cidr: 10.0.1.0/26
        zone: us-east-2b
        public cidr: 10.0.0.128/26
        private cidr: 10.0.1.64/26
        zone: us-east-2c
        public cidr: 10.0.0.192/26
        private cidr: 10.0.1.128/25
    

    Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-py-vpc/dev/updates/66

        Type                                    Name                                   Status       
    +   pulumi:pulumi:Stack                     aws-py-vpc-dev                         creating..   
    +   pulumi:pulumi:Stack                     aws-py-vpc-dev                         creating...  
    +   │  └─ aws:ec2:NatGateway                demo-natgw-us-east-2a                  created      
    +   └─ aws:ec2:Vpc                          demo-vpc                               created      
    +      ├─ aws:ec2:InternetGateway           demo-igw                               created      
    +      ├─ aws:ec2:SecurityGroup             demo-security-group                     created      
    +   pulumi:pulumi:Stack                     aws-py-vpc-dev                          creating.    
    +      │  └─ aws:ec2:RouteTableAssociation  demo-public-rt-association-us-east-2b   created      
    +      ├─ aws:ec2:Subnet                    demo-private-subnet-us-east-2a          created     
    +      ├─ aws:ec2:Subnet                    demo-private-subnet-us-east-2c          created     
    +      ├─ aws:ec2:Subnet                    demo-private-subnet-us-east-2b          created     
    +      ├─ aws:ec2:Subnet                    demo-public-subnet-us-east-2a           created     
    +      │  └─ aws:ec2:RouteTableAssociation  demo-public-rt-association-us-east-2a   created     
    +      ├─ aws:ec2:Subnet                    demo-public-subnet-us-east-2c           created     
    +      │  └─ aws:ec2:RouteTableAssociation  demo-public-rt-association-us-east-2c   created     
    +      ├─ aws:ec2:RouteTable                demo-public-route-table                 created     
    +      ├─ aws:ec2:RouteTable                demo-private-rt-us-east-2a              created     
    +      │  └─ aws:ec2:RouteTableAssociation  demo-private-rt-association-us-east-2a  created     
    +      ├─ aws:ec2:RouteTable                demo-private-rt-us-east-2b              created     
    +      │  └─ aws:ec2:RouteTableAssociation  demo-private-rt-association-us-east-2b  created     
    +      └─ aws:ec2:RouteTable                demo-private-rt-us-east-2c              created     
    +         └─ aws:ec2:RouteTableAssociation  demo-private-rt-association-us-east-2c  created     
    
    Diagnostics:
    pulumi:pulumi:Stack (aws-py-vpc-dev):
        zone: us-east-2a
        public cidr: 10.0.0.0/25
        private cidr: 10.0.1.0/26
        zone: us-east-2b
        public cidr: 10.0.0.128/26
        private cidr: 10.0.1.64/26
        zone: us-east-2c
        public cidr: 10.0.0.192/26
        private cidr: 10.0.1.128/25
    
    Outputs:
        availabililty_zones  : [
            [0]: "us-east-2a"
            [1]: "us-east-2b"
            [2]: "us-east-2c"
        ]
        internet_gateway     : "igw-07f0e686bdf007e84"
        number_of_natgateways: 1
        public_route_table   : "rtb-060fca5f6a8dfc896"
        public_subnets_ids   : [
            [0]: "subnet-03ff140e8b284d20b"
            [1]: "subnet-00fda8776f7202581"
            [2]: "subnet-0c81af5f64b6bca32"
        ]
        security_group_id    : "sg-076c05243783da64c"
        security_group_name  : "demo-security-group-b89c592"
        vpc_cidr_block       : "10.0.0.0/23"
        vpc_name             : "vpc-049933bfbcd9fbf95"

    Resources:
        + 22 created

    Duration: 2m34s
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (9):
    OUTPUT                 VALUE
    availabililty_zones    ["us-east-2a","us-east-2b","us-east-2c"]
    internet_gateway       igw-07f0e686bdf007e84
    number_of_natgateways  1
    private_subnets_ids    ["subnet-0b9d0e6361b196896","subnet-0aa23f62aa91ec6ac","subnet-02060db68a4d6b94e"]
    public_route_table     rtb-060fca5f6a8dfc896
    public_subnets_ids     ["subnet-03ff140e8b284d20b","subnet-00fda8776f7202581","subnet-0c81af5f64b6bca32"]
    security_group_id      sg-076c05243783da64c
    security_group_name    demo-security-group-b89c592
    vpc_cidr_block         10.0.0.0/23
    vpc_name               vpc-049933bfbcd9fbf95
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```