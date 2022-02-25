# AWS EKS with Namespace

AWS eks cluster with Namespace. Must use provider due to the following: [eks namespace with provider in python not working](https://github.com/pulumi/pulumi-eks/issues/662)

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Create a Python virtualenv, activate it, and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip3 install -r requirements.txt
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

   View Live: https://app.pulumi.com/shaht/aws-classic-py-eks/dev/updates/23

     Type                                   Name                                   Status       
    +   pulumi:pulumi:Stack                    aws-classic-py-eks-dev                 creating..   
        Type                                   Name                                   Status       Info
    +      ├─ eks:index:ServiceRole            demo-eks-eksRole                       created      
    +   └─ eks:index:Cluster                   demo-eks                               creating...  
    +   └─ eks:index:Cluster                   demo-eks                               creating.    
    +      │  └─ aws:iam:RolePolicyAttachment  demo-eks-eksRole-4b490823                   created      
    +      ├─ eks:index:ServiceRole            demo-eks-instanceRole                       created      
    +      │  ├─ aws:iam:Role                  demo-eks-instanceRole-role                  created      
    +      │  ├─ aws:iam:RolePolicyAttachment  demo-eks-instanceRole-3eb088f2              created      
    +   └─ eks:index:Cluster                   demo-eks                                    creating..   
    +   └─ eks:index:Cluster                   demo-eks                                    creating     
    +   └─ eks:index:Cluster                   demo-eks                                    created      
    +   │  ├─ aws:ec2:SecurityGroup            demo-eks-eksClusterSecurityGroup            created      
    +   pulumi:pulumi:Stack                    aws-classic-py-eks-dev                      creating...  Warning: apiextensions.k8s.io/v1beta1 Custom
    +   │  ├─ aws:eks:Cluster                  demo-eks-eksCluster                         created     
    +   │  ├─ aws:iam:InstanceProfile          demo-eks-instanceProfile                    created     
    +   │  ├─ aws:ec2:SecurityGroup            demo-eks-nodeSecurityGroup                  created     
    +   │  ├─ eks:index:VpcCni                 demo-eks-vpc-cni                            created     
    +   │  ├─ pulumi:providers:kubernetes      demo-eks-eks-k8s                            created     
    +   │  ├─ kubernetes:core/v1:ConfigMap     demo-eks-nodeAccess                         created     
    +   │  ├─ aws:ec2:SecurityGroupRule        demo-eks-eksNodeIngressRule                 created     
    +   │  ├─ aws:ec2:SecurityGroupRule        demo-eks-eksExtApiServerClusterIngressRule  created     
    +   │  ├─ aws:ec2:SecurityGroupRule        demo-eks-eksClusterIngressRule              created     
    +   │  ├─ aws:ec2:SecurityGroupRule        demo-eks-eksNodeClusterIngressRule          created     
    +   │  ├─ aws:ec2:SecurityGroupRule        demo-eks-eksNodeInternetEgressRule          created     
    +   │  ├─ aws:ec2:LaunchConfiguration      demo-eks-nodeLaunchConfiguration            created     
    +   │  ├─ aws:cloudformation:Stack         demo-eks-nodes                              created     
    +   │  └─ pulumi:providers:kubernetes      demo-eks-provider                           created     
    +   ├─ pulumi:providers:kubernetes         mycluster_provider                          created     
    +   └─ kubernetes:core/v1:Namespace        awslb-controller-ns                         created     
    
    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-py-eks-dev):
        Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in v1.16+, unavailable in v1.22+; use apiextensions.k8s.io/v1 CustomResourceDefinition
    
    Outputs:
        aws-lb-namespace: "awslb-controller-ns-et3tmegq"
        cluster_name    : "demo-eks-eksCluster-e4ac504"
        kubeconfig      : "[secret]"

    Resources:
        + 30 created

    Duration: 10m59s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (3):
    OUTPUT            VALUE
    aws-lb-namespace  awslb-controller-ns-et3tmegq
    cluster_name      demo-eks-eksCluster-e4ac504
    kubeconfig        [secret]

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