# AWS EC2 Instance with Two EBS Volumes

AWS ec2 instance with two ebs volumes. vpc creatd with awsx.  Call **then** on getAmi and on the subnet id to use.  Also call [interpolate](https://www.pulumi.com/docs/intro/concepts/inputs-outputs/#outputs-and-strings), which allows us to *concatenate string outputs with other strings directly*.

## Deployment

1. Create a new stack

    ```bash
    pulumi stack init dev
    ```

1. Restore NPM dependencies

    ```bash
    npm install
    ```
1. Set the AWS region location to use
    ```bash
    pulumi config set aws:region us-east-2
    ```

1. Run **pulumi up** to preview and deploy changes via selecting **y**

    ```bash
    pulumi up
    Previewing update (dev)

    View Live: https://app.pulumi.com/shaht/aws-classic-ts-ec2-instance-with-ebs-volume/dev/updates/9

        Type                              Name                                             Status       
    +   pulumi:pulumi:Stack               aws-classic-ts-ec2-instance-with-ebs-volume-dev  creating...  
    +   pulumi:pulumi:Stack               aws-classic-ts-ec2-instance-with-ebs-volume-dev  creating..   
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-2                               created      
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-private-2                               creating     
    +   │  ├─ awsx:x:ec2:NatGateway       demo-vpc-0                                       created      
    +   │  │  └─ aws:ec2:Eip              demo-vpc-0                                       created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-1                               created      
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-private-1                               creating     
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-0                                created      
    +   │  │  ├─ aws:ec2:RouteTable       demo-vpc-public-0                                creating     
    +   │  │  └─ aws:ec2:Subnet           demo-vpc-public-0                                creating     
    +   │  │  └─ aws:ec2:Subnet           demo-vpc-public-0                                creating     
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-1                                created      
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-public-1                                creating     
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-public-1                                creating     
    +   │  │  └─ aws:ec2:Subnet           demo-vpc-public-1                                creating     
    +   │  │  └─ aws:ec2:Subnet                 demo-vpc-public-1                                creating...  
    +   │  │  └─ aws:ec2:Subnet                 demo-vpc-public-1                                creating     
    +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-public-2                                created      
    +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-public-2                                created      
    +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-public-2                                created      
    +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-public-2                                created      
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-0                                created      
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-2                                created      
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-2                                created      
    +   │  │  ├─ aws:ec2:Route                  demo-vpc-public-2-ig                             created      
    +   │  │  ├─ aws:ec2:Route                  demo-vpc-public-2-ig                             created      
    +   │  │  ├─ aws:ec2:Route                  demo-vpc-public-2-ig                             created      
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                                created      
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                                created      
    +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-private-0                               created     
    +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-private-0                               created     
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-private-0                               created     
    +   │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-0                               created     
    +   │  │  └─ aws:ec2:Route                  demo-vpc-private-0-nat-0                         created     
    +   │  ├─ awsx:x:ec2:InternetGateway        demo-vpc                                         created     
    +   │  │  └─ aws:ec2:InternetGateway        demo-vpc                                         created     
    +   │  └─ aws:ec2:Vpc                       demo-vpc                                         created     
    +   ├─ tls:index:PrivateKey                 demo-privatekey                                  created     
    +   ├─ aws:ec2:KeyPair                      demo-keypair                                     created     
    +   └─ aws:ec2:Instance                     demo-server                                      created     
    
    Outputs:
        ami               : "ami-0d8f6eb4f641ef691"
        instance_name     : "i-0fb5c68a1f586739d"
        keypair_name      : "demo-keypair-e66dcdb"
        subnet_id_to_use  : "subnet-0f81a9d9c5af71ac0"
        vpc_name          : "vpc-007e7444a758638da"
        vpc_privatesubnets: [
            [0]: "subnet-0350cbdaf91c69727"
            [1]: "subnet-0eef288fc681c1f42"
            [2]: "subnet-05a52db3e9da10dfe"
        ]
        vpc_publicsubnets : [
            [0]: "subnet-0f81a9d9c5af71ac0"
            [1]: "subnet-0c65851d42d4c8eb8"
            [2]: "subnet-04ef0d9a1cd21c154"
        ]

    Resources:
        + 41 created

    Duration: 2m24s
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    ami                 ami-0d8f6eb4f641ef691
    instance_name       i-0fb5c68a1f586739d
    keypair_name        demo-keypair-e66dcdb
    subnet_id_to_use    subnet-0f81a9d9c5af71ac0
    vpc_name            vpc-007e7444a758638da
    vpc_privatesubnets  ["subnet-0350cbdaf91c69727","subnet-0eef288fc681c1f42","subnet-05a52db3e9da10dfe"]
    vpc_publicsubnets   ["subnet-0f81a9d9c5af71ac0","subnet-0c65851d42d4c8eb8","subnet-04ef0d9a1cd21c154"]
   ```

1. Destroy the stack
    ```bash
    pulumi stack destroy -y
    ```

1. Remove the stack.  This will remove the *Pulumi.dev.yaml* file
   ```bash
   pulumi stack rm
   ```