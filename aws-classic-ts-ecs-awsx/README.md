
# AWS VPC, ECS, & Load Balancer

The vpc is read in via [StackReferences](https://www.pulumi.com/docs/intro/concepts/stack/#stackreferences) and built via awsx.  
The ecs cluster is stood up via [awsx](https://www.pulumi.com/docs/reference/pkg/nodejs/pulumi/awsx/ecs/) package.  
The load balancer is built via the [aws](https://www.pulumi.com/docs/reference/pkg/aws/applicationloadbalancing/) package.  There are no targetgroups or listeners created on purpose.
The ecs cluster and the load balancer are exported via stackreference

## Prerequisites

* [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
* [Configure Pulumi to Use AWS](https://www.pulumi.com/docs/intro/cloud-providers/aws/setup/) (if your AWS CLI is configured, no further changes are required)
* **Vpc already created**.  You can create it via [aws-classic-ts-vpc-crosswalk](https://github.com/tusharshahrs/pulumi-home/tree/main/aws-classic-ts-vpc-crosswalk) or any other method

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
    networkingStack  myuser/crosswalk-vpc/myvpc  #
    ```

1. View the current config settings
    ```bash
    pulumi config
    ```

    ```bash
    KEY                     VALUE

    aws:region       us-east-2
    networkingStack  myuser/crosswalk-vpc/myvpc
    ```

1. Special Considerations.  
   - We are using an existing vpc.  This MUST already exist otherwise this stack will FAIL.
   - We are not creating an awsx loadbalancer, we must use aws because we have to pass in the load balancer resource when we create the fargate resources in the next stack.
   - We are not creating a targetgroup or targetlistener via awsx.  
   - Next stack name is:  

1. Create the stack via pulumi up
    ```bash
    pulumi up -y
    ```

    The Result will be
    ```bash
    Do you want to perform this update? yes
    Updating (dev)

    Updating (dev)

    View Live: https://app.pulumi.com/myuser/aws-ts-ecs-awsx/dev/updates/22

        Type                                          Name                 Status      
    +   pulumi:pulumi:Stack                           aws-ts-ecs-awsx-dev  created     
    +   ├─ awsx:x:ecs:Cluster                         demo-ecs             created     
    +   │  ├─ awsx:x:ec2:SecurityGroup                demo-ecs             created     
    +   │  │  ├─ awsx:x:ec2:IngressSecurityGroupRule  demo-ecs-containers  created     
    +   │  │  │  └─ aws:ec2:SecurityGroupRule         demo-ecs-containers  created     
    +   │  │  ├─ awsx:x:ec2:EgressSecurityGroupRule   demo-ecs-egress      created     
    +   │  │  │  └─ aws:ec2:SecurityGroupRule         demo-ecs-egress      created     
    +   │  │  ├─ awsx:x:ec2:IngressSecurityGroupRule  demo-ecs-ssh         created     
    +   │  │  │  └─ aws:ec2:SecurityGroupRule         demo-ecs-ssh         created     
    +   │  │  └─ aws:ec2:SecurityGroup                demo-ecs             created     
    +   │  └─ aws:ecs:Cluster                         demo-ecs             created     
    +   ├─ awsx:x:ec2:Vpc                             demo-getvpc          created     
    +   ├─ aws:ec2:SecurityGroup                      demo-securitygroup   created     
    +   └─ aws:alb:LoadBalancer                       demo-alb             created     
    
    Outputs:
        cluster_id        : "secret"
        cluster_name      : "demo-ecs-cac746f"
        load_balancer_arn : "secret"
        load_balancer_name: "demo-alb-fc410af"
        myvpc             : "secret" 
        securitygroup_id  : "sg-019dc06000745551a"
        securitygroup_name: "demo-securitygroup-348b57b"

    Resources:
        + 14 created

    Duration: 3m14s

1. Check out the stack Outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (7):
    OUTPUT              VALUE
    cluster_id          [secret]
    cluster_name        demo-ecs-a8c72a4
    load_balancer_arn   [secret]
    load_balancer_name  demo-alb-347c1d1
    securitygroup_id    sg-03627b0949fbd9b8a
    securitygroup_name  demo-securitygroup-b5256cf
    vpc_existing        [secret]
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   If you need to see the values that are secrets, do the following
   ```bash
   pulumi stack output --show-secrets
   ```

1. The value to use in a StackReference can be retrieved from the last line.
   ```bash
   pulumi stack
   ```

   Results
   ```bash
   ..
   ..
   More information at: https://app.pulumi.com/myuser/aws-ts-ecs-awsx/dev
   ```
   We want the following from the above
   **myuser/aws-ts-ecs-awsx/dev**
   so that we can use it in **aws-ts-get-ecs**

1. Destroy the stack (Only AFTER you have destroyed the stack that depends on this:  **aws-ts-get-ecs**)
   ```bash
   pulumi destroy -y
   ```

1. Remove the stack
   ```bash
   pulumi stack rm dev -y
   ```