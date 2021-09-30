
# A VPC, ECS, and Autoscaling Groups via LaunchTemplates

A VPC, ECS, and Autoscaling Groups via LaunchTemplates are created using the awsx package from Pulumi.  Note, the **VPC** has already been created, so we are using an existing one


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
   vpc_already_created_name  vpc-08429d98b81d414f1 # passing in the vpc id of an existing vpc
   ```

1. View the current config settings
   ```bash
   pulumi config
   ```

   ```bash
    KEY                     VALUE
   pulumi config set aws:region us-east-2 
   vpc_already_created_name  vpc-08429d98b81d414f1 
   ```

1. Special Considerations.  
   - We are using an existing vpc.  We are calling **awsx.ec2.Vpc.fromExistingIds**
   - We are using existing subnets.  We are calling **aws.ec2.getSubnetIds**
   - We are calling **then** on the subnets since we can only use 1 subnet per az for the loadbalancer.  The getsubnets call
   returns all subnets ( since we have 1 public and 1 private in each az, this will cause a problem).  Our work around is to only pass in 2 subnets
   to the application load balancer.  
   - We call these **SAME** subnets in the autoscaling group.

1. Create the stack via  `pulumi up`
    ```bash
    pulumi up -y
    ```

    The Result will be
    ```bash
    Do you want to perform this update? yes
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-ts-existingvpc-ecs-autoscaling-lt/dev/updates/14

        Type                                                        Name                                       Status       Info
    +   pulumi:pulumi:Stack                                         aws-ts-existingvpc-ecs-autoscaling-lt-dev  creating..   read aws:ec2:Vpc demo-getvpc
    +   pulumi:pulumi:Stack                                         aws-ts-existingvpc-ecs-autoscaling-lt-dev  creating     read aws:ec2:Vpc demo-getvpc
    +   │  └─ aws:ec2:SecurityGroup                                 demo-alb                                   created     
    +   ├─ awsx:x:ecs:Cluster                                       demo-ecs                                   created     
    +   │  ├─ awsx:x:autoscaling:AutoScalingGroup                   demo-autoscalinggroup                      created     
    +   │  │  ├─ awsx:x:autoscaling:AutoScalingLaunchConfiguration  demo-autoscalinggroup                      created     
    +   │  │  │  ├─ aws:s3:Bucket                                   demo-autoscalinggroup                      created     
    +   │  │  │  ├─ aws:iam:Role                                    demo-autoscalinggroup                      created     
    +   │  │  │  ├─ aws:iam:RolePolicyAttachment                    demo-autoscalinggroup-5e4162cd             created     
    +   │  │  │  ├─ aws:iam:RolePolicyAttachment                    demo-autoscalinggroup-efc8f10d             created     
    +   │  │  │  ├─ aws:iam:InstanceProfile                         demo-autoscalinggroup                      created     
    +   │  │  │  └─ aws:ec2:LaunchConfiguration                     demo-autoscalinggroup                      created     
    +   │  │  └─ aws:cloudformation:Stack                           demo-autoscalinggroup                      created     
    +   │  ├─ aws:ecs:Cluster                                       demo-ecs                                   created     
    +   │  └─ awsx:x:ec2:SecurityGroup                              demo-ecs                                   created     
    +   │     ├─ awsx:x:ec2:IngressSecurityGroupRule                demo-ecs-containers                        created     
    +   │     │  └─ aws:ec2:SecurityGroupRule                       demo-ecs-containers                        created     
    +   │     ├─ awsx:x:ec2:EgressSecurityGroupRule                 demo-ecs-egress                            created     
    +   │     │  └─ aws:ec2:SecurityGroupRule                       demo-ecs-egress                            created     
    +   │     ├─ awsx:x:ec2:IngressSecurityGroupRule                demo-ecs-ssh                               created     
    +   │     │  └─ aws:ec2:SecurityGroupRule                       demo-ecs-ssh                               created     
    +   │     └─ aws:ec2:SecurityGroup                              demo-ecs                                   created     
    +   ├─ aws:lb:ApplicationLoadBalancer                           demo-alb                                   created     
    +   │  ├─ awsx:lb:ApplicationTargetGroup                        demo-targetgroup                           created     
    +   │  │  └─ aws:lb:TargetGroup                                 demo-targetgroup                           created     
    +   │  └─ aws:lb:LoadBalancer                                   demo-alb                                   created     
    +   └─ awsx:x:ec2:Vpc                                           demo-getvpc                                created     
    
    Outputs:
        autoscaling_group_ame   : "demo-autoscalinggroup-58854fd-Instances-60JX0QK6WT1O"
        cluster_name            : "demo-ecs-c46d384"
        launchconfiguration_name: "demo-autoscalinggroup-709e635"
        loadbalancer_id         : "arn:aws:elasticloadbalancing:us-east-2:052848974346:loadbalancer/app/demo-alb-a245489/721f7af8f9d00fb2"
        mysubnetids             : [
            [0]: "subnet-04dafe2a672d35475"
            [1]: "subnet-097b26debcfb5adab"
            [2]: "subnet-0f288794bbbd30f13"
            [3]: "subnet-00040c00c2eb4341e"
            [4]: "subnet-0736ac28f2d26b06c"
            [5]: "subnet-0e9548977bd17436d"
        ]
        subnet0                 : "subnet-04dafe2a672d35475"
        subnet1                 : "subnet-097b26debcfb5adab"
        subnet2                 : "subnet-0f288794bbbd30f13"
        subnet3                 : "subnet-00040c00c2eb4341e"
        subnet4                 : "subnet-0736ac28f2d26b06c"
        subnet5                 : "subnet-0e9548977bd17436d"
        vpc_name                : "vpc-08429d98b81d414f1"

    Resources:
        + 27 created

    Duration: 4m24s
    ```


1. Check the Outputs
   ```bash
   pulumi stack output
   ```
   Returns:
   ```bash
    Current stack outputs (12):
        OUTPUT                    VALUE
        autoscaling_group_ame     demo-autoscalinggroup-58854fd-Instances-60JX0QK6WT1O
        cluster_name              demo-ecs-c46d384
        launchconfiguration_name  demo-autoscalinggroup-709e635
        loadbalancer_id           arn:aws:elasticloadbalancing:us-east-2:052848974346:loadbalancer/app/demo-alb-a245489/721f7af8f9d00fb2
        mysubnetids               ["subnet-04dafe2a672d35475","subnet-097b26debcfb5adab","subnet-0f288794bbbd30f13","subnet-00040c00c2eb4341e","subnet-0736ac28f2d26b06c","subnet-0e9548977bd17436d"]
        subnet0                   subnet-04dafe2a672d35475
        subnet1                   subnet-097b26debcfb5adab
        subnet2                   subnet-0f288794bbbd30f13
        subnet3                   subnet-00040c00c2eb4341e
        subnet4                   subnet-0736ac28f2d26b06c
        subnet5                   subnet-0e9548977bd17436d
        vpc_name                  vpc-08429d98b81d414f1
   ```

1. Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```