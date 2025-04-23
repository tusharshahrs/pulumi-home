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

    View in Browser (Ctrl+O): https://app.pulumi.com/shaht/aws-classic-py-vpc-awsx-natgateway-none-two-instances/dev/previews/efc0911a-5891-419e-9d26-1425bb4e3646

        Type                                          Name                                                       Plan       
    +   pulumi:pulumi:Stack                           aws-classic-py-vpc-awsx-natgateway-none-two-instances-dev  create     
    +   └─ awsx:ec2:Vpc                               shaht-vpc                                                  create     
    +      └─ aws:ec2:Vpc                             shaht-vpc                                                  create     
    +         ├─ aws:ec2:Subnet                       shaht-vpc-private-3                                        create     
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-private-3                                        create     
    +         │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-private-3                                        create     
    +         ├─ aws:ec2:Subnet                       shaht-vpc-public-1                                         create     
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-public-1                                         create     
    +         │     ├─ aws:ec2:Route                  shaht-vpc-public-1                                         create     
    +         │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-public-1                                         create     
    +         ├─ aws:ec2:InternetGateway              shaht-vpc                                                  create     
    +         ├─ aws:ec2:Subnet                       shaht-vpc-public-3                                         create     
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-public-3                                         create     
    +         │     ├─ aws:ec2:Route                  shaht-vpc-public-3                                         create     
    +         │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-public-3                                         create     
    +         ├─ aws:ec2:Subnet                       shaht-vpc-private-1                                        create     
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-private-1                                        create     
    +         │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-private-1                                        create     
    +         ├─ aws:ec2:Subnet                       shaht-vpc-public-2                                         create     
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-public-2                                         create     
    +         │     ├─ aws:ec2:Route                  shaht-vpc-public-2                                         create     
    +         │     └─ aws:ec2:RouteTableAssociation  shaht-vpc-public-2                                         create     
    +         └─ aws:ec2:Subnet                       shaht-vpc-private-2                                        create     
    +            └─ aws:ec2:RouteTable                shaht-vpc-private-2                                        create     
    +               └─ aws:ec2:RouteTableAssociation  shaht-vpc-private-2                                        create     

    Outputs:
        private_subnet_ids: [unknown]
        public_subnet_ids : [unknown]
        vpc_id            : [unknown]

    Resources:
        + 25 to create
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (4):
    OUTPUT                 VALUE
Current stack outputs (3):
    OUTPUT              VALUE
    private_subnet_ids  ["subnet-0a02362662672b23e","subnet-07f4fdbafd873caca","subnet-023abac5c81e53135"]
    public_subnet_ids   ["subnet-0e5f7c737919281ab","subnet-081f5eab55399a96f","subnet-0fea3f0aa4a0f4b10"]
    vpc_id              vpc-0a40e69188287364e
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```