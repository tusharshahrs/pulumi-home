# AWS AWSX Multilang Vpc Single Nat Gateway in Python

[AWSX](https://www.pulumi.com/registry/packages/awsx/)multilang VPC, igw, zero nat gateway strategy, public and private subnets. Launching multiple instances in oregon and nvirginia.

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
   pulumi config set aws:region us-west-2 # any valid aws region
   pulumi config set nameset dev # optional
   pulumi config set number_of_availability_zones  3 # optional
   pulumi config set number_of_servers             3 # optional
   pulumi config set vpc_cidr_block                10.0.0.0/23 # optional
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

     Results
   ```bash
    Previewing update (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/shaht/aws-classic-py-vpc-awsx-natgateway-none-two-instances/dev/previews/be37cfcb-fe62-4114-ae04-b053ef2ae5ce

        Type                                          Name                                                       Plan       
    +   pulumi:pulumi:Stack                           aws-classic-py-vpc-awsx-natgateway-none-two-instances-dev  create     
    +   ├─ awsx:ec2:Vpc                               shahtspotscheduler-vpc                                     create     
    +   │  └─ aws:ec2:Vpc                             shahtspotscheduler-vpc                                     create     
    +   │     ├─ aws:ec2:Subnet                       shahtspotscheduler-vpc-public-3                            create     
    +   │     │  └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-public-3                            create     
    +   │     │     ├─ aws:ec2:Route                  shahtspotscheduler-vpc-public-3                            create     
    +   │     │     └─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-public-3                            create     
    +   │     ├─ aws:ec2:Subnet                       shahtspotscheduler-vpc-public-2                            create     
    +   │     │  └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-public-2                            create     
    +   │     │     ├─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-public-2                            create     
    +   │     │     └─ aws:ec2:Route                  shahtspotscheduler-vpc-public-2                            create     
    +   │     ├─ aws:ec2:Subnet                       shahtspotscheduler-vpc-private-1                           create     
    +   │     │  └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-private-1                           create     
    +   │     │     └─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-private-1                           create     
    +   │     ├─ aws:ec2:Subnet                       shahtspotscheduler-vpc-public-1                            create     
    +   │     │  └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-public-1                            create     
    +   │     │     ├─ aws:ec2:Route                  shahtspotscheduler-vpc-public-1                            create     
    +   │     │     └─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-public-1                            create     
    +   │     ├─ aws:ec2:InternetGateway              shahtspotscheduler-vpc                                     create     
    +   │     ├─ aws:ec2:Subnet                       shahtspotscheduler-vpc-private-2                           create     
    +   │     │  └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-private-2                           create     
    +   │     │     └─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-private-2                           create     
    +   │     └─ aws:ec2:Subnet                       shahtspotscheduler-vpc-private-3                           create     
    +   │        └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-private-3                           create     
    +   │           └─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-private-3                           create     
    +   ├─ tls:index:PrivateKey                       shahtspotscheduler-privatekey                              create     
    +   ├─ aws:ec2:KeyPair                            shahtspotscheduler-keypair                                 create     
    +   ├─ aws:ec2:SecurityGroup                      shahtspotscheduler-securitygroup                           create     
    +   ├─ aws:ec2:Instance                           shahtspotscheduler-instance-1                              create     
    +   └─ aws:ec2:Instance                           shahtspotscheduler-instance-0                              create     

    Outputs:
        ec2_instance_ids  : [
            [0]: [unknown]
            [1]: [unknown]
        ]
        mykeypair_id      : [unknown]
        private_subnet_ids: [unknown]
        public_subnet_ids : [unknown]
        security_group_id : [unknown]
        sshPrivateKey_id  : [unknown]
        vpc_id            : [unknown]

    Resources:
        + 30 to create

    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/shaht/aws-classic-py-vpc-awsx-natgateway-none-two-instances/dev/updates/10

        Type                                          Name                                                       Status              
    +   pulumi:pulumi:Stack                           aws-classic-py-vpc-awsx-natgateway-none-two-instances-dev  created (54s)       
    +   ├─ tls:index:PrivateKey                       shahtspotscheduler-privatekey                              created (0.90s)     
    +   ├─ awsx:ec2:Vpc                               shahtspotscheduler-vpc                                     created (2s)        
    +   │  └─ aws:ec2:Vpc                             shahtspotscheduler-vpc                                     created (12s)       
    +   │     ├─ aws:ec2:Subnet                       shahtspotscheduler-vpc-private-3                           created (0.97s)     
    +   │     │  └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-private-3                           created (1s)        
    +   │     │     └─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-private-3                           created (1s)        
    +   │     ├─ aws:ec2:Subnet                       shahtspotscheduler-vpc-public-1                            created (12s)       
    +   │     │  └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-public-1                            created (1s)        
    +   │     │     ├─ aws:ec2:Route                  shahtspotscheduler-vpc-public-1                            created (2s)        
    +   │     │     └─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-public-1                            created (1s)        
    +   │     ├─ aws:ec2:Subnet                       shahtspotscheduler-vpc-public-2                            created (13s)       
    +   │     │  └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-public-2                            created (1s)        
    +   │     │     ├─ aws:ec2:Route                  shahtspotscheduler-vpc-public-2                            created (2s)        
    +   │     │     └─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-public-2                            created (1s)        
    +   │     ├─ aws:ec2:InternetGateway              shahtspotscheduler-vpc                                     created (1s)        
    +   │     ├─ aws:ec2:Subnet                       shahtspotscheduler-vpc-public-3                            created (11s)       
    +   │     │  └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-public-3                            created (0.91s)     
    +   │     │     ├─ aws:ec2:Route                  shahtspotscheduler-vpc-public-3                            created (1s)        
    +   │     │     └─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-public-3                            created (1s)        
    +   │     ├─ aws:ec2:Subnet                       shahtspotscheduler-vpc-private-2                           created (2s)        
    +   │     │  └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-private-2                           created (1s)        
    +   │     │     └─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-private-2                           created (1s)        
    +   │     └─ aws:ec2:Subnet                       shahtspotscheduler-vpc-private-1                           created (1s)        
    +   │        └─ aws:ec2:RouteTable                shahtspotscheduler-vpc-private-1                           created (1s)        
    +   │           └─ aws:ec2:RouteTableAssociation  shahtspotscheduler-vpc-private-1                           created (1s)        
    +   ├─ aws:ec2:KeyPair                            shahtspotscheduler-keypair                                 created (0.89s)     
    +   ├─ aws:ec2:SecurityGroup                      shahtspotscheduler-securitygroup                           created (2s)        
    +   ├─ aws:ec2:Instance                           shahtspotscheduler-instance-1                              created (13s)       
    +   └─ aws:ec2:Instance                           shahtspotscheduler-instance-0                              created (13s)       

    Outputs:
        ec2_instance_ids  : [
            [0]: "i-0b09d9181ab55b0c0"
            [1]: "i-019dd544617646de1"
        ]
        mykeypair_id      : "shahtspotscheduler-keypair-53c5f4c"
        private_subnet_ids: [
            [0]: "subnet-0c7a11804699f98cb"
            [1]: "subnet-0e7259facbad29a7f"
            [2]: "subnet-03341251293474497"
        ]
        public_subnet_ids : [
            [0]: "subnet-06a9271f9f350c5ac"
            [1]: "subnet-0453990a33ae938e5"
            [2]: "subnet-01cc4c1e37e78fdde"
        ]
        security_group_id : "sg-02fe045e7fd258368"
        sshPrivateKey_id  : "27f232127a88ceb2d64db133bd756c5621daa1db"
        vpc_id            : "vpc-0e62724f220ba331d"

    Resources:
        + 30 created

    Duration: 56s
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (4):
    OUTPUT                 VALUE
    Current stack outputs (7):
        OUTPUT              VALUE
        ec2_instance_ids    ["i-0b09d9181ab55b0c0","i-019dd544617646de1"]
        mykeypair_id        shahtspotscheduler-keypair-53c5f4c
        private_subnet_ids  ["subnet-0c7a11804699f98cb","subnet-0e7259facbad29a7f","subnet-03341251293474497"]
        public_subnet_ids   ["subnet-06a9271f9f350c5ac","subnet-0453990a33ae938e5","subnet-01cc4c1e37e78fdde"]
        security_group_id   sg-02fe045e7fd258368
        sshPrivateKey_id    27f232127a88ceb2d64db133bd756c5621daa1db
        vpc_id              vpc-0e62724f220ba331d
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```