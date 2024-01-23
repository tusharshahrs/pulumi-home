# AWS VPC built with AWSX and EKS with ClusterSecurityGroupTags Issue

AWS VPC built with AWSX and Pulumi EKS package with ClusterSecurityGroupTags.  Updating `ClusterSecurityGroupTags` leads to the following error: 
`expected property name after '.'`  due to a bug in pulumi cli 3.90.0. Fix released in 3.92.0.

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

    pulumi up -y
    Previewing update (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-eks-clustersecuritytags/dev/previews/7987732c-b4de-4b2b-bc0e-51efeb46b758

        Type                                          Name                                         Plan       Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-eks-clustersecuritytags-dev   create     2 messages
    +   ├─ eks:index:Cluster                          shaht-eks                                    create     
    +   │  ├─ eks:index:ServiceRole                   shaht-eks-eksRole                            create     
    +   │  │  ├─ aws:iam:Role                         shaht-eks-eksRole-role                       create     
    +   │  │  └─ aws:iam:RolePolicyAttachment         shaht-eks-eksRole-4b490823                   create     
    +   │  ├─ eks:index:ServiceRole                   shaht-eks-instanceRole                       create     
    +   │  │  ├─ aws:iam:Role                         shaht-eks-instanceRole-role                  create     
    +   │  │  ├─ aws:iam:RolePolicyAttachment         shaht-eks-instanceRole-e1b295bd              create     
    +   │  │  ├─ aws:iam:RolePolicyAttachment         shaht-eks-instanceRole-3eb088f2              create     
    +   │  │  └─ aws:iam:RolePolicyAttachment         shaht-eks-instanceRole-03516f97              create     
    +   │  ├─ aws:ec2:SecurityGroup                   shaht-eks-eksClusterSecurityGroup            create     
    +   │  ├─ aws:ec2:SecurityGroupRule               shaht-eks-eksClusterInternetEgressRule       create     
    +   │  ├─ aws:eks:Cluster                         shaht-eks-eksCluster                         create     
    +   │  ├─ pulumi:providers:kubernetes             shaht-eks-eks-k8s                            create     
    +   │  ├─ aws:ec2:SecurityGroup                   shaht-eks-nodeSecurityGroup                  create     
    +   │  ├─ pulumi:providers:kubernetes             shaht-eks-provider                           create     
    +   │  ├─ kubernetes:core/v1:ConfigMap            shaht-eks-nodeAccess                         create     
    +   │  ├─ aws:ec2:SecurityGroupRule               shaht-eks-eksNodeIngressRule                 create     
    +   │  ├─ aws:ec2:SecurityGroupRule               shaht-eks-eksClusterIngressRule              create     
    +   │  ├─ aws:ec2:SecurityGroupRule               shaht-eks-eksNodeClusterIngressRule          create     
    +   │  ├─ eks:index:VpcCni                        shaht-eks-vpc-cni                            create     
    +   │  ├─ aws:ec2:SecurityGroupRule               shaht-eks-eksNodeInternetEgressRule          create     
    +   │  └─ aws:ec2:SecurityGroupRule               shaht-eks-eksExtApiServerClusterIngressRule  create     
    +   └─ awsx:ec2:Vpc                               shaht-vpc                                    create     
    +      └─ aws:ec2:Vpc                             shaht-vpc                                    create     
    +         ├─ aws:ec2:Subnet                       shaht-vpc-public-2                           create     
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-public-2                           create     
    +         │     ├─ aws:ec2:RouteTableAssociation  shaht-vpc-public-2                           create     
    +         │     └─ aws:ec2:Route                  shaht-vpc-public-2                           create     
    +         ├─ aws:ec2:Subnet                       shaht-vpc-private-2                          create     
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-private-2                          create     
    +         │     ├─ aws:ec2:RouteTableAssociation  shaht-vpc-private-2                          create     
    +         │     └─ aws:ec2:Route                  shaht-vpc-private-2                          create     
    +         ├─ aws:ec2:InternetGateway              shaht-vpc                                    create     
    +         ├─ aws:ec2:Subnet                       shaht-vpc-public-1                           create     
    +         │  ├─ aws:ec2:Eip                       shaht-vpc-1                                  create     
    +         │  ├─ aws:ec2:RouteTable                shaht-vpc-public-1                           create     
    +         │  │  ├─ aws:ec2:RouteTableAssociation  shaht-vpc-public-1                           create     
    +         │  │  └─ aws:ec2:Route                  shaht-vpc-public-1                           create     
    +         │  └─ aws:ec2:NatGateway                shaht-vpc-1                                  create     
    +         ├─ aws:ec2:Subnet                       shaht-vpc-private-1                          create     
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-private-1                          create     
    +         │     ├─ aws:ec2:RouteTableAssociation  shaht-vpc-private-1                          create     
    +         │     └─ aws:ec2:Route                  shaht-vpc-private-1                          create     
    +         ├─ aws:ec2:Subnet                       shaht-vpc-public-3                           create     
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-public-3                           create     
    +         │     ├─ aws:ec2:RouteTableAssociation  shaht-vpc-public-3                           create     
    +         │     └─ aws:ec2:Route                  shaht-vpc-public-3                           create     
    +         └─ aws:ec2:Subnet                       shaht-vpc-private-3                          create     
    +            └─ aws:ec2:RouteTable                shaht-vpc-private-3                          create     
    +               ├─ aws:ec2:RouteTableAssociation  shaht-vpc-private-3                          create     
    +               └─ aws:ec2:Route                  shaht-vpc-private-3                          create     

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-eks-clustersecuritytags-dev):
        (node:20305) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

    Outputs:
        cluster_arn       : output<string>
        cluster_name      : "shaht-eks-eksCluster-7899a30"
        kubeconfig        : output<string>
        private_subnet_ids: output<string>
        public_subnet_ids : output<string>
        vpc_id            : output<string>

    Resources:
        + 52 to create

    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-eks-clustersecuritytags/dev/updates/6

        Type                                          Name                                         Status              Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-eks-clustersecuritytags-dev   created (624s)      2 messages
    +   ├─ eks:index:Cluster                          shaht-eks                                    created (621s)      
    +   │  ├─ eks:index:ServiceRole                   shaht-eks-instanceRole                       created (4s)        
    +   │  │  ├─ aws:iam:Role                         shaht-eks-instanceRole-role                  created (0.56s)     
    +   │  │  ├─ aws:iam:RolePolicyAttachment         shaht-eks-instanceRole-03516f97              created (0.56s)     
    +   │  │  ├─ aws:iam:RolePolicyAttachment         shaht-eks-instanceRole-3eb088f2              created (0.76s)     
    +   │  │  └─ aws:iam:RolePolicyAttachment         shaht-eks-instanceRole-e1b295bd              created (0.90s)     
    +   │  ├─ eks:index:ServiceRole                   shaht-eks-eksRole                            created (4s)        
    +   │  │  ├─ aws:iam:Role                         shaht-eks-eksRole-role                       created (0.58s)     
    +   │  │  └─ aws:iam:RolePolicyAttachment         shaht-eks-eksRole-4b490823                   created (0.89s)     
    +   │  ├─ aws:ec2:SecurityGroup                   shaht-eks-eksClusterSecurityGroup            created (1s)        
    +   │  ├─ aws:eks:Cluster                         shaht-eks-eksCluster                         created (481s)      
    +   │  ├─ aws:ec2:SecurityGroupRule               shaht-eks-eksClusterInternetEgressRule       created (0.83s)     
    +   │  ├─ aws:ec2:SecurityGroup                   shaht-eks-nodeSecurityGroup                  created (1s)        
    +   │  ├─ pulumi:providers:kubernetes             shaht-eks-provider                           created (0.15s)     
    +   │  ├─ pulumi:providers:kubernetes             shaht-eks-eks-k8s                            created (0.28s)     
    +   │  ├─ kubernetes:core/v1:ConfigMap            shaht-eks-nodeAccess                         created (0.43s)     
    +   │  ├─ aws:ec2:SecurityGroupRule               shaht-eks-eksExtApiServerClusterIngressRule  created (0.81s)     
    +   │  ├─ eks:index:VpcCni                        shaht-eks-vpc-cni                            created (2s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               shaht-eks-eksClusterIngressRule              created (1s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               shaht-eks-eksNodeInternetEgressRule          created (1s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               shaht-eks-eksNodeIngressRule                 created (1s)        
    +   │  └─ aws:ec2:SecurityGroupRule               shaht-eks-eksNodeClusterIngressRule          created (2s)        
    +   └─ awsx:ec2:Vpc                               shaht-vpc                                    created (2s)        
    +      └─ aws:ec2:Vpc                             shaht-vpc                                    created (1s)        
    +         ├─ aws:ec2:Subnet                       shaht-vpc-private-3                          created (0.97s)     
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-private-3                          created (0.99s)     
    +         │     ├─ aws:ec2:RouteTableAssociation  shaht-vpc-private-3                          created (0.50s)     
    +         │     └─ aws:ec2:Route                  shaht-vpc-private-3                          created (0.97s)     
    +         ├─ aws:ec2:Subnet                       shaht-vpc-public-1                           created (11s)       
    +         │  ├─ aws:ec2:Eip                       shaht-vpc-1                                  created (0.61s)     
    +         │  ├─ aws:ec2:RouteTable                shaht-vpc-public-1                           created (0.76s)     
    +         │  │  ├─ aws:ec2:RouteTableAssociation  shaht-vpc-public-1                           created (1s)        
    +         │  │  └─ aws:ec2:Route                  shaht-vpc-public-1                           created (1s)        
    +         │  └─ aws:ec2:NatGateway                shaht-vpc-1                                  created (114s)      
    +         ├─ aws:ec2:Subnet                       shaht-vpc-private-2                          created (1s)        
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-private-2                          created (1s)        
    +         │     ├─ aws:ec2:RouteTableAssociation  shaht-vpc-private-2                          created (0.69s)     
    +         │     └─ aws:ec2:Route                  shaht-vpc-private-2                          created (1s)        
    +         ├─ aws:ec2:Subnet                       shaht-vpc-private-1                          created (1s)        
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-private-1                          created (1s)        
    +         │     ├─ aws:ec2:RouteTableAssociation  shaht-vpc-private-1                          created (1s)        
    +         │     └─ aws:ec2:Route                  shaht-vpc-private-1                          created (1s)        
    +         ├─ aws:ec2:Subnet                       shaht-vpc-public-3                           created (11s)       
    +         │  └─ aws:ec2:RouteTable                shaht-vpc-public-3                           created (0.70s)     
    +         │     ├─ aws:ec2:RouteTableAssociation  shaht-vpc-public-3                           created (0.80s)     
    +         │     └─ aws:ec2:Route                  shaht-vpc-public-3                           created (1s)        
    +         ├─ aws:ec2:InternetGateway              shaht-vpc                                    created (1s)        
    +         └─ aws:ec2:Subnet                       shaht-vpc-public-2                           created (12s)       
    +            └─ aws:ec2:RouteTable                shaht-vpc-public-2                           created (1s)        
    +               ├─ aws:ec2:Route                  shaht-vpc-public-2                           created (1s)        
    +               └─ aws:ec2:RouteTableAssociation  shaht-vpc-public-2                           created (1s)        

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-eks-clustersecuritytags-dev):
        (node:20332) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

    Outputs:
        cluster_arn       : "arn:aws:eks:us-east-2:052848974346:cluster/shaht-eks-eksCluster-a2486b4"
        cluster_name      : "shaht-eks-eksCluster-a2486b4"
        kubeconfig        : [secret]
        private_subnet_ids: [
            [0]: "subnet-097e29c5508667f51"
            [1]: "subnet-03b8a4f5b114d31a9"
            [2]: "subnet-0a949c60834ec3f06"
        ]
        public_subnet_ids : [
            [0]: "subnet-011cad5c71eb9cd50"
            [1]: "subnet-0e8abcd7ac26a27b8"
            [2]: "subnet-01a91c80486c47808"
        ]
        vpc_id            : "vpc-01fe4d41c9ef322de"

    Resources:
        + 52 created

    Duration: 10m29s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (6):
    OUTPUT              VALUE
    cluster_arn         arn:aws:eks:us-east-2:052848974346:cluster/shaht-eks-eksCluster-a2486b4
    cluster_name        shaht-eks-eksCluster-a2486b4
    kubeconfig          [secret]
    private_subnet_ids  ["subnet-097e29c5508667f51","subnet-03b8a4f5b114d31a9","subnet-0a949c60834ec3f06"]
    public_subnet_ids   ["subnet-011cad5c71eb9cd50","subnet-0e8abcd7ac26a27b8","subnet-01a91c80486c47808"]
    vpc_id              vpc-01fe4d41c9ef322de
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