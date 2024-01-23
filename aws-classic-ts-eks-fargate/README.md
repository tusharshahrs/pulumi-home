# AWS VPC EKS Fargate

AWS vpc built with awsx and eks built with pulumi/eks with Fargate in TypeScript

## Issue
  [Creating new EKS clusters using Fargate fails due to missing annotation path](https://github.com/pulumi/pulumi-eks/issues/1007)

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
    Previewing update (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-eks-fargate/dev/previews/82c34bc8-6af1-4cb9-b5e0-f273b7a63272

        Type                                          Name                                           Plan       Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-eks-fargate-dev                 create     2 messages
    +   ├─ aws:kms:Key                                fargatetest-clusterKeyName                     create     
    +   ├─ aws:cloudwatch:LogGroup                    fargatetest-logGroupResource                   create     
    +   ├─ eks:index:Cluster                          fargatetest                                    create     
    +   │  ├─ eks:index:ServiceRole                   fargatetest-podExecutionRole                   create     
    +   │  │  ├─ aws:iam:Role                         fargatetest-podExecutionRole-role              create     
    +   │  │  └─ aws:iam:RolePolicyAttachment         fargatetest-podExecutionRole-6ad441d9          create     
    +   │  ├─ eks:index:ServiceRole                   fargatetest-eksRole                            create     
    +   │  │  ├─ aws:iam:Role                         fargatetest-eksRole-role                       create     
    +   │  │  └─ aws:iam:RolePolicyAttachment         fargatetest-eksRole-4b490823                   create     
    +   │  ├─ eks:index:ServiceRole                   fargatetest-instanceRole                       create     
    +   │  │  ├─ aws:iam:Role                         fargatetest-instanceRole-role                  create     
    +   │  │  ├─ aws:iam:RolePolicyAttachment         fargatetest-instanceRole-3eb088f2              create     
    +   │  │  ├─ aws:iam:RolePolicyAttachment         fargatetest-instanceRole-e1b295bd              create     
    +   │  │  └─ aws:iam:RolePolicyAttachment         fargatetest-instanceRole-03516f97              create     
    +   │  ├─ aws:ec2:SecurityGroup                   fargatetest-eksClusterSecurityGroup            create     
    +   │  ├─ aws:ec2:SecurityGroupRule               fargatetest-eksClusterInternetEgressRule       create     
    +   │  ├─ aws:eks:Cluster                         fargatetest-eksCluster                         create     
    +   │  ├─ pulumi:providers:kubernetes             fargatetest-eks-k8s                            create     
    +   │  ├─ pulumi:providers:kubernetes             fargatetest-provider                           create     
    +   │  ├─ aws:iam:OpenIdConnectProvider           fargatetest-oidcProvider                       create     
    +   │  ├─ aws:ec2:SecurityGroup                   fargatetest-nodeSecurityGroup                  create     
    +   │  ├─ kubernetes:core/v1:ConfigMap            fargatetest-nodeAccess                         create     
    +   │  ├─ aws:ec2:SecurityGroupRule               fargatetest-eksNodeIngressRule                 create     
    +   │  ├─ eks:index:VpcCni                        fargatetest-vpc-cni                            create     
    +   │  ├─ aws:ec2:SecurityGroupRule               fargatetest-eksNodeInternetEgressRule          create     
    +   │  ├─ aws:ec2:SecurityGroupRule               fargatetest-eksExtApiServerClusterIngressRule  create     
    +   │  ├─ aws:ec2:SecurityGroupRule               fargatetest-eksNodeClusterIngressRule          create     
    +   │  ├─ aws:ec2:SecurityGroupRule               fargatetest-eksClusterIngressRule              create     
    +   │  └─ aws:eks:FargateProfile                  fargatetest-fargateProfile                     create     
    +   └─ awsx:ec2:Vpc                               fargatetest-vpc                                create     
    +      └─ aws:ec2:Vpc                             fargatetest-vpc                                create     
    +         ├─ aws:ec2:Subnet                       fargatetest-vpc-private-2                      create     
    +         │  └─ aws:ec2:RouteTable                fargatetest-vpc-private-2                      create     
    +         │     ├─ aws:ec2:RouteTableAssociation  fargatetest-vpc-private-2                      create     
    +         │     └─ aws:ec2:Route                  fargatetest-vpc-private-2                      create     
    +         ├─ aws:ec2:Subnet                       fargatetest-vpc-private-1                      create     
    +         │  └─ aws:ec2:RouteTable                fargatetest-vpc-private-1                      create     
    +         │     ├─ aws:ec2:RouteTableAssociation  fargatetest-vpc-private-1                      create     
    +         │     └─ aws:ec2:Route                  fargatetest-vpc-private-1                      create     
    +         ├─ aws:ec2:Subnet                       fargatetest-vpc-private-3                      create     
    +         │  └─ aws:ec2:RouteTable                fargatetest-vpc-private-3                      create     
    +         │     ├─ aws:ec2:RouteTableAssociation  fargatetest-vpc-private-3                      create     
    +         │     └─ aws:ec2:Route                  fargatetest-vpc-private-3                      create     
    +         ├─ aws:ec2:InternetGateway              fargatetest-vpc                                create     
    +         ├─ aws:ec2:Subnet                       fargatetest-vpc-public-2                       create     
    +         │  └─ aws:ec2:RouteTable                fargatetest-vpc-public-2                       create     
    +         │     ├─ aws:ec2:RouteTableAssociation  fargatetest-vpc-public-2                       create     
    +         │     └─ aws:ec2:Route                  fargatetest-vpc-public-2                       create     
    +         ├─ aws:ec2:Subnet                       fargatetest-vpc-public-3                       create     
    +         │  └─ aws:ec2:RouteTable                fargatetest-vpc-public-3                       create     
    +         │     ├─ aws:ec2:RouteTableAssociation  fargatetest-vpc-public-3                       create     
    +         │     └─ aws:ec2:Route                  fargatetest-vpc-public-3                       create     
    +         └─ aws:ec2:Subnet                       fargatetest-vpc-public-1                       create     
    +            ├─ aws:ec2:Eip                       fargatetest-vpc-1                              create     
    +            ├─ aws:ec2:RouteTable                fargatetest-vpc-public-1                       create     
    +            │  ├─ aws:ec2:RouteTableAssociation  fargatetest-vpc-public-1                       create     
    +            │  └─ aws:ec2:Route                  fargatetest-vpc-public-1                       create     
    +            └─ aws:ec2:NatGateway                fargatetest-vpc-1                              create     

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-eks-fargate-dev):
        (node:4345) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

    Outputs:
        clusterLogGroup_Name: "fargatetest-logGroupResource-59cc5ad"
        cluster_name        : "fargatetest-eksCluster-5e24909"
        key_name            : output<string>
        private_subnet_ids  : output<string>
        public_subnet_ids   : output<string>
        vpc_id              : output<string>

    Resources:
        + 59 to create

    Do you want to perform this update? yes
    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-eks-fargate/dev/updates/8

        Type                                          Name                                           Status                         Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-eks-fargate-dev                 **creating failed (652s)**     1 error; 8 messages
    +   ├─ awsx:ec2:Vpc                               fargatetest-vpc                                created (4s)                   
    +   │  └─ aws:ec2:Vpc                             fargatetest-vpc                                created (1s)                   
    +   │     ├─ aws:ec2:Subnet                       fargatetest-vpc-public-1                       created (11s)                  
    +   │     │  ├─ aws:ec2:RouteTable                fargatetest-vpc-public-1                       created (0.77s)                
    +   │     │  │  ├─ aws:ec2:RouteTableAssociation  fargatetest-vpc-public-1                       created (1s)                   
    +   │     │  │  └─ aws:ec2:Route                  fargatetest-vpc-public-1                       created (1s)                   
    +   │     │  ├─ aws:ec2:Eip                       fargatetest-vpc-1                              created (1s)                   
    +   │     │  └─ aws:ec2:NatGateway                fargatetest-vpc-1                              created (95s)                  
    +   │     ├─ aws:ec2:InternetGateway              fargatetest-vpc                                created (1s)                   
    +   │     ├─ aws:ec2:Subnet                       fargatetest-vpc-private-1                      created (1s)                   
    +   │     │  └─ aws:ec2:RouteTable                fargatetest-vpc-private-1                      created (1s)                   
    +   │     │     ├─ aws:ec2:RouteTableAssociation  fargatetest-vpc-private-1                      created (0.48s)                
    +   │     │     └─ aws:ec2:Route                  fargatetest-vpc-private-1                      created (1s)                   
    +   │     ├─ aws:ec2:Subnet                       fargatetest-vpc-private-2                      created (2s)                   
    +   │     │  └─ aws:ec2:RouteTable                fargatetest-vpc-private-2                      created (2s)                   
    +   │     │     ├─ aws:ec2:RouteTableAssociation  fargatetest-vpc-private-2                      created (0.73s)                
    +   │     │     └─ aws:ec2:Route                  fargatetest-vpc-private-2                      created (1s)                   
    +   │     ├─ aws:ec2:Subnet                       fargatetest-vpc-public-3                       created (12s)                  
    +   │     │  └─ aws:ec2:RouteTable                fargatetest-vpc-public-3                       created (1s)                   
    +   │     │     ├─ aws:ec2:RouteTableAssociation  fargatetest-vpc-public-3                       created (0.96s)                
    +   │     │     └─ aws:ec2:Route                  fargatetest-vpc-public-3                       created (1s)                   
    +   │     ├─ aws:ec2:Subnet                       fargatetest-vpc-public-2                       created (13s)                  
    +   │     │  └─ aws:ec2:RouteTable                fargatetest-vpc-public-2                       created (1s)                   
    +   │     │     ├─ aws:ec2:Route                  fargatetest-vpc-public-2                       created (0.83s)                
    +   │     │     └─ aws:ec2:RouteTableAssociation  fargatetest-vpc-public-2                       created (0.87s)                
    +   │     └─ aws:ec2:Subnet                       fargatetest-vpc-private-3                      created (3s)                   
    +   │        └─ aws:ec2:RouteTable                fargatetest-vpc-private-3                      created (1s)                   
    +   │           ├─ aws:ec2:RouteTableAssociation  fargatetest-vpc-private-3                      created (0.98s)                
    +   │           └─ aws:ec2:Route                  fargatetest-vpc-private-3                      created (1s)                   
    +   ├─ aws:kms:Key                                fargatetest-clusterKeyName                     created (0.56s)                
    +   ├─ aws:cloudwatch:LogGroup                    fargatetest-logGroupResource                   created (0.75s)                
    +   └─ eks:index:Cluster                          fargatetest                                    created (645s)                 
    +      ├─ eks:index:ServiceRole                   fargatetest-podExecutionRole                   created (10s)                  
    +      │  ├─ aws:iam:Role                         fargatetest-podExecutionRole-role              created (1s)                   
    +      │  └─ aws:iam:RolePolicyAttachment         fargatetest-podExecutionRole-6ad441d9          created (3s)                   
    +      ├─ eks:index:ServiceRole                   fargatetest-eksRole                            created (10s)                  
    +      │  ├─ aws:iam:Role                         fargatetest-eksRole-role                       created (1s)                   
    +      │  └─ aws:iam:RolePolicyAttachment         fargatetest-eksRole-4b490823                   created (3s)                   
    +      ├─ eks:index:ServiceRole                   fargatetest-instanceRole                       created (8s)                   
    +      │  ├─ aws:iam:Role                         fargatetest-instanceRole-role                  created (1s)                   
    +      │  ├─ aws:iam:RolePolicyAttachment         fargatetest-instanceRole-03516f97              created (3s)                   
    +      │  ├─ aws:iam:RolePolicyAttachment         fargatetest-instanceRole-e1b295bd              created (3s)                   
    +      │  └─ aws:iam:RolePolicyAttachment         fargatetest-instanceRole-3eb088f2              created (3s)                   
    +      ├─ aws:ec2:SecurityGroup                   fargatetest-eksClusterSecurityGroup            created (1s)                   
    +      ├─ aws:ec2:SecurityGroupRule               fargatetest-eksClusterInternetEgressRule       created (0.83s)                
    +      ├─ aws:eks:Cluster                         fargatetest-eksCluster                         created (525s)                 
    +      ├─ aws:iam:OpenIdConnectProvider           fargatetest-oidcProvider                       created (0.39s)                
    +      ├─ aws:ec2:SecurityGroup                   fargatetest-nodeSecurityGroup                  created (2s)                   
    +      ├─ pulumi:providers:kubernetes             fargatetest-provider                           created (1s)                   
    +      ├─ pulumi:providers:kubernetes             fargatetest-eks-k8s                            created (1s)                   
    +      ├─ kubernetes:core/v1:ConfigMap            fargatetest-nodeAccess                         created (0.43s)                
    +      ├─ eks:index:VpcCni                        fargatetest-vpc-cni                            created (2s)                   
    +      ├─ aws:ec2:SecurityGroupRule               fargatetest-eksNodeIngressRule                 created (1s)                   
    +      ├─ aws:ec2:SecurityGroupRule               fargatetest-eksClusterIngressRule              created (1s)                   
    +      ├─ aws:ec2:SecurityGroupRule               fargatetest-eksNodeInternetEgressRule          created (1s)                   
    +      ├─ aws:ec2:SecurityGroupRule               fargatetest-eksNodeClusterIngressRule          created (2s)                   
    +      ├─ aws:ec2:SecurityGroupRule               fargatetest-eksExtApiServerClusterIngressRule  created (2s)                   
    +      └─ aws:eks:FargateProfile                  fargatetest-fargateProfile                     created (199s)                 

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-eks-fargate-dev):
        (node:4379) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)
        The request is invalid: the server rejected our request due to an error in our request

        Warning: resource clusterroles/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource serviceaccounts/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource clusterrolebindings/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource daemonsets/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource customresourcedefinitions/eniconfigs.crd.k8s.amazonaws.com is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.

        error: Error: Command failed: kubectl patch deployment coredns -n kube-system --type json -p='[{"op":"replace","path":"/spec/template/metadata/annotations/eks.amazonaws.com~1compute-type","value":"fargate"}]'
        The request is invalid: the server rejected our request due to an error in our request
        
            at genericNodeError (node:internal/errors:984:15)
            at wrappedFn (node:internal/errors:538:14)
            at checkExecSyncError (node:child_process:890:11)
            at Object.execSync (node:child_process:962:15)
            at /Users/tusharshah/projects/pulumi-home/aws-classic-ts-eks-fargate/node_modules/@pulumi/cluster.ts:952:42
            at /Users/tusharshah/projects/pulumi-home/aws-classic-ts-eks-fargate/node_modules/@pulumi/output.ts:404:31
            at Generator.next (<anonymous>)
            at /Users/tusharshah/projects/pulumi-home/aws-classic-ts-eks-fargate/node_modules/@pulumi/pulumi/output.js:21:71
            at new Promise (<anonymous>)
            at __awaiter (/Users/tusharshah/projects/pulumi-home/aws-classic-ts-eks-fargate/node_modules/@pulumi/pulumi/output.js:17:12)

    Outputs:
        clusterLogGroup_Name: "fargatetest-logGroupResource-4dcaddf"
        cluster_name        : "fargatetest-eksCluster-22b150e"
        key_name            : "9a7850f8-16e3-45d6-a3b1-def653331f10"
        private_subnet_ids  : [
            [0]: "subnet-0c4ffebdbe43c51ec"
            [1]: "subnet-02e1b27f35d0c71a5"
            [2]: "subnet-037eabfc6d6b34a7e"
        ]
        public_subnet_ids   : [
            [0]: "subnet-07f3963b4318b4bd6"
            [1]: "subnet-0c0cfef92342e675d"
            [2]: "subnet-0ffb0a1df53a100de"
        ]
        vpc_id              : "vpc-06073a5918eccbae6"

    Resources:
        + 59 created

    Duration: 14m22s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (6):
    OUTPUT                VALUE
    clusterLogGroup_Name  fargatetest-logGroupResource-4dcaddf
    cluster_name          fargatetest-eksCluster-22b150e
    key_name              9a7850f8-16e3-45d6-a3b1-def653331f10
    private_subnet_ids    ["subnet-0c4ffebdbe43c51ec","subnet-02e1b27f35d0c71a5","subnet-037eabfc6d6b34a7e"]
    public_subnet_ids     ["subnet-07f3963b4318b4bd6","subnet-0c0cfef92342e675d","subnet-0ffb0a1df53a100de"]
    vpc_id                vpc-06073a5918eccbae6

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