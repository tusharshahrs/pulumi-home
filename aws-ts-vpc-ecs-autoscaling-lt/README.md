
# A VPC, ECS, and Autoscaling Groups via LaunchTemplates

A VPC, ECS, and Autoscaling Groups via LaunchTemplates are created using the awsx package from Pulumi.


## Prerequisites

* [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
* [Configure Pulumi to Use AWS](https://www.pulumi.com/docs/intro/cloud-providers/aws/setup/) (if your AWS CLI is configured, no further changes are required)

## Where are the settings?
 The settings are in `Pulumi`.stackname`.yaml`
 You will be creating a new file that holds your configs

## Deployment
## Creating a new `Pulumi`.stackname`.yaml`

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).
      ```bash
      pulumi stack init dev
      ```
1. Now, install dependencies.

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
   The config values are empty

1. Populate the config.

   Here are aws [endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html)
   ```bash
   pulumi config set aws:region us-east-2 # any valid aws region endpoint
   pulumi config set ame_prefix demo-launchtemplate
   pulumi config set vpc_cidr 10.0.0.0/24
   pulumi config set zone_number 3 # number of availability zones
   pulumi config set number_of_nat_gateways 1 # number of nat gateways. 1 to N(where N is zone_number). recommended to keep at least 2 for high availability. These cost money
   ```

1. View the current config settings
   ```bash
   pulumi config
   ```

   ```bash
    KEY                     VALUE
    aws:region              us-east-2
    name_prefix             demo-launchtemplate
    number_of_nat_gateways  1
    vpc_cidr                10.0.0.0/24
    zone_number             3
   ```

1. Create the stack via  `pulumi up`
    ```bash
    pulumi up -y
    ```

    The Result will be
    ```bash
    Do you want to perform this update? yes
    Updating (dev)

      View Live: https://app.pulumi.com/myuser/aws-ts-vpc-ecs-autoscaling-lt/dev/updates/16

         Type                              Name                               Status       
      +   pulumi:pulumi:Stack               aws-ts-vpc-ecs-autoscaling-lt-dev  creating.    
      +   └─ awsx:x:ec2:Vpc                 demo-ecs-lt-vpc                    created      
      +      ├─ awsx:x:ec2:Subnet           demo-ecs-lt-vpc-private-1          created      
      +      │  ├─ aws:ec2:RouteTable       demo-ecs-lt-vpc-private-1          creating..   
      +      │  └─ aws:ec2:Subnet                 demo-ecs-lt-vpc-private-1          created      
      +      ├─ awsx:x:ec2:Subnet                 demo-ecs-lt-vpc-public-1           created      
      +      │  ├─ aws:ec2:RouteTable             demo-ecs-lt-vpc-public-1           created      
      +      │  ├─ aws:ec2:Subnet                 demo-ecs-lt-vpc-public-1           creating.    
      +      │  └─ aws:ec2:Route                  demo-ecs-lt-vpc-public-1-ig        creating     
      +      │  └─ aws:ec2:Route                  demo-ecs-lt-vpc-public-1-ig        creating.    
      +      │  ├─ aws:ec2:Subnet                 demo-ecs-lt-vpc-public-1           creating...  
      +      │  ├─ aws:ec2:Subnet                 demo-ecs-lt-vpc-public-1           created      
      +      │  ├─ aws:ec2:RouteTable             demo-ecs-lt-vpc-public-2           created      
      +      │  └─ aws:ec2:RouteTableAssociation  demo-ecs-lt-vpc-public-1           creating.    
      +   │  │  ├─ aws:ec2:Route                  demo-ecs-lt-vpc-public-2-ig        created      
      +   pulumi:pulumi:Stack                     aws-ts-vpc-ecs-autoscaling-lt-dev  creating     
      +   │  ├─ awsx:x:ec2:Subnet                 demo-ecs-lt-vpc-private-0          created      
      +   │  │  ├─ aws:ec2:RouteTable                   demo-ecs-lt-vpc-private-0          created      
      +   │  │  ├─ aws:ec2:Subnet                       demo-ecs-lt-vpc-private-0          created      
      +   pulumi:pulumi:Stack                                         aws-ts-vpc-ecs-autoscaling-lt-dev      creating..   read aws:autoscaling:Group demo-ecs-lt-autoscalinggroup
      +   │  │  └─ aws:ec2:RouteTableAssociation                      demo-ecs-lt-vpc-private-0              created      
      +   │  │  └─ aws:ec2:Route                                      demo-ecs-lt-vpc-private-0-nat-0        creating     
      +   │  ├─ awsx:x:ec2:InternetGateway                            demo-ecs-lt-vpc                        created     
      +   │  │  └─ aws:ec2:InternetGateway                            demo-ecs-lt-vpc                        created     
      +   │  ├─ awsx:x:ec2:Subnet                                     demo-ecs-lt-vpc-public-0               created     
      +   │  │  ├─ aws:ec2:RouteTable                                 demo-ecs-lt-vpc-public-0               created     
      +   │  │  ├─ aws:ec2:Subnet                                     demo-ecs-lt-vpc-public-0               created     
      +   │  │  ├─ aws:ec2:Route                                      demo-ecs-lt-vpc-public-0-ig            created     
      +   │  │  └─ aws:ec2:RouteTableAssociation                      demo-ecs-lt-vpc-public-0               created     
      +   │  ├─ awsx:x:ec2:Subnet                                     demo-ecs-lt-vpc-private-2              created     
      +   │  │  ├─ aws:ec2:Subnet                                     demo-ecs-lt-vpc-private-2              created     
      +   │  │  ├─ aws:ec2:RouteTable                                 demo-ecs-lt-vpc-private-2              created     
      +   │  │  ├─ aws:ec2:RouteTableAssociation                      demo-ecs-lt-vpc-private-2              created     
      +   │  │  └─ aws:ec2:Route                                      demo-ecs-lt-vpc-private-2-nat-2        created     
      +   │  ├─ awsx:x:ec2:NatGateway                                 demo-ecs-lt-vpc-0                      created     
      +   │  │  ├─ aws:ec2:Eip                                        demo-ecs-lt-vpc-0                      created     
      +   │  │  └─ aws:ec2:NatGateway                                 demo-ecs-lt-vpc-0                      created     
      +   │  └─ aws:ec2:Vpc                                           demo-ecs-lt-vpc                        created     
      +   └─ awsx:x:ecs:Cluster                                       demo-ecs-lt-ecs                        created     
      +      ├─ aws:ecs:Cluster                                       demo-ecs-lt-ecs                        created     
      +      ├─ awsx:x:ec2:SecurityGroup                              demo-ecs-lt-ecs                        created     
      +      │  ├─ awsx:x:ec2:IngressSecurityGroupRule                demo-ecs-lt-ecs-ssh                    created     
      +      │  │  └─ aws:ec2:SecurityGroupRule                       demo-ecs-lt-ecs-ssh                    created     
      +      │  ├─ awsx:x:ec2:IngressSecurityGroupRule                demo-ecs-lt-ecs-containers             created     
      +      │  │  └─ aws:ec2:SecurityGroupRule                       demo-ecs-lt-ecs-containers             created     
      +      │  ├─ awsx:x:ec2:EgressSecurityGroupRule                 demo-ecs-lt-ecs-egress                 created     
      +      │  │  └─ aws:ec2:SecurityGroupRule                       demo-ecs-lt-ecs-egress                 created     
      +      │  └─ aws:ec2:SecurityGroup                              demo-ecs-lt-ecs                        created     
      +      └─ awsx:x:autoscaling:AutoScalingGroup                   demo-ecs-lt-autoscalinggroup           created     
      +         ├─ awsx:x:autoscaling:AutoScalingLaunchConfiguration  demo-ecs-lt-autoscalinggroup           created     
      +         │  ├─ aws:s3:Bucket                                   demo-ecs-lt-autoscalinggroup           created     
      +         │  ├─ aws:iam:Role                                    demo-ecs-lt-autoscalinggroup           created     
      +         │  ├─ aws:iam:RolePolicyAttachment                    demo-ecs-lt-autoscalinggroup-5e4162cd  created     
      +         │  ├─ aws:iam:RolePolicyAttachment                    demo-ecs-lt-autoscalinggroup-efc8f10d  created     
      +         │  ├─ aws:iam:InstanceProfile                         demo-ecs-lt-autoscalinggroup           created     
      +         │  └─ aws:ec2:LaunchConfiguration                     demo-ecs-lt-autoscalinggroup           created     
      +         └─ aws:cloudformation:Stack                           demo-ecs-lt-autoscalinggroup           created     
      
      Outputs:
         autoscaling_group_ame   : "demo-ecs-lt-autoscalinggroup-8f0ad3a-Instances-7TATS4FL0F4Q"
         cluster_name            : "demo-ecs-lt-ecs-e5e1903"
         launchConfiguration_name: "demo-ecs-lt-autoscalinggroup-07c3020"
         vpc_name                : "vpc-04d8f7a52e05f3849"

      Resources:
         + 57 created

      Duration: 2m20s
    ```


1. Check the Outputs
   ```bash
   pulumi stack output
   ```
   Returns:
   ```bash
   Current stack outputs (4):
    OUTPUT                    VALUE
    autoscaling_group_ame     demo-ecs-lt-autoscalinggroup-8f0ad3a-Instances-7TATS4FL0F4Q
    cluster_name              demo-ecs-lt-ecs-e5e1903
    launchConfiguration_name  demo-ecs-lt-autoscalinggroup-07c3020
    vpc_name                  vpc-04d8f7a52e05f3849

   ```

1. Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```