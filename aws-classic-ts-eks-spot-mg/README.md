
# AWS EKS SPOT Managed Nodes

AWS eks with spot managed nodes in TypeScript

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
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
    Previewing update (dev)

    View Live: https://app.pulumi.com/shaht/aws-ts-eks-spot-mg/dev/previews/3c1ad096-8593-4769-9a16-267b62b42e6c

        Type                              Name                                Plan       
    +   pulumi:pulumi:Stack               aws-ts-eks-spot-mg-dev              create.    
    +   ├─ awsx:x:ec2:Vpc                 demo-vpc                            create     
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-2                  create     
    +   │  ├─ awsx:x:ec2:InternetGateway  demo-vpc                            create     
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-0                  create     
    +   │  ├─ awsx:x:ec2:NatGateway       demo-vpc-0                          create     
    +   │  │  └─ aws:ec2:Eip              demo-vpc-0                          create     
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-1                   create     
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-1                   create     
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-public-1                   create     
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-public-1                   create     
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-public-1                   create     
    +   │  │  └─ aws:ec2:InternetGateway  demo-vpc                            create     
    +   │  │  ├─ aws:ec2:RouteTable       demo-vpc-private-1                  create     
    +   │  │  ├─ aws:ec2:RouteTable       demo-vpc-private-1                  create     
    +   │  │  ├─ aws:ec2:RouteTable       demo-vpc-private-1                  create     
    +   │  │  └─ aws:ec2:Subnet           demo-vpc-private-1                  create     
    +   │  │  └─ aws:ec2:Subnet           demo-vpc-private-1                  create     
    +   │  │  └─ aws:ec2:Subnet           demo-vpc-private-1                  create     
    +   │  │  └─ aws:ec2:Route            demo-vpc-public-1-ig                create     
    +   │  │  ├─ aws:ec2:RouteTable       demo-vpc-public-0                   create     
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-0                   create     
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-0                   create     
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-0                   create     
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-0                   create     
    +   │  │  ├─ aws:ec2:Route                  demo-vpc-public-0-ig                create     
    +   │  │  ├─ aws:ec2:Route                  demo-vpc-public-0-ig                create     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                  create     
    +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-public-2                   create     
    +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-public-2                   create     
    +   │  │  └─ aws:ec2:NatGateway             demo-vpc-0                          create     
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-2                   create     
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-2                   create     
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-2                   create     
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-public-2                   create     
    +   │  │  ├─ aws:ec2:Route                  demo-vpc-public-2-ig                create     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                      create     
    +   │  └─ aws:ec2:Vpc                       demo-vpc                               create     
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy     create     
    +   ├─ aws:iam:Policy                       EKSClusterAutoscalePolicy              create     
    +   pulumi:pulumi:Stack                     aws-ts-eks-spot-mg-dev                 create..   
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-3                   create     
    +   pulumi:pulumi:Stack                     aws-ts-eks-spot-mg-dev                 create     
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-1                   create     
    +   ├─ aws:iam:InstanceProfile              demo-instanceProfile-0                 create     
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-2                   create     
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-4                   create     
    +   ├─ eks:index:Cluster                    demo-eks                               create     
    +   │  ├─ eks:index:ServiceRole             demo-eks-eksRole                       create     
    +   │  │  ├─ aws:iam:Role                   demo-eks-eksRole-role                  create     
    +   │  │  ├─ aws:iam:RolePolicyAttachment   demo-eks-eksRole-4b490823                   create     
    +   pulumi:pulumi:Stack                     aws-ts-eks-spot-mg-dev                      create     
    +   │  ├─ aws:ec2:SecurityGroup             demo-eks-eksClusterSecurityGroup            create     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterInternetEgressRule       create     
    +   │  ├─ aws:eks:Cluster                   demo-eks-eksCluster                         create     
    +   │  ├─ pulumi:providers:kubernetes       demo-eks-eks-k8s                            create     
    +   │  ├─ pulumi:providers:kubernetes       demo-eks-provider                           create     
    +   │  ├─ kubernetes:core/v1:ConfigMap      demo-eks-nodeAccess                         create     
    +   │  ├─ aws:ec2:SecurityGroup             demo-eks-nodeSecurityGroup                  create     
    +   │  ├─ eks:index:VpcCni                  demo-eks-vpc-cni                            create     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeIngressRule                 create     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeInternetEgressRule          create     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeClusterIngressRule          create     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterIngressRule              create     
    +   │  └─ aws:ec2:SecurityGroupRule         demo-eks-eksExtApiServerClusterIngressRule  create     
    +   └─ eks:index:ManagedNodeGroup           demo-manangednodegroup-spot                 create     
    +      └─ aws:eks:NodeGroup                 demo-manangednodegroup-spot                 create     
    
    Resources:
        + 67 to create

    Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-ts-eks-spot-mg/dev/updates/5

        Type                              Name                                Status       
    +   pulumi:pulumi:Stack               aws-ts-eks-spot-mg-dev              creating...  
    +   ├─ awsx:x:ec2:Vpc                 demo-vpc                            created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-1                   created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-2                  created      
    +   │  ├─ awsx:x:ec2:NatGateway       demo-vpc-0                          created      
    +   │  ├─ awsx:x:ec2:NatGateway       demo-vpc-0                          created      
    +   │  │  └─ aws:ec2:Eip              demo-vpc-0                          created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-0                  created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-0                   created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-0                   created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-0                   created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-0                   created      
    +   │  │  └─ aws:ec2:RouteTable       demo-vpc-public-0                   creating..   
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-2                   created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-2                   created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-2                   created      
    +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-2                   created      
    +   │  │  ├─ aws:ec2:RouteTable       demo-vpc-public-2                   creating..   
    +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-public-2                   created      
    +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-public-2                   created      
    +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-public-2                   created      
    +   │  │  └─ aws:ec2:Subnet                 demo-vpc-public-2                   creating.    
    +   │  │  └─ aws:ec2:Route                  demo-vpc-public-2-ig                creating     
    +   │  │  └─ aws:ec2:Route                  demo-vpc-public-2-ig                creating     
    +   │  │  └─ aws:ec2:Route                  demo-vpc-public-2-ig                created      
    +   │  │  └─ aws:ec2:Route                  demo-vpc-public-2-ig                created      
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                   creating     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-private-0                  creating     
    +   │  │  └─ aws:ec2:InternetGateway        demo-vpc                            created      
    +   │  │  └─ aws:ec2:InternetGateway        demo-vpc                            created      
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-private-0                  creating.    
    +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-private-1                  created      
    +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-private-1                  created      
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-private-0                  creating     
    +   │  └─ aws:ec2:Vpc                       demo-vpc                            created      
    +   ├─ aws:iam:Policy                       EKSClusterAutoscalePolicy              created      
    +   │  │  └─ aws:ec2:NatGateway             demo-vpc-0                             creating..   
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy     created      
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy     created      
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy     created      
    +   pulumi:pulumi:Stack                     aws-ts-eks-spot-mg-dev                 creating     
    +   pulumi:pulumi:Stack                     aws-ts-eks-spot-mg-dev                 creating..   
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-4                        created      
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-2                        created      
    +   ├─ aws:iam:InstanceProfile              demo-instanceProfile-0                      created      
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-3                        created      
    +   pulumi:pulumi:Stack                     aws-ts-eks-spot-mg-dev                      creating     
    +   ├─ eks:index:ManagedNodeGroup           demo-manangednodegroup-spot                 created      
    +   └─ eks:index:Cluster                    demo-eks                                    created      
    +   pulumi:pulumi:Stack                     aws-ts-eks-spot-mg-dev                      creating.    
    +      ├─ eks:index:ServiceRole             demo-eks-eksRole                            created      
    +      │  ├─ aws:iam:Role                   demo-eks-eksRole-role                       created     
    +      │  ├─ aws:iam:RolePolicyAttachment   demo-eks-eksRole-90eb1c99                   created     
    +      │  └─ aws:iam:RolePolicyAttachment   demo-eks-eksRole-4b490823                   created     
    +      ├─ aws:ec2:SecurityGroup             demo-eks-eksClusterSecurityGroup            created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterInternetEgressRule       created     
    +      ├─ aws:eks:Cluster                   demo-eks-eksCluster                         created     
    +      ├─ aws:ec2:SecurityGroup             demo-eks-nodeSecurityGroup                  created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeClusterIngressRule          created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksExtApiServerClusterIngressRule  created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterIngressRule              created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeIngressRule                 created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeInternetEgressRule          created     
    +      ├─ pulumi:providers:kubernetes       demo-eks-eks-k8s                            created     
    +      ├─ pulumi:providers:kubernetes       demo-eks-provider                           created     
    +      ├─ eks:index:VpcCni                  demo-eks-vpc-cni                            created     
    +      └─ kubernetes:core/v1:ConfigMap      demo-eks-nodeAccess                         created     
    
    Diagnostics:
    pulumi:pulumi:Stack (aws-ts-eks-spot-mg-dev):
        Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in v1.16+, unavailable in v1.22+; use apiextensions.k8s.io/v1 CustomResourceDefinition
    
    Outputs:
        cluster_name                  : "demo-eks-eksCluster-819846a"
        cluster_verion                : "1.21"
        kubeconfig                    : "[secret]"
        managed_nodegroup_capacitytype: "SPOT"

    Resources:
        + 67 created

    Duration: 14m10s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (4):
    OUTPUT                          VALUE
    cluster_name                    demo-eks-eksCluster-819846a
    cluster_verion                  1.21
    kubeconfig                      [secret]
    managed_nodegroup_capacitytype  SPOT
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