
# AWS EKS with Different Aws Profile Passed in

AWS vpc setup with awsx and the aws profile is different than default.  The eks cluster calls providerCredentialOpts to refer to this profile.

## Deployment

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Create a Python virtualenv, activate it, and install dependencies:
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
   pulumi config set aws:profile my-teams-2 # name of your aws profile in .aws/credentials
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
    Previewing update (dev)

    View Live: https://app.pulumi.com/shaht/aws-ts-eks-different-awsprofile/dev/updates/1

     Type                              Name                                 Status       
        +   pulumi:pulumi:Stack               aws-ts-eks-different-awsprofile-dev  creating...  
        +   ├─ awsx:x:ec2:Vpc                 demo-vpc                             creating.    
        +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-0                    creating..   
        +   │  ├─ awsx:x:ec2:InternetGateway  demo-vpc                             creating..   
        +   ├─ awsx:x:ec2:Vpc                 demo-vpc                             created      
        +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-1                   creating...  
        +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-1                    created      
        +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-1                    created      
        +   │  │  └─ aws:ec2:RouteTable       demo-vpc-public-1                    creating     
        +   │  │  └─ aws:ec2:RouteTable       demo-vpc-public-1                    creating     
        +   │  │  └─ aws:ec2:RouteTable       demo-vpc-public-1                    creating     
        +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-2                   created      
        +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-2                   created      
        +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-2                   created      
        +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-2                   created      
        +   │  │  └─ aws:ec2:RouteTable       demo-vpc-private-2                   creating     
        +   │  │  └─ aws:ec2:Subnet           demo-vpc-private-2                   creating     
        +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-2                    created      
        +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-2                    created      
        +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-2                    created      
        +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-public-2                    created      
        +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-public-2                    created      
        +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-public-2                    created      
        +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-public-2                    created      
        +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-2                    creating     
        +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-2                    creating     
        +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-0                    created      
        +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-public-2                    created      
        +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-public-2                    created      
        +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-0                    created      
        +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                    created      
        +   pulumi:pulumi:Stack                     aws-ts-eks-different-awsprofile-dev  creating.    
        +   pulumi:pulumi:Stack                     aws-ts-eks-different-awsprofile-dev  creating..   
        +   │     ├─ aws:ec2:Eip                    demo-vpc-0                           created      
        +   │     └─ aws:ec2:NatGateway             demo-vpc-0                           creating..   
        +   ├─ pulumi:providers:aws                 demo-provider                        created      
        +   └─ eks:index:Cluster                    demo-eks                             creating...  
        +      ├─ eks:index:ServiceRole             demo-eks-instanceRole                creating.    
        +   └─ eks:index:Cluster                    demo-eks                               creating...  
        +      │  ├─ aws:iam:RolePolicyAttachment   demo-eks-instanceRole-03516f97         created      
        +      │  ├─ aws:iam:RolePolicyAttachment   demo-eks-instanceRole-e1b295bd         created      
        +      │  ├─ aws:iam:RolePolicyAttachment   demo-eks-instanceRole-e1b295bd         created      
        +      │  ├─ aws:iam:RolePolicyAttachment   demo-eks-instanceRole-e1b295bd         created      
        +      │  ├─ aws:iam:RolePolicyAttachment   demo-eks-instanceRole-e1b295bd         created      
        +   └─ eks:index:Cluster                    demo-eks                               creating     
            Type                                    Name                                   Status       Info
        +      │  ├─ aws:iam:Role                   demo-eks-eksRole-role                  created      
        +      │  ├─ aws:iam:RolePolicyAttachment   demo-eks-eksRole-4b490823              created      
        +   └─ eks:index:Cluster                    demo-eks                               creating..   
        +      ├─ eks:index:RandomSuffix            demo-eks-cfnStackName                  created      
        +      ├─ aws:ec2:SecurityGroup             demo-eks-eksClusterSecurityGroup            created      
        +      ├─ aws:iam:InstanceProfile           demo-eks-instanceProfile                    created      
        +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterInternetEgressRule       created      
        +      ├─ aws:eks:Cluster                   demo-eks-eksCluster                         created      Cl
        +   └─ eks:index:Cluster                    demo-eks                                    creating.    
        +   └─ eks:index:Cluster                    demo-eks                                    creating...  
        +   └─ eks:index:Cluster                    demo-eks                                    creating..   
        +      ├─ kubernetes:core/v1:ConfigMap      demo-eks-nodeAccess                         created     
        +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterIngressRule              created     
        +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksExtApiServerClusterIngressRule  created     
        +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeClusterIngressRule          created     
        +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeIngressRule                 created     
        +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeInternetEgressRule          created     
        +      ├─ aws:ec2:LaunchConfiguration       demo-eks-nodeLaunchConfiguration            created     
        +      ├─ aws:cloudformation:Stack          demo-eks-nodes                              created     
        +      └─ pulumi:providers:kubernetes       demo-eks-provider                           created     
        
        Diagnostics:
        pulumi:pulumi:Stack (aws-ts-eks-different-awsprofile-dev):
            Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in v1.16+, unavailable in v1.22+; use apiextensions.k8s.io/v1 CustomResourceDefinition
        
        Outputs:
            cluster_id            : "demo-eks-eksCluster-39bd9be"
            cluster_name          : "demo-eks-eksCluster-39bd9be"
            cluster_status        : "ACTIVE"
            cluster_version       : "1.21"
            vpc_enableDnsHostnames: true
            vpc_enableDnsSupport  : true
            vpc_id                : "vpc-0a5decb710b09e4a5"
            vpc_privateSubnetIds  : [
                [0]: "subnet-0eacfe53a1d8b0581"
                [1]: "subnet-07f2c2982fd6e1013"
                [2]: "subnet-02478d7cd2b2eadc1"
            ]
            vpc_publicSubnetIds   : [
                [0]: "subnet-05b05eb327267ba7c"
                [1]: "subnet-0ee99534a84c1bab5"
                [2]: "subnet-0396dfab027b3fa6b"
            ]

        Resources:
            + 66 created

        Duration: 14m44s

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (9):
        OUTPUT                  VALUE
        cluster_id              demo-eks-eksCluster-39bd9be
        cluster_name            demo-eks-eksCluster-39bd9be
        cluster_status          ACTIVE
        cluster_version         1.21
        kubeconfig.             [secret]
        vpc_enableDnsHostnames  true
        vpc_enableDnsSupport    true
        vpc_id                  vpc-0a5decb710b09e4a5
        vpc_privateSubnetIds    ["subnet-0eacfe53a1d8b0581","subnet-07f2c2982fd6e1013","subnet-02478d7cd2b2eadc1"]
        vpc_publicSubnetIds     ["subnet-05b05eb327267ba7c","subnet-0ee99534a84c1bab5","subnet-0396dfab027b3fa6b"]
   ```

   If you need to see the value in kubeconfig, you will have to do the following
   ```bash
   pulumi stack output --show-secrets
   ```

   The **kubeconfig** will show the AWS_PROFILE being set: 
   **"env":[{"name":"AWS_PROFILE","value":"my-teams-2"}]** 

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```