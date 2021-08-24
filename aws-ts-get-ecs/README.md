
# AWS Fargate Services with existing vpc and ecs.

The vpc is read in via [StackReferences](https://www.pulumi.com/docs/intro/concepts/stack/#stackreferences) and built via awsx.
The ecs cluster read in via [StackReferences](https://www.pulumi.com/docs/intro/concepts/stack/#stackreferences) and built via awsx.  

## Prerequisites

* [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
* [Configure Pulumi to Use AWS](https://www.pulumi.com/docs/intro/cloud-providers/aws/setup/) (if your AWS CLI is configured, no further changes are required)
* **Vpc already created** via [aws-ts-vpc-crosswalk](https://github.com/tusharshahrs/pulumi-home/tree/main/aws-ts-vpc-crosswalk) or any other method
* **ecs already created** via [aws-ts-ecs-awsx](aws-ts-ecs-awsx ) or any other method

## Where are the settings?
 The settings are in `Pulumi`.stackname`.yaml`
 You will be creating a new file that holds your configs

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).  **Pulumi.dev.yaml** wil be created
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

1. Populate the config.  The networking stack follows [this](https://www.pulumi.com/docs/intro/concepts/stack/#stackreferences) 
   means that the format is **<organization>/<project>/<stack>** See *networkingStack* below for example

   Here are aws [endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html)

    ```bash
    pulumi config set aws:region us-east-2 # needs to match the region where the vpc is stood up.
    networkingStack  myuser/crosswalk-vpc/myvpc  # must match vpc stack
    ecsStack         myuser/aws-ts-ecs-awsx/dev  # must match where ecs is created via awsx 

    ```

1. View the current config settings
    ```bash
    pulumi config
    ```

    ```bash
    KEY                     VALUE

    aws:region       us-east-2
    networkingStack  myuser/crosswalk-vpc/myvpc
    ecsStack         myuser/aws-ts-ecs-awsx/dev 
    ```

1. Special Considerations.  
   - We are using an existing vpc. This MUST already exist otherwise this stack will FAIL.
   - We are using an existing ecs. This MUST already exist otherwise this stack will FAIL.
   - We are creating a targetgroup and targetlistener via aws.  

1. Create the stack via pulumi up
    ```bash
    pulumi up -y
    ```

    The Result will be
    ```bash
    Do you want to perform this update? yes
    Updating (dev)

    View Live: https://app.pulumi.com/myuser/aws-ts-get-ecs/dev/updates/41

        Type                                          Name                                     Status       Info
    +   pulumi:pulumi:Stack                           aws-ts-get-ecs-dev                       creating...  read aws:ec2:Vpc demo2-getvpc
    +   ├─ awsx:x:ecs:FargateService                  demo2-service                            created      
    +   │  └─ aws:ecs:Service                         demo2-service                            creating     
    +   │  └─ aws:ecs:Service                         demo2-service                            creating.    
    +   │  ├─ aws:cloudwatch:LogGroup                 demo2-taskdefinition                     created     
    +   │  ├─ aws:iam:Role                            demo2-taskdefinition-task                created     
    +   │  ├─ aws:iam:Role                            demo2-taskdefinition-execution           created     
    +   │  ├─ aws:iam:RolePolicyAttachment            demo2-taskdefinition-task-0cbb1731       created     
    +   │  ├─ aws:iam:RolePolicyAttachment            demo2-taskdefinition-task-b5aeb6b6       created     
    +   │  ├─ aws:iam:RolePolicyAttachment            demo2-taskdefinition-execution-9a42f520  created     
    +   │  ├─ aws:iam:RolePolicyAttachment            demo2-taskdefinition-execution-58ed699a  created     
    +   │  └─ aws:ecs:TaskDefinition                  demo2-taskdefinition                     created     
    +   ├─ awsx:x:ec2:SecurityGroup                   demo2-service-0                          created     
    +   ├─ awsx:x:ec2:Vpc                             demo2-getvpc                             created     
    +   ├─ awsx:x:ecs:Cluster                         demo2-ecs1                               created     
    +   │  └─ awsx:x:ec2:SecurityGroup                demo2-ecs1                               created     
    +   │     ├─ awsx:x:ec2:IngressSecurityGroupRule  demo2-ecs1-ssh                           created     
    +   │     │  └─ aws:ec2:SecurityGroupRule         demo2-ecs1-ssh                           created     
    +   │     ├─ awsx:x:ec2:IngressSecurityGroupRule  demo2-ecs1-containers                    created     
    +   │     │  └─ aws:ec2:SecurityGroupRule         demo2-ecs1-containers                    created     
    +   │     ├─ awsx:x:ec2:EgressSecurityGroupRule   demo2-ecs1-egress                        created     
    +   │     │  └─ aws:ec2:SecurityGroupRule         demo2-ecs1-egress                        created     
    +   │     └─ aws:ec2:SecurityGroup                demo2-ecs1                               created     
    +   ├─ awsx:x:ec2:Vpc                             default-vpc                              created     
    +   │  ├─ awsx:x:ec2:Subnet                       default-vpc-public-0                     created     
    +   │  └─ awsx:x:ec2:Subnet                       default-vpc-public-1                     created     
    +   ├─ aws:alb:TargetGroup                        demo2-targetgroup                        created     
    +   └─ aws:alb:Listener                           demo2-targetlistener                     created     
    
    Outputs:
        target_listener_arn: "arn:aws:elasticloadbalancing:us-east-2:1234556:listener/app/demo-alb-fc410af/dfb6a78ca7fdf37b/fee58677326abf0b"
        targetgroup_name   : "demo2-targetgroup-e037b0d"
        taskdefinition_id  : "demo2-taskdefinition-aece9bcd"
        taskdefinition_role: "demo2-taskdefinition-task-ded835d"
        vpc_id             : "vpc-025f676ca8032ff3a"
        vpc_name           : "shaht-dev"

    Resources:
        + 28 created

    Duration: 5m49s

1. Check out the stack Outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (6):
    OUTPUT               VALUE
    target_listener_arn  arn:aws:elasticloadbalancing:us-east-2:1234556:listener/app/demo-alb-fc410af/dfb6a78ca7fdf37b/fee58677326abf0b
    targetgroup_name     demo2-targetgroup-e037b0d
    taskdefinition_id    demo2-taskdefinition-aece9bcd
    taskdefinition_role  demo2-taskdefinition-task-ded835d
    vpc_id               vpc-025f676ca8032ff3a
    vpc_name             shaht-dev
   ```

1. Destroy the stack
   ```bash
   pulumi destroy -y
   ```

1. Remove the stack
   ```bash
   pulumi stack rm dev -y
   ```