# AWS EC2 instance launched via launchtemplate

AWS EC2 instance launched via launchtemplate. The following resources are created:  vpc, securitygroup, sshkeypair,ami, role, instanceprofile, & ec2 instance is launched via a function that returns a launchtemplate.

## Requirements

pulumi 3.0 & node 14.

## Running the App

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
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-ts-launchtemplate/dev/updates/19

        Type                              Name                       Status       
    +   pulumi:pulumi:Stack               aws-ts-launchtemplate-dev  creating..   
    +   ├─ awsx:x:ec2:Vpc                 demo-vpc                   created      
    +   │  ├─ awsx:x:ec2:NatGateway       demo-vpc-0                 created      
    +   │  │  └─ aws:ec2:Eip              demo-vpc-0                 created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-1          created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-0          created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-2         created      
    +   │  ├─ aws:ec2:Vpc                 demo-vpc                   created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-0         created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-0         created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-0         created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-1         created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-1         created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-1         created      
    +   │  │  ├─ aws:ec2:Subnet           demo-vpc-private-1         creating..   
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-private-1         creating..   
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-private-1         creating..   
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-private-1         creating..   
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-private-1         creating..   
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-private-1         creating..   
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-2            created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-2            created      
    +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-public-2            created      
    +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-public-2            created      
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-2            creating.    
    +   │  │  └─ aws:ec2:NatGateway             demo-vpc-0                   created      
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-private-1           created      
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-private-1           created      
    +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-private-1           created     
    +   │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1           created     
    +   │  │  └─ aws:ec2:Route                  demo-vpc-private-1-nat-1     created     
    +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-public-2            created     
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-2            created     
    +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-public-2            created     
    +   │  │  ├─ aws:ec2:Route                  demo-vpc-public-2-ig         created     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-2            created     
    +   │  └─ awsx:x:ec2:InternetGateway        demo-vpc                     created     
    +   │     └─ aws:ec2:InternetGateway        demo-vpc                     created     
    +   ├─ aws:iam:Role                         demo-role                    created     
    +   ├─ tls:index:PrivateKey                 demo-privatekey              created     
    +   ├─ aws:iam:InstanceProfile              demo-instanceprofile         created     
    +   ├─ aws:ec2:KeyPair                      demo-keypair                 created     
    +   ├─ aws:ec2:SecurityGroup                demo-securitygroup-allowtls  created     
    +   ├─ aws:ec2:LaunchTemplate               demo-airflow-webserver-dev   created     
    +   └─ aws:ec2:Instance                     demo-server                  created     
    
    Outputs:
        instanceprofile_name          : "demo-instanceprofile-e3193bd"
        launchtemplate_name           : {"id":"lt-0e006d6d416bbbf02","name":"Demo-Airflow-Webserver","version":"$Default"}
        securitygroup_name            : "demo-securitygroup-allowtls-250c360"
        vpc_name                      : "vpc-0b48f48b518f58bd5"
        vpc_private_subnet_0          : "subnet-0536958182f617902"
        vpc_private_subnet_0_string   : "subnet-0536958182f617902"
        vpc_private_subnet_ids        : [
            [0]: "subnet-0536958182f617902"
            [1]: "subnet-0162add230244ae62"
            [2]: "subnet-0ddbbb7feec9fafe8"
        ]
        vpc_public_subnet_ids         : [
            [0]: "subnet-0045995968e92d3e1"
            [1]: "subnet-0763bb6cac9516f2a"
            [2]: "subnet-0b7f8405be03b3b34"
        ]

    Resources:
        + 45 created

    Duration: 2m22s
    ```
1. Run **pulumi stack** since we need the part appended to the pulumi console url.
    ```bash
    pulumi stack
    More information at: https://app.pulumi.com/myuser/aws-ts-launchtemplate/dev
    ```
    We will need this: `myuser/aws-ts-launchtemplate/dev`

1. Destroy the stack
    ```bash
    pulumi stack destroy -y
    ```