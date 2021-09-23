# AWS EKS with Different Aws Profile Passed in

AWS vpc setup with awsx and the aws profile is different than default.  The eks cluster calls providerCredentialOpts to refer to this profile.

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

    View Live: https://app.pulumi.com/shaht/aws-ts-eks-different-awsprofile/dev/updates/39

     Type                         Name                                 Status       
   +   pulumi:pulumi:Stack               aws-ts-eks-different-awsprofile-dev  creating     
   +   ├─ awsx:x:ec2:Vpc                 dev-vpc                              created      
   +   │  ├─ awsx:x:ec2:NatGateway       dev-vpc-1                            creating     
   +   │  ├─ awsx:x:ec2:NatGateway       dev-vpc-0                            creating     
   +   │  ├─ awsx:x:ec2:Subnet           dev-vpc-public-0                     creating.    
   +   │  ├─ awsx:x:ec2:InternetGateway  dev-vpc                              creating.    
   +   │  ├─ awsx:x:ec2:Subnet           dev-vpc-private-1                    creating.    
   +   │  ├─ awsx:x:ec2:Subnet           dev-vpc-private-0                    creating.    
   +   │  ├─ awsx:x:ec2:Subnet           dev-vpc-private-0                    creating..   
   +   │  ├─ awsx:x:ec2:Subnet           dev-vpc-private-0                    creating...  
   +   │  ├─ awsx:x:ec2:Subnet                dev-vpc-public-1                     creating     
   +   │  ├─ awsx:x:ec2:Subnet                dev-vpc-private-0                    created      
   +   │  ├─ awsx:x:ec2:Subnet                dev-vpc-public-1                     created      
   +      ├─ eks:index:ServiceRole            demo-eks-eksRole                     creating     
   +      │  ├─ aws:iam:Role                  demo-eks-eksRole-role                created      
   +      ├─ eks:index:ServiceRole            demo-eks-eksRole                     created      
   +      │  ├─ aws:iam:RolePolicyAttachment  demo-eks-eksRole-4b490823            created      
   +      │  └─ aws:iam:RolePolicyAttachment   demo-eks-eksRole-90eb1c99            created      
   +      ├─ eks:index:ServiceRole             demo-eks-instanceRole                  created      
   +      ├─ eks:index:ServiceRole             demo-eks-instanceRole                  created      
   +   │  │  └─ aws:ec2:RouteTableAssociation  dev-vpc-public-1                       created      
   +      │  ├─ aws:iam:Role                   demo-eks-instanceRole-role             created      
   +   └─ eks:index:Cluster                    demo-eks                               creating...  
      Type                                    Name                                   Status       Info
   +      │  └─ aws:iam:RolePolicyAttachment   demo-eks-instanceRole-03516f97         created      
   +   └─ eks:index:Cluster                    demo-eks                               creating...  
   +      ├─ aws:iam:InstanceProfile           demo-eks-instanceProfile               created      
   +      ├─ aws:ec2:SecurityGroup             demo-eks-eksClusterSecurityGroup            created      
   +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterInternetEgressRule       created      
   +      ├─ aws:eks:Cluster                   demo-eks-eksCluster                         created      Cluster is ready
   +      ├─ aws:ec2:SecurityGroup             demo-eks-nodeSecurityGroup                  created      
   +   └─ eks:index:Cluster                    demo-eks                                    creating.    
   +      ├─ eks:index:VpcCni                  demo-eks-vpc-cni                            created      
   +   └─ eks:index:Cluster                    demo-eks                                    creating..   
   +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeIngressRule                 created     
   +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksExtApiServerClusterIngressRule  created     
   +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterIngressRule              created     
   +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeInternetEgressRule          created     
   +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeClusterIngressRule          created     
   +      ├─ aws:ec2:LaunchConfiguration       demo-eks-nodeLaunchConfiguration            created     
   +      ├─ aws:cloudformation:Stack          demo-eks-nodes                              created     
   +      └─ pulumi:providers:kubernetes       demo-eks-provider                           created     
   
   Diagnostics:
   pulumi:pulumi:Stack (aws-ts-eks-different-awsprofile-dev):
      Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in v1.16+, unavailable in v1.22+; use apiextensions.k8s.io/v1 CustomResourceDefinition
   
   Outputs:
      cluster_id            : "demo-eks-eksCluster-5f14bf5"
      cluster_name          : "demo-eks-eksCluster-5f14bf5"
      cluster_status        : "ACTIVE"
      cluster_version       : "1.21"
      kubeconfig            : "[secret]"
      vpc_enableDnsHostnames: true
      vpc_enableDnsSupport  : true
      vpc_id                : "vpc-0a81d4d717b38e8c4"
      vpc_privateSubnetIds  : [
         [0]: "subnet-031778e6e83428f24"
         [1]: "subnet-0e3d8cef23c0f45ab"
      ]
      vpc_publicSubnetIds   : [
         [0]: "subnet-009e2c216a02be560"
         [1]: "subnet-08b3fcdaac274a647"
      ]

   Resources:
      + 58 created

   Duration: 13m17s

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (10):
    OUTPUT                  VALUE
    cluster_id              demo-eks-eksCluster-5f14bf5
    cluster_name            demo-eks-eksCluster-5f14bf5
    cluster_status          ACTIVE
    cluster_version         1.21
    kubeconfig              [secret]
    vpc_enableDnsHostnames  true
    vpc_enableDnsSupport    true
    vpc_id                  vpc-0a81d4d717b38e8c4
    vpc_privateSubnetIds    ["subnet-031778e6e83428f24","subnet-0e3d8cef23c0f45ab"]
    vpc_publicSubnetIds     ["subnet-009e2c216a02be560","subnet-08b3fcdaac274a647"]
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