
# AWS EKS Cluster with no Managednode Group, Fixed and Spot Nodegroup both with taints

AWS eks stood up in a vpc with no managednodgroup, a fixed nodegroup and a spot nodegroup with taints in typescript

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

    View Live: https://app.pulumi.com/shaht/aws-classic-ts-eks-node-alltaints/dev/updates/1

     Type                              Name                                   Status       
   +   pulumi:pulumi:Stack               aws-classic-ts-eks-node-alltaints-dev  creating     
   +   ├─ awsx:x:ec2:Vpc                 demo-vpc                               created      
   +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-0                      created      
   +   │  │  └─ aws:ec2:RouteTable       demo-vpc-public-0                      creating     
   +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-private-2                     created      
   +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-2                      created      
   +   │  │  └─ aws:ec2:RouteTable       demo-vpc-public-2                      creating     
   +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-1                      created      
   +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-1                      created      
   +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-1                      created      
   +   │  ├─ awsx:x:ec2:Subnet           demo-vpc-public-1                      created      
   +   │  │  ├─ aws:ec2:RouteTable       demo-vpc-public-1                      creating     
   +   │  │  ├─ aws:ec2:RouteTable       demo-vpc-public-1                      creating     
   +   │  │  ├─ aws:ec2:Subnet           demo-vpc-public-1                      creating..   
   +   │  │  ├─ aws:ec2:Subnet           demo-vpc-public-1                      creating..   
   +   │  │  ├─ aws:ec2:Subnet           demo-vpc-public-1                      creating..   
   +   │  │  └─ aws:ec2:Route                  demo-vpc-public-1-ig                   creating.    
   +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-private-1                     created      
   +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-private-1                     created      
   +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-private-1                     created      
   +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-private-1                     created      
   +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-private-1                     created      
   +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-0                      created      
   +   │  │  ├─ aws:ec2:RouteTable             demo-vpc-private-1                     created      
   +   │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                     created      
   +   │  ├─ awsx:x:ec2:NatGateway             demo-vpc-0                             created      
   +   pulumi:pulumi:Stack                     aws-classic-ts-eks-node-alltaints-dev  creating.    
   +   │  │  └─ aws:ec2:NatGateway             demo-vpc-0                             creating...  
   +   │  ├─ awsx:x:ec2:Subnet                 demo-vpc-private-0                     created      
   +   │  │  ├─ aws:ec2:Subnet                 demo-vpc-private-0                     created      
   +   │  │  └─ aws:ec2:NatGateway             demo-vpc-0                             creating     
   +   │  │  └─ aws:ec2:NatGateway             demo-vpc-0                             creating..   
   +   │  ├─ awsx:x:ec2:InternetGateway        demo-vpc                               created      
   +   │  │  └─ aws:ec2:NatGateway             demo-vpc-0                             creating...  
   +   │  └─ aws:ec2:Vpc                       demo-vpc                               created      
   +   │  └─ aws:ec2:Vpc                       demo-vpc                               created      
   +   │  └─ aws:ec2:Vpc                       demo-vpc                               created      
   +   │  └─ aws:ec2:Vpc                       demo-vpc                               created      
   +   ├─ aws:iam:Policy                       EKSClusterAutoscalePolicy               created      
   +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy      created      
   +   ├─ aws:iam:Role                         demo-role-0-iamrole                     created      
   +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-3                                    created      
   +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-4                                    created      
   +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-1                                    created      
   +   ├─ aws:iam:InstanceProfile              demo-instanceProfile-0                                  created      
   +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-2                                    created      
   +   pulumi:pulumi:Stack                     aws-classic-ts-eks-node-alltaints-dev                   creating.    
   +   ├─ eks:index:NodeGroup                  demo-nodegroup-spot                                     created      
   +   │  ├─ eks:index:RandomSuffix            demo-nodegroup-spot-cfnStackName                        created      
   +   │  └─ aws:ec2:SecurityGroup             demo-nodegroup-spot-nodeSecurityGroup                   created      
   +   ├─ eks:index:Cluster                    demo-eks                                                creating...  
   +   ├─ eks:index:Cluster                    demo-eks                                                creating...  
   +   ├─ eks:index:Cluster                    demo-eks                                                creating...  
   +   ├─ eks:index:Cluster                    demo-eks                                                creating...  
   +   ├─ eks:index:Cluster                    demo-eks                                                creating...  
   +   ├─ eks:index:Cluster                    demo-eks                                                creating...  
   +   ├─ eks:index:Cluster                    demo-eks                                                creating.    
   +   │  ├─ eks:index:ServiceRole             demo-eks-eksRole                                        created      
   +   ├─ eks:index:Cluster                    demo-eks                                                creating..   
   +   pulumi:pulumi:Stack                     aws-classic-ts-eks-node-alltaints-dev                   creating.    
   +   │  │  └─ aws:iam:RolePolicyAttachment   demo-eks-eksRole-90eb1c99                               created      
   +   pulumi:pulumi:Stack                     aws-classic-ts-eks-node-alltaints-dev                   creating..   
   +   pulumi:pulumi:Stack                     aws-classic-ts-eks-node-alltaints-dev                   creating..   Warning: apiextensions.k8s.io/v1beta1 CustomResource
   +   │  ├─ aws:eks:Cluster                   demo-eks-eksCluster                                     created      Cluster is ready
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterInternetEgressRule                   created     
   +   │  ├─ aws:ec2:SecurityGroup             demo-eks-nodeSecurityGroup                              created     
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeIngressRule                             created     
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterIngressRule                          created     
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeInternetEgressRule                      created     
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-eks-eksExtApiServerClusterIngressRule              created     
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeClusterIngressRule                      created     
   +   │  ├─ pulumi:providers:kubernetes       demo-eks-provider                                       created     
   +   │  ├─ pulumi:providers:kubernetes       demo-eks-eks-k8s                                        created     
   +   │  ├─ eks:index:VpcCni                  demo-eks-vpc-cni                                        created     
   +   │  └─ kubernetes:core/v1:ConfigMap      demo-eks-nodeAccess                                     created     
   +   └─ eks:index:NodeGroup                  demo-nodegroup-fixed                                    created     
   +      ├─ eks:index:RandomSuffix            demo-nodegroup-fixed-cfnStackName                       created     
   +      ├─ aws:ec2:SecurityGroup             demo-nodegroup-fixed-nodeSecurityGroup                  created     
   +      ├─ aws:ec2:SecurityGroupRule         demo-nodegroup-fixed-eksExtApiServerClusterIngressRule  created     
   +      ├─ aws:ec2:SecurityGroupRule         demo-nodegroup-fixed-eksNodeIngressRule                 created     
   +      ├─ aws:ec2:SecurityGroupRule         demo-nodegroup-fixed-eksClusterIngressRule              created     
   +      ├─ aws:ec2:SecurityGroupRule         demo-nodegroup-fixed-eksNodeInternetEgressRule          created     
   +      ├─ aws:ec2:SecurityGroupRule         demo-nodegroup-fixed-eksNodeClusterIngressRule          created     
   +      ├─ aws:ec2:LaunchConfiguration       demo-nodegroup-fixed-nodeLaunchConfiguration            created     
   +      └─ aws:cloudformation:Stack          demo-nodegroup-fixed-nodes                              created     
   
   Diagnostics:
   pulumi:pulumi:Stack (aws-classic-ts-eks-node-alltaints-dev):
      Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in v1.16+, unavailable in v1.22+; use apiextensions.k8s.io/v1 CustomResourceDefinition
   
   Outputs:
      cluster_name  : "demo-eks-eksCluster-cd053b7"
      cluster_verion: "1.21"
      kubeconfig    : "[secret]"

   Resources:
      + 85 created

   Duration: 11m34s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (3):
    OUTPUT          VALUE
    cluster_name    demo-eks-eksCluster-cd053b7
    cluster_verion  1.21
    kubeconfig      [secret]
   ```

   If you need to see the value in kubeconfig, you will have to do the following
   ```bash
   pulumi stack output --show-secrets
   ```

1. Validating that the **taints** were applied via the cli.
   Create the kubeconfig
   ```bash
   pulumi stack output kubeconfig --show-secrets >kubeconfig
   export KUBECONFIG=`PWD`/kubeconfig
   kubectl version
   ```
      
1. Check for taints via [how to extract the list of nodes that are tainted](https://discuss.kubernetes.io/t/how-to-extract-the-list-of-nodes-which-are-tainted/8335/13)
   ```bash
   kubectl get node -o custom-columns=NAME:.metadata.name,TAINT:.spec.taints[*].effect
   ```

   Expected Results: 3 to say *NoSchedule* and 3 to say **`<none>`**
   ```bash
   NAME                                         TAINT
   ip-10-0-105-15.us-east-2.compute.internal    NoSchedule
   ip-10-0-108-122.us-east-2.compute.internal   NoSchedule
   ip-10-0-141-20.us-east-2.compute.internal    NoSchedule
   ip-10-0-147-154.us-east-2.compute.internal   NoSchedule
   ip-10-0-174-175.us-east-2.compute.internal   NoSchedule
   ip-10-0-184-231.us-east-2.compute.internal   NoSchedule
   ```

1. coredns is not running due to the following issue: [EKS Add-on support (coredns, etc)](https://github.com/pulumi/pulumi-eks/issues/587) issue.  This is what the aws console will show.
   - log in via aws console, check out the eks cluster, select *Workloads* view the *Status* for `coredns`.  This will show that 0 are ready.
      <img src="nodegroup_all_taints_coredns_not_running.png" alt = Add coredns not running with taints on all nodegroups>
   s

1. Work around
   ```bash
      kubectl patch -n kube-system deployment/coredns --patch \
   '{"spec":{"template":{"spec":{"tolerations": [{"operator": "Exists"} ]}}}}'
   ```

1. Clean up kubeconfig
   ```bash
   unset KUBECONFIG
   rm kubeconfig
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```