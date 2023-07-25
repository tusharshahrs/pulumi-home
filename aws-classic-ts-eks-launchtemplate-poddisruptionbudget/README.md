# AWS EKS with Launch Templates, Poddisruptionbudgets, NO AMI, NO PULUMI-EKS

AWS EKS with Launch Templates, Poddisruptionbudgets. DO NOT pass in an AMI.  We do not use pulumi-eks, we use aws.eks.  VPC is built with awsx.

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

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-eks-launchtemplate-poddisruptionbudget/dev/previews/cd5183e0-aa6c-46d7-b84b-5e84b387a057

        Type                                          Name                                                       Plan       
    +   pulumi:pulumi:Stack                           aws-classic-ts-eks-launchtemplate-poddisruptionbudget-dev  create     
    +   ├─ aws:iam:Role                               mydemo-nodeRole                                            create     
    +   ├─ aws:iam:Role                               mydemo-eksRole                                             create     
    +   ├─ aws:iam:RolePolicyAttachment               example-AmazonEKSWorkerNodePolicy                          create     
    +   ├─ aws:iam:RolePolicyAttachment               example-AmazonEC2ContainerRegistryReadOnly                 create     
    +   ├─ aws:iam:RolePolicyAttachment               example-AmazonEKSCNIPolicy                                 create     
    +   ├─ aws:iam:RolePolicyAttachment               example-AmazonEKSVPCResourceController                     create     
    +   ├─ aws:iam:RolePolicyAttachment               mydemo-eksPolicyAttachment                                 create     
    +   ├─ awsx:ec2:Vpc                               mydemo-vpc                                                 create     
    +   │  └─ aws:ec2:Vpc                             mydemo-vpc                                                 create     
    +   │     ├─ aws:ec2:Subnet                       mydemo-vpc-private-3                                       create     
    +   │     │  └─ aws:ec2:RouteTable                mydemo-vpc-private-3                                       create     
    +   │     │     ├─ aws:ec2:RouteTableAssociation  mydemo-vpc-private-3                                       create     
    +   │     │     └─ aws:ec2:Route                  mydemo-vpc-private-3                                       create     
    +   │     ├─ aws:ec2:InternetGateway              mydemo-vpc                                                 create     
    +   │     ├─ aws:ec2:Subnet                       mydemo-vpc-public-1                                        create     
    +   │     │  ├─ aws:ec2:RouteTable                mydemo-vpc-public-1                                        create     
    +   │     │  │  ├─ aws:ec2:Route                  mydemo-vpc-public-1                                        create     
    +   │     │  │  └─ aws:ec2:RouteTableAssociation  mydemo-vpc-public-1                                        create     
    +   │     │  ├─ aws:ec2:Eip                       mydemo-vpc-1                                               create     
    +   │     │  └─ aws:ec2:NatGateway                mydemo-vpc-1                                               create     
    +   │     ├─ aws:ec2:Subnet                       mydemo-vpc-private-1                                       create     
    +   │     │  └─ aws:ec2:RouteTable                mydemo-vpc-private-1                                       create     
    +   │     │     ├─ aws:ec2:RouteTableAssociation  mydemo-vpc-private-1                                       create     
    +   │     │     └─ aws:ec2:Route                  mydemo-vpc-private-1                                       create     
    +   │     ├─ aws:ec2:Subnet                       mydemo-vpc-public-2                                        create     
    +   │     │  └─ aws:ec2:RouteTable                mydemo-vpc-public-2                                        create     
    +   │     │     ├─ aws:ec2:RouteTableAssociation  mydemo-vpc-public-2                                        create     
    +   │     │     └─ aws:ec2:Route                  mydemo-vpc-public-2                                        create     
    +   │     ├─ aws:ec2:Subnet                       mydemo-vpc-private-2                                       create     
    +   │     │  └─ aws:ec2:RouteTable                mydemo-vpc-private-2                                       create     
    +   │     │     ├─ aws:ec2:RouteTableAssociation  mydemo-vpc-private-2                                       create     
    +   │     │     └─ aws:ec2:Route                  mydemo-vpc-private-2                                       create     
    +   │     └─ aws:ec2:Subnet                       mydemo-vpc-public-3                                        create     
    +   │        └─ aws:ec2:RouteTable                mydemo-vpc-public-3                                        create     
    +   │           ├─ aws:ec2:RouteTableAssociation  mydemo-vpc-public-3                                        create     
    +   │           └─ aws:ec2:Route                  mydemo-vpc-public-3                                        create     
    +   ├─ aws:ec2:SecurityGroup                      mydemo-eks-cluster-sg                                      create     
    +   ├─ aws:ec2:LaunchTemplate                     mydemo-launchtemplate                                      create     
    +   ├─ aws:eks:Cluster                            mydemo-eks                                                 create     
    +   ├─ pulumi:providers:kubernetes                mydemo-k8sprovider                                         create     
    +   ├─ aws:eks:NodeGroup                          mydemo-eksNodeGroup                                        create     
    +   ├─ kubernetes:core/v1:Namespace               mydemo-namespace                                           create     
    +   └─ kubernetes:policy/v1:PodDisruptionBudget   mydemo-pdb                                                 create     


    Outputs:
        kubeconfig                 : output<string>
        mylaunchTemplate_id        : output<string>
        mylaunchTemplate_version   : output<string>
        mynamespace_name           : output<string>
        myvpc_id                   : output<string>
        myvpc_private_subnets      : output<string>
        myvpc_public_subnets       : output<string>
        pdb_name                   : output<string>
        securitygroup_eksnode_id   : output<string>
        securitygroup_eksnode_name : "mydemo-eks-cluster-sg-eac9fec"
        securitygroup_eksnode_tags : {
            Name: "mydemo-eks-cluster-sg"
        }
        securitygroup_eksnode_vpcid: output<string>

    Resources:
        + 44 to create

    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-eks-launchtemplate-poddisruptionbudget/dev/updates/37

        Type                                          Name                                                       Status              
    +   pulumi:pulumi:Stack                           aws-classic-ts-eks-launchtemplate-poddisruptionbudget-dev  created (697s)      
    +   ├─ awsx:ec2:Vpc                               mydemo-vpc                                                 created (3s)        
    +   │  └─ aws:ec2:Vpc                             mydemo-vpc                                                 created (11s)       
    +   │     ├─ aws:ec2:Subnet                       mydemo-vpc-public-1                                        created (11s)       
    +   │     │  ├─ aws:ec2:Eip                       mydemo-vpc-1                                               created (0.75s)     
    +   │     │  ├─ aws:ec2:RouteTable                mydemo-vpc-public-1                                        created (0.97s)     
    +   │     │  │  ├─ aws:ec2:RouteTableAssociation  mydemo-vpc-public-1                                        created (0.75s)     
    +   │     │  │  └─ aws:ec2:Route                  mydemo-vpc-public-1                                        created (1s)        
    +   │     │  └─ aws:ec2:NatGateway                mydemo-vpc-1                                               created (104s)      
    +   │     ├─ aws:ec2:Subnet                       mydemo-vpc-private-3                                       created (1s)        
    +   │     │  └─ aws:ec2:RouteTable                mydemo-vpc-private-3                                       created (0.74s)     
    +   │     │     ├─ aws:ec2:RouteTableAssociation  mydemo-vpc-private-3                                       created (0.47s)     
    +   │     │     └─ aws:ec2:Route                  mydemo-vpc-private-3                                       created (0.86s)     
    +   │     ├─ aws:ec2:Subnet                       mydemo-vpc-public-2                                        created (11s)       
    +   │     │  └─ aws:ec2:RouteTable                mydemo-vpc-public-2                                        created (0.97s)     
    +   │     │     ├─ aws:ec2:RouteTableAssociation  mydemo-vpc-public-2                                        created (0.93s)     
    +   │     │     └─ aws:ec2:Route                  mydemo-vpc-public-2                                        created (1s)        
    +   │     ├─ aws:ec2:InternetGateway              mydemo-vpc                                                 created (1s)        
    +   │     ├─ aws:ec2:Subnet                       mydemo-vpc-private-2                                       created (1s)        
    +   │     │  └─ aws:ec2:RouteTable                mydemo-vpc-private-2                                       created (0.79s)     
    +   │     │     ├─ aws:ec2:RouteTableAssociation  mydemo-vpc-private-2                                       created (0.52s)     
    +   │     │     └─ aws:ec2:Route                  mydemo-vpc-private-2                                       created (1s)        
    +   │     ├─ aws:ec2:Subnet                       mydemo-vpc-public-3                                        created (11s)       
    +   │     │  └─ aws:ec2:RouteTable                mydemo-vpc-public-3                                        created (0.81s)     
    +   │     │     ├─ aws:ec2:RouteTableAssociation  mydemo-vpc-public-3                                        created (1s)        
    +   │     │     └─ aws:ec2:Route                  mydemo-vpc-public-3                                        created (1s)        
    +   │     └─ aws:ec2:Subnet                       mydemo-vpc-private-1                                       created (1s)        
    +   │        └─ aws:ec2:RouteTable                mydemo-vpc-private-1                                       created (0.78s)     
    +   │           ├─ aws:ec2:RouteTableAssociation  mydemo-vpc-private-1                                       created (0.77s)     
    +   │           └─ aws:ec2:Route                  mydemo-vpc-private-1                                       created (1s)        
    +   ├─ aws:iam:Role                               mydemo-nodeRole                                            created (0.75s)     
    +   ├─ aws:iam:Role                               mydemo-eksRole                                             created (0.78s)     
    +   ├─ aws:iam:RolePolicyAttachment               example-AmazonEKSWorkerNodePolicy                          created (0.46s)     
    +   ├─ aws:iam:RolePolicyAttachment               example-AmazonEC2ContainerRegistryReadOnly                 created (0.64s)     
    +   ├─ aws:iam:RolePolicyAttachment               example-AmazonEKSCNIPolicy                                 created (0.78s)     
    +   ├─ aws:iam:RolePolicyAttachment               example-AmazonEKSVPCResourceController                     created (0.78s)     
    +   ├─ aws:iam:RolePolicyAttachment               mydemo-eksPolicyAttachment                                 created (0.98s)     
    +   ├─ aws:ec2:SecurityGroup                      mydemo-eks-cluster-sg                                      created (2s)        
    +   ├─ aws:ec2:LaunchTemplate                     mydemo-launchtemplate                                      created (0.48s)     
    +   ├─ aws:eks:Cluster                            mydemo-eks                                                 created (551s)      
    +   ├─ aws:eks:NodeGroup                          mydemo-eksNodeGroup                                        created (87s)       
    +   ├─ pulumi:providers:kubernetes                mydemo-k8sprovider                                         created (0.34s)     
    +   ├─ kubernetes:core/v1:Namespace               mydemo-namespace                                           created (0.40s)     
    +   └─ kubernetes:policy/v1:PodDisruptionBudget   mydemo-pdb                                                 created (0.42s)     


    Outputs:
        kubeconfig                 : [secret]
        mylaunchTemplate_id        : "lt-075b435416b002519"
        mylaunchTemplate_version   : 1
        mynamespace_name           : "mydemo-namespace-e8caec1e"
        myvpc_id                   : "vpc-069fbae2744f8a01c"
        myvpc_private_subnets      : [
            [0]: "subnet-0ea9d0a1aabafba51"
            [1]: "subnet-08c56d65e36341360"
            [2]: "subnet-0db7449c629300e0d"
        ]
        myvpc_public_subnets       : [
            [0]: "subnet-0eba3d99f12d41a25"
            [1]: "subnet-0d9a113e3b7162d87"
            [2]: "subnet-0d9a5fff69cdf1539"
        ]
        pdb_name                   : "mydemo-pdb-60cab9b2"
        securitygroup_eksnode_id   : "sg-0399be12b463618ad"
        securitygroup_eksnode_name : "mydemo-eks-cluster-sg-a6d06e1"
        securitygroup_eksnode_tags : {
            Name: "mydemo-eks-cluster-sg"
        }
        securitygroup_eksnode_vpcid: "vpc-069fbae2744f8a01c"

    Resources:
        + 44 created

    Duration: 13m2s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (12):
    OUTPUT                       VALUE
    kubeconfig                   [secret]
    mylaunchTemplate_id          lt-075b435416b002519
    mylaunchTemplate_version     1
    mynamespace_name             mydemo-namespace-e8caec1e
    myvpc_id                     vpc-069fbae2744f8a01c
    myvpc_private_subnets        ["subnet-0ea9d0a1aabafba51","subnet-08c56d65e36341360","subnet-0db7449c629300e0d"]
    myvpc_public_subnets         ["subnet-0eba3d99f12d41a25","subnet-0d9a113e3b7162d87","subnet-0d9a5fff69cdf1539"]
    pdb_name                     mydemo-pdb-60cab9b2
    securitygroup_eksnode_id     sg-0399be12b463618ad
    securitygroup_eksnode_name   mydemo-eks-cluster-sg-a6d06e1
    securitygroup_eksnode_tags   {"Name":"mydemo-eks-cluster-sg"}
    securitygroup_eksnode_vpcid  vpc-069fbae2744f8a01c
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