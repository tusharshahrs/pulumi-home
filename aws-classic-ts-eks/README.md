# AWS EKS with Namespace

AWS eks with namespace in TypeScript

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Install dependencies:
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

    View Live: https://app.pulumi.com/shaht/aws-classic-ts-eks/dev/updates/11

     Type                          Name                              Status       
    +   pulumi:pulumi:Stack                    aws-classic-ts-eks-dev            creating...  
    +   └─ eks:index:Cluster                   demo-eks                          creating.    
    +      ├─ eks:index:ServiceRole            demo-eks-instanceRole             creating.    
    +      ├─ eks:index:ServiceRole            demo-eks-instanceRole             creating..   
    +      │  ├─ aws:iam:RolePolicyAttachment  demo-eks-instanceRole-03516f97    created      
    +      ├─ eks:index:ServiceRole            demo-eks-instanceRole             created      
    +      │  └─ aws:iam:RolePolicyAttachment  demo-eks-instanceRole-3eb088f2         created      
    +   └─ eks:index:Cluster                   demo-eks                               creating     
    +   └─ eks:index:Cluster                   demo-eks                               creating.    
    +      │  ├─ aws:iam:RolePolicyAttachment  demo-eks-eksRole-90eb1c99                   created      
    +      │  └─ aws:iam:RolePolicyAttachment  demo-eks-eksRole-4b490823                   created      
    +      ├─ eks:index:RandomSuffix           demo-eks-cfnStackName                       created      
    +      ├─ aws:ec2:SecurityGroup            demo-eks-eksClusterSecurityGroup            created      
    +      ├─ aws:iam:InstanceProfile          demo-eks-instanceProfile                    created      
    +   └─ eks:index:Cluster                   demo-eks                                    creating..   
    +      ├─ aws:eks:Cluster                  demo-eks-eksCluster                         created      Cluster is ready
    +      ├─ aws:ec2:SecurityGroup            demo-eks-nodeSecurityGroup                  created      
    +   └─ eks:index:Cluster                   demo-eks                                    creating.    
    +   pulumi:pulumi:Stack                    aws-classic-ts-eks-dev                      creating.    Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is d
    +   └─ eks:index:Cluster                   demo-eks                                    creating...  
    +   │  ├─ aws:ec2:SecurityGroupRule        demo-eks-eksClusterIngressRule              created      
    +   │  ├─ aws:ec2:SecurityGroupRule        demo-eks-eksNodeClusterIngressRule          created     
    +   │  ├─ aws:ec2:LaunchConfiguration      demo-eks-nodeLaunchConfiguration            created     
    +   │  ├─ pulumi:providers:kubernetes      demo-eks-eks-k8s                            created     
    +   │  ├─ eks:index:VpcCni                 demo-eks-vpc-cni                            created     
    +   │  ├─ kubernetes:core/v1:ConfigMap     demo-eks-nodeAccess                         created     
    +   │  ├─ aws:cloudformation:Stack         demo-eks-nodes                              created     
    +   │  └─ pulumi:providers:kubernetes      demo-eks-provider                           created     
    +   └─ kubernetes:core/v1:Namespace        awslb-controller-ns                         created     
    
    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-eks-dev):
        Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in v1.16+, unavailable in v1.22+; use apiextensions.k8s.io/v1 CustomResourceDefinition
    
    Outputs:
        awslb_namespace_name: "awslb-controller-ns-im5wunlc"
        cluster_name: "demo-eks-eksCluster-35c9075"
        kubeconfig  : "[secret]"
        

    Resources:
        + 29 created

    Duration: 12m38s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (3):
    OUTPUT                VALUE
    awslb_namespace_name  awslb-controller-ns-im5wunlc
    cluster_name          demo-eks-eksCluster-35c9075
    kubeconfig            [secret]
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