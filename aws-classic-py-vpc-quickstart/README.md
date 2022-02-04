# AWS VPC in Python with Quickstart

AWS VPC, igw, nat gateways, public and private subnets with  [AWS Quickstart VPC](https://www.pulumi.com/registry/packages/aws-quickstart-vpc/).for deploying your own vpc.  **COST WARNING** This creates `3` NAT gateways, these are EXPENSIVE for a dev environment.  Use **DIFFERENT** code and project/stack if you are using this in dev.  The VPC is built-in `Python`.

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

1. Populate the config.  Here are aws [endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html). *Note* If you pick something besides *us-east-2*, you need to edit the *index.ts* file and update the 3 availability zones

   ```bash
   pulumi config set aws:region us-east-2 # any valid aws region endpoint
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
   View Live: https://app.pulumi.com/myuser/aws-classic-py-vpc-quickstart/dev/updates/6

        Type                             Name                               Status       
    +   pulumi:pulumi:Stack              aws-classic-py-vpc-quickstart-dev  creating...  
    +   └─ aws-quickstart-vpc:index:Vpc  demo-vpc                           creating     
    +      ├─ aws:ec2:Vpc                demo-vpc-vpc                       created      
    +      ├─ aws:ec2:Eip                demo-vpc-elastic-ip-0              created      
    +      ├─ aws:ec2:Eip                demo-vpc-elastic-ip-1              created      
    +      ├─ aws:ec2:Eip                demo-vpc-elastic-ip-2              created      
    +      ├─ aws:ec2:RouteTable         demo-vpc-public-route-table-1      creating..   
    +      ├─ aws:ec2:Subnet             demo-vpc-public-subnet-1           created      
    +      ├─ aws:ec2:RouteTable             demo-vpc-public-route-table-2              created      
    +   └─ aws-quickstart-vpc:index:Vpc      demo-vpc                                   creating...  
    +      ├─ aws:ec2:RouteTable             demo-vpc-public-route-table-0              created      
    +      ├─ aws:ec2:Subnet                 demo-vpc-private-subnet-a-2                created      
    +      ├─ aws:ec2:InternetGateway        demo-vpc-internet-gateway                  created      
    +      ├─ aws:ec2:Subnet                 demo-vpc-private-subnet-a-1                created      
    +      ├─ aws:ec2:Subnet                 demo-vpc-public-subnet-0                   created      
    +      ├─ aws:ec2:Subnet                 demo-vpc-private-subnet-a-0                created      
    +      ├─ aws:ec2:NatGateway             demo-vpc-nat-gateway-1                     created     
    +      ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-route-table-association-1  created     
    +      ├─ aws:ec2:NatGateway             demo-vpc-nat-gateway-2                     created     
    +      ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-route-table-association-2  created     
    +      ├─ aws:ec2:Route                  demo-vpc-public-route-1                    created     
    +      ├─ aws:ec2:Route                  demo-vpc-public-route-0                    created     
    +      ├─ aws:ec2:Route                  demo-vpc-public-route-2                    created     
    +      ├─ aws:ec2:NatGateway             demo-vpc-nat-gateway-0                     created     
    +      └─ aws:ec2:RouteTableAssociation  demo-vpc-public-route-table-association-0  created     
    
    Outputs:
        natgatewayIPS   : [
            [0]: "3.143.164.214"
            [1]: "3.135.42.232"
            [2]: "3.138.54.47"
        ]
        privateSubnetIDS: [
            [0]: "subnet-0ac5c5e77acd25db1"
            [1]: "subnet-06e91ca2dcd3d40d0"
            [2]: "subnet-0899f29ccf360ebf5"
        ]
        publicSubnetIDS : [
            [0]: "subnet-0f9dc2e6471db2ca0"
            [1]: "subnet-0a9c39f8b6c845ce4"
            [2]: "subnet-0c4da59c57000bc8e"
        ]
        vpc_id          : "vpc-0d6d70235745518aa"

    Resources:
        + 25 created

    Duration: 2m18s
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (4):
    OUTPUT            VALUE
    natgatewayIPS     ["3.143.164.214","3.135.42.232","3.138.54.47"]
    privateSubnetIDS  ["subnet-0ac5c5e77acd25db1","subnet-06e91ca2dcd3d40d0","subnet-0899f29ccf360ebf5"]
    publicSubnetIDS   ["subnet-0f9dc2e6471db2ca0","subnet-0a9c39f8b6c845ce4","subnet-0c4da59c57000bc8e"]
    vpc_id            vpc-0d6d70235745518aa
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```