# AWS EKS with vpc via AWSX package in TypeScript

AWS vpc built with [awsx package](https://www.pulumi.com/registry/packages/awsx/installation-configuration/) and eks with no security groups, therefore, the [default rules](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html) for egress and ingress will apply.

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Install the dependencies
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

1. Populate the config.  Here are aws [endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html)
      ```bash
   pulumi config set aws:region us-east-2 # any valid aws region
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-classic-ts-eks-vpc-sg-default-rules/dev/updates/7

        Type                              Name                                         Status       
    +   pulumi:pulumi:Stack               aws-classic-ts-eks-vpc-sg-default-rules-dev  creating...  
    +   ├─ awsx:x:ec2:Vpc                 demo-vpc                                     created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-0                           creating...  
    +   │  ├─ awsx:x:ec2:InternetGateway  demo-vpc                                     creating...  
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-0                            creating...  
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-1                           creating...  
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-2                           creating...  
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-0                            created      
    +   │  ├─ awsx:x:ec2:NatGateway            demo-vpc-0                                   creating...  
    +   │  ├─ awsx:x:ec2:NatGateway            demo-vpc-0                                   created      
    +   │  ├─ awsx:x:ec2:Subnet                demo-vpc-public-2                            created      
    +   │  └─ aws:ec2:Vpc                      demo-vpc                                     creating     
    +   └─ eks:index:Cluster                   demo-eks                                     creating...  
    +   └─ eks:index:Cluster                   demo-eks                                     creating...  
    +   └─ eks:index:Cluster                   demo-eks                                     creating...  
    +   └─ eks:index:Cluster                   demo-eks                                     creating...  
    +   └─ eks:index:Cluster                   demo-eks                                     creating...  
    +   └─ eks:index:Cluster                   demo-eks                                     creating...  
    +   └─ eks:index:Cluster                   demo-eks                                     creating...  
    +   └─ eks:index:Cluster                   demo-eks                                     creating...  
    +   └─ eks:index:Cluster                   demo-eks                                     creating...  
    +   └─ eks:index:Cluster                   demo-eks                                     creating...  
    +      ├─ eks:index:ServiceRole            demo-eks-instanceRole                        created      
    +      ├─ eks:index:ServiceRole            demo-eks-instanceRole                        created      
    +      ├─ eks:index:ServiceRole            demo-eks-instanceRole                        created      
    +      ├─ eks:index:ServiceRole            demo-eks-instanceRole                        created      
    +      ├─ eks:index:ServiceRole            demo-eks-instanceRole                        created      
    +      ├─ eks:index:ServiceRole            demo-eks-instanceRole                        created      
    +      ├─ eks:index:ServiceRole             demo-eks-instanceRole                        created      
    +      ├─ eks:index:ServiceRole             demo-eks-instanceRole                        created      
    +      ├─ eks:index:ServiceRole             demo-eks-instanceRole                        created      
    +      ├─ eks:index:ServiceRole             demo-eks-instanceRole                        created      
    +      ├─ eks:index:ServiceRole             demo-eks-instanceRole                        created      
    +   │  │  └─ aws:ec2:Route                  demo-vpc-public-1-ig                         created      
    +      │  ├─ aws:iam:Role                   demo-eks-instanceRole-role                   created      
    +      │  ├─ aws:iam:Role                   demo-eks-instanceRole-role                   created      
    +      │  ├─ aws:iam:Role                   demo-eks-instanceRole-role                   created      
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-0                            created      
    +      │  ├─ aws:iam:RolePolicyAttachment   demo-eks-instanceRole-3eb088f2               created      
    +      │  ├─ aws:iam:RolePolicyAttachment   demo-eks-instanceRole-3eb088f2               created      
    +      │  ├─ aws:iam:RolePolicyAttachment   demo-eks-instanceRole-3eb088f2               created      
    +      │  ├─ aws:iam:RolePolicyAttachment   demo-eks-instanceRole-3eb088f2               created      
    +   └─ eks:index:Cluster                    demo-eks                                     creating...  
        Type                                    Name                                         Status       Info
    +      ├─ eks:index:ServiceRole             demo-eks-eksRole                             created      
    +   └─ eks:index:Cluster                    demo-eks                                     creating..   
    +      │  └─ aws:iam:RolePolicyAttachment   demo-eks-eksRole-4b490823                    created      
    +      ├─ eks:index:RandomSuffix            demo-eks-cfnStackName                        created      
    +      ├─ aws:iam:InstanceProfile           demo-eks-instanceProfile                     created      
    +      ├─ aws:ec2:SecurityGroup             demo-eks-eksClusterSecurityGroup             created      
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterInternetEgressRule        created      
    +   └─ eks:index:Cluster                    demo-eks                                     creating     
    +   └─ eks:index:Cluster                    demo-eks                                     creating.    
    +   └─ eks:index:Cluster                    demo-eks                                     created      
    +      ├─ pulumi:providers:kubernetes       demo-eks-eks-k8s                             created     
    +      ├─ kubernetes:core/v1:ConfigMap      demo-eks-nodeAccess                          created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksExtApiServerClusterIngressRule   created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeClusterIngressRule           created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeInternetEgressRule           created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeIngressRule                  created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterIngressRule               created     
    +      ├─ aws:ec2:LaunchConfiguration       demo-eks-nodeLaunchConfiguration             created     
    +      ├─ aws:cloudformation:Stack          demo-eks-nodes                               created     
    +      └─ pulumi:providers:kubernetes       demo-eks-provider                            created     
    
    Outputs:
        cluster_name                  : "demo-eks-eksCluster-852b01d"
        cluster_security_group_name   : "demo-eks-eksClusterSecurityGroup-6681328"
        vpc_az_zones                  : 3
        vpc_cidr                      : "10.0.0.0/24"
        vpc_id                        : "vpc-05a388163d1983780"
        vpc_number_of_nat_gateways    : 1
        vpc_private_subnet_ids        : [
            [0]: "subnet-02c84318a01da1509"
            [1]: "subnet-09ad075c7af2d3b4f"
            [2]: "subnet-088e5cfb73416a8f9"
        ]
        vpc_public_subnet_ids         : [
            [0]: "subnet-0126d9c48e5a0c740"
            [1]: "subnet-0a446aa71ef4e59a2"
            [2]: "subnet-0edcab41cdd5c9350"
        ]

    Resources:
        + 64 created

    Duration: 10m1s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (10):
        OUTPUT                          VALUE
        cluster_name                    demo-eks-eksCluster-852b01d
        cluster_security_group_egress   []
        cluster_security_group_ingress  []
        cluster_security_group_name     demo-eks-eksClusterSecurityGroup-6681328
        vpc_az_zones                    3
        vpc_cidr                        10.0.0.0/24
        vpc_id                          vpc-05a388163d1983780
        vpc_number_of_nat_gateways      1
        vpc_private_subnet_ids          ["subnet-02c84318a01da1509","subnet-09ad075c7af2d3b4f","subnet-088e5cfb73416a8f9"]
        vpc_public_subnet_ids           ["subnet-0126d9c48e5a0c740","subnet-0a446aa71ef4e59a2","subnet-0edcab41cdd5c9350"]
   ```

   If you need to see the value in kubeconfig, you will have to do the following
   ```bash
   pulumi stack output --show-secrets
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```