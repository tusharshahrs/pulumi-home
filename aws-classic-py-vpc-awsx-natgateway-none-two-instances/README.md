# AWS AWSX Multilang Vpc Single Nat Gateway in Python

[AWSX](https://www.pulumi.com/registry/packages/awsx/)multilang VPC, igw, zero nat gateway strategy, public and private subnets

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
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

     Results
   ```bash
    Previewing update (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/shaht/aws-classic-py-vpc-awsx-natgateway-none-two-instances/dev/previews/89408b83-492b-4d7c-aa95-ec03ecd1112a

        Type                                          Name                                                       Plan       
    +   pulumi:pulumi:Stack                           aws-classic-py-vpc-awsx-natgateway-none-two-instances-dev  create     
    +   ├─ tls:index:PrivateKey                       shaht-privatekey                                           create     
    +   ├─ awsx:ec2:Vpc                               shaht-vpc                                                  create     
    +   │  └─ aws:ec2:Vpc                             shaht-vpc                                                  create     
    +   │     ├─ aws:ec2:InternetGateway              shaht-vpc                                                  create     
    +   │     ├─ aws:ec2:Subnet                       shaht-vpc-private-3                                        create     
    +   │     │  └─ aws:ec2:RouteTable                shaht-vpc-private-3                                        create     
    +   │     │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-private-3                                        create     
    +   │     ├─ aws:ec2:Subnet                       shaht-vpc-public-1                                         create     
    +   │     │  └─ aws:ec2:RouteTable                shaht-vpc-public-1                                         create     
    +   │     │     ├─ aws:ec2:Route                  shaht-vpc-public-1                                         create     
    +   │     │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-public-1                                         create     
    +   │     ├─ aws:ec2:Subnet                       shaht-vpc-private-2                                        create     
    +   │     │  └─ aws:ec2:RouteTable                shaht-vpc-private-2                                        create     
    +   │     │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-private-2                                        create     
    +   │     ├─ aws:ec2:Subnet                       shaht-vpc-private-1                                        create     
    +   │     │  └─ aws:ec2:RouteTable                shaht-vpc-private-1                                        create     
    +   │     │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-private-1                                        create     
    +   │     ├─ aws:ec2:Subnet                       shaht-vpc-public-3                                         create     
    +   │     │  └─ aws:ec2:RouteTable                shaht-vpc-public-3                                         create     
    +   │     │     ├─ aws:ec2:Route                  shaht-vpc-public-3                                         create     
    +   │     │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-public-3                                         create     
    +   │     └─ aws:ec2:Subnet                       shaht-vpc-public-2                                         create     
    +   │        └─ aws:ec2:RouteTable                shaht-vpc-public-2                                         create     
    +   │           ├─ aws:ec2:RouteTableAssociation  shaht-vpc-public-2                                         create     
    +   │           └─ aws:ec2:Route                  shaht-vpc-public-2                                         create     
    +   ├─ aws:ec2:KeyPair                            shaht-keypair                                              create     
    +   ├─ aws:ec2:Instance                           shaht-instance-1                                           create     
    +   ├─ aws:ec2:Instance                           shaht-instance-0                                           create     
    +   └─ aws:ec2:SecurityGroup                      shaht-securitygroup                                        create     

    Outputs:
        ec2_instance_ids   : [
            [0]: [unknown]
            [1]: [unknown]
        ]
        mykeypair_id       : [unknown]
        private_subnet_id_0: [unknown]
        private_subnet_ids : [unknown]
        public_subnet_ids  : [unknown]
        security_group_id  : [unknown]
        sshPrivateKey_id   : [unknown]
        vpc_id             : [unknown]

    Resources:
        + 30 to create

    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/shaht/aws-classic-py-vpc-awsx-natgateway-none-two-instances/dev/updates/7

        Type                                          Name                                                       Status              
    +   pulumi:pulumi:Stack                           aws-classic-py-vpc-awsx-natgateway-none-two-instances-dev  created (49s)       
    +   ├─ awsx:ec2:Vpc                               shaht-vpc                                                  created (2s)        
    +   │  └─ aws:ec2:Vpc                             shaht-vpc                                                  created (12s)       
    +   │     ├─ aws:ec2:Subnet                       shaht-vpc-public-1                                         created (11s)       
    +   │     │  └─ aws:ec2:RouteTable                shaht-vpc-public-1                                         created (1s)        
    +   │     │     ├─ aws:ec2:Route                  shaht-vpc-public-1                                         created (1s)        
    +   │     │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-public-1                                         created (1s)        
    +   │     ├─ aws:ec2:Subnet                       shaht-vpc-private-3                                        created (1s)        
    +   │     │  └─ aws:ec2:RouteTable                shaht-vpc-private-3                                        created (1s)        
    +   │     │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-private-3                                        created (0.84s)     
    +   │     ├─ aws:ec2:InternetGateway              shaht-vpc                                                  created (1s)        
    +   │     ├─ aws:ec2:Subnet                       shaht-vpc-private-2                                        created (1s)        
    +   │     │  └─ aws:ec2:RouteTable                shaht-vpc-private-2                                        created (1s)        
    +   │     │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-private-2                                        created (0.64s)     
    +   │     ├─ aws:ec2:Subnet                       shaht-vpc-public-2                                         created (11s)       
    +   │     │  └─ aws:ec2:RouteTable                shaht-vpc-public-2                                         created (1s)        
    +   │     │     ├─ aws:ec2:RouteTableAssociation  shaht-vpc-public-2                                         created (1s)        
    +   │     │     └─ aws:ec2:Route                  shaht-vpc-public-2                                         created (1s)        
    +   │     ├─ aws:ec2:Subnet                       shaht-vpc-private-1                                        created (1s)        
    +   │     │  └─ aws:ec2:RouteTable                shaht-vpc-private-1                                        created (1s)        
    +   │     │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-private-1                                        created (0.64s)     
    +   │     └─ aws:ec2:Subnet                       shaht-vpc-public-3                                         created (12s)       
    +   │        └─ aws:ec2:RouteTable                shaht-vpc-public-3                                         created (0.91s)     
    +   │           ├─ aws:ec2:Route                  shaht-vpc-public-3                                         created (1s)        
    +   │           └─ aws:ec2:RouteTableAssociation  shaht-vpc-public-3                                         created (1s)        
    +   ├─ tls:index:PrivateKey                       shaht-privatekey                                           created (1s)        
    +   ├─ aws:ec2:KeyPair                            shaht-keypair                                              created (0.90s)     
    +   ├─ aws:ec2:SecurityGroup                      shaht-securitygroup                                        created (2s)        
    +   ├─ aws:ec2:Instance                           shaht-instance-1                                           created (13s)       
    +   └─ aws:ec2:Instance                           shaht-instance-0                                           created (13s)       

    Outputs:
        ec2_instance_ids   : [
            [0]: "i-0c3e830e221e40c85"
            [1]: "i-0cda0a021edd626df"
        ]
        mykeypair_id       : "shaht-keypair-c578f7f"
        private_subnet_id_0: "subnet-0e33e2ca1662eda3c"
        private_subnet_ids : [
            [0]: "subnet-0e33e2ca1662eda3c"
            [1]: "subnet-04b6d8623c1c7bc00"
            [2]: "subnet-0fafef95c7552d1d3"
        ]
        public_subnet_ids  : [
            [0]: "subnet-000f246f7d8a76e08"
            [1]: "subnet-0a481c430a62873f8"
            [2]: "subnet-0c4e55909cb6fc64f"
        ]
        security_group_id  : "sg-0faee11193266d116"
        sshPrivateKey_id   : "0216316310e7e410e514732005529ca9b58c2652"
        vpc_id             : "vpc-0447b489da5ac50ec"

    Resources:
        + 30 created

    Duration: 50s
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (4):
    OUTPUT                 VALUE
    Current stack outputs (8):
        OUTPUT               VALUE
        ec2_instance_ids     ["i-0c3e830e221e40c85","i-0cda0a021edd626df"]
        mykeypair_id         shaht-keypair-c578f7f
        private_subnet_id_0  subnet-0e33e2ca1662eda3c
        private_subnet_ids   ["subnet-0e33e2ca1662eda3c","subnet-04b6d8623c1c7bc00","subnet-0fafef95c7552d1d3"]
        public_subnet_ids    ["subnet-000f246f7d8a76e08","subnet-0a481c430a62873f8","subnet-0c4e55909cb6fc64f"]
        security_group_id    sg-0faee11193266d116
        sshPrivateKey_id     0216316310e7e410e514732005529ca9b58c2652
        vpc_id               vpc-0447b489da5ac50ec
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```