# AWS EKS SPOT Managed Nodes with Helm Chart aws-load-balancer-controller via Release

AWS eks with spot managed nodes in python.  Helm [Release](https://www.pulumi.com/registry/packages/kubernetes/api-docs/helm/v3/) of [aws-load-balancer-controller](https://artifacthub.io/packages/helm/aws/aws-load-balancer-controller)
[More info on Helm Release](https://www.pulumi.com/blog/full-access-to-helm-features-through-new-helm-release-resource-for-kubernetes/)

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

   Setting subnets via [pulumi config set-all](https://www.pulumi.com/docs/reference/cli/pulumi_config_set-all/)

   ```bash
   pulumi config set aws:region us-east-2 # any valid aws region
   pulumi config set vpc_cidr_block 10.0.0.0/23
   pulumi config set number_of_nat_gateways 1 # optional
   pulumi config set-all --path --plaintext public_subnet_cidr[0]="10.0.0.0/25" --plaintext public_subnet_cidr[1]="10.0.0.128/26" --plaintext public_subnet_cidr[2]="10.0.0.192/26"
   pulumi config set-all --path --plaintext private_subnet_cidr[0]="10.0.1.0/26" --plaintext private_subnet_cidr[1]="10.0.1.64/26" --plaintext private_subnet_cidr[2]="10.0.1.128/25"
   ```

1. The main problem is that the ResourceOptions' provider arg doesn't yet accept `Output[ProviderResource]`, which is tracked by [pulumi/pulumi#7012](https://github.com/pulumi/pulumi/issues/7012).

In the meantime, this can be worked around by creating a new instance of the pulumi_kubernetes.Provider using the Cluster's kubeconfig output:



1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
   Updating (dev)

   View Live: https://app.pulumi.com/shaht/aws-classic-py-aws-load-balancer-controller-helm-release/dev/updates/43

      Type                             Name                                                          Status       
   +   pulumi:pulumi:Stack              aws-classic-py-aws-load-balancer-controller-helm-release-dev  creating..   
   +   ├─ aws:ec2:Vpc                          demo-eks-vpc                                                  created      
   +   │  ├─ aws:ec2:InternetGateway           demo-eks-igw                                                  created      
   +   │  ├─ aws:ec2:SecurityGroup             demo-eks-security-group                                       created      
   +   pulumi:pulumi:Stack                     aws-classic-py-aws-load-balancer-controller-helm-release-dev  creating     
   +   pulumi:pulumi:Stack                     aws-classic-py-aws-load-balancer-controller-helm-release-dev  creating.    
   +   │  ├─ aws:ec2:Subnet                    demo-eks-public-subnet-us-east-2b                             created      
   +   │  │  └─ aws:ec2:RouteTableAssociation  demo-eks-public-rt-association-us-east-2b                     created      
   +   pulumi:pulumi:Stack                     aws-classic-py-aws-load-balancer-controller-helm-release-dev  creating...  
   +   │  ├─ aws:ec2:Subnet                    demo-eks-private-subnet-us-east-2b                            created      
   +   │  ├─ aws:ec2:Subnet                    demo-eks-public-subnet-us-east-2c                             created      
   +   pulumi:pulumi:Stack                     aws-classic-py-aws-load-balancer-controller-helm-release-dev  creating     
   +   pulumi:pulumi:Stack                     aws-classic-py-aws-load-balancer-controller-helm-release-dev  creating     
   +   │  ├─ aws:ec2:RouteTable                demo-eks-public-route-table                                   created      
   +   │  ├─ aws:ec2:RouteTable                demo-eks-private-rt-us-east-2a                                creating..   
   +   │  │  └─ aws:ec2:RouteTableAssociation  demo-eks-private-rt-association-us-east-2a                    creating..   
   +   │  ├─ aws:ec2:RouteTable                demo-eks-private-rt-us-east-2b                                created      
   +   │  │  └─ aws:ec2:RouteTableAssociation  demo-eks-private-rt-association-us-east-2b                    creating...  
   +   pulumi:pulumi:Stack                     aws-classic-py-aws-load-balancer-controller-helm-release-dev  creating..   
   +   pulumi:pulumi:Stack                     aws-classic-py-aws-load-balancer-controller-helm-release-dev  creating     
   +   ├─ aws:ec2:Eip                          demo-eks-eip-nat-gateway-us-east-2a                           created      
   +   │  └─ aws:ec2:NatGateway                demo-eks-natgw-us-east-2a                                     created      
   +   ├─ aws:iam:Role                         demo-py-role0                                                 created      
   +   ├─ aws:iam:RolePolicyAttachment         demo-py-role0-policy-0                                        created      
   +   pulumi:pulumi:Stack                     aws-classic-py-aws-load-balancer-controller-helm-release-dev  creating..   
   +   pulumi:pulumi:Stack                     aws-classic-py-aws-load-balancer-controller-helm-release-dev  creating     
   +   └─ eks:index:Cluster                    demo-py-eks                                                   created      
   +      ├─ eks:index:ServiceRole             demo-py-eks-eksRole                                           created      
   +   │  │  ├─ aws:iam:Role                   demo-py-eks-eksRole-role                                      created      
   +   │  │  ├─ aws:iam:RolePolicyAttachment   demo-py-eks-eksRole-90eb1c99                                  created      
   +   pulumi:pulumi:Stack                     aws-classic-py-aws-load-balancer-controller-helm-release-dev  creating..   Warning: apiextensions.k8s.io/v1beta1 CustomResour
   +   │  ├─ aws:ec2:SecurityGroup             demo-py-eks-eksClusterSecurityGroup                           created      
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksClusterInternetEgressRule                      created     
   +   │  ├─ aws:eks:Cluster                   demo-py-eks-eksCluster                                        created     
   +   │  ├─ aws:ec2:SecurityGroup             demo-py-eks-nodeSecurityGroup                                 created     
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksExtApiServerClusterIngressRule                 created     
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksClusterIngressRule                             created     
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksNodeIngressRule                                created     
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksNodeInternetEgressRule                         created     
   +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksNodeClusterIngressRule                         created     
   +   │  ├─ pulumi:providers:kubernetes       demo-py-eks-eks-k8s                                           created     
   +   │  ├─ pulumi:providers:kubernetes       demo-py-eks-provider                                          created     
   +   │  ├─ kubernetes:core/v1:ConfigMap      demo-py-eks-nodeAccess                                        created     
   +   │  └─ eks:index:VpcCni                  demo-py-eks-vpc-cni                                           created     
   +   ├─ kubernetes:core/v1:Namespace         awslbcontroller-ns                                            created     
   +   │  └─ kubernetes:helm.sh/v3:Release     aws-load-balancer-controller                                  created     
   +   └─ eks:index:ManagedNodeGroup           demo-py-managed-nodegroup-spot-ng0                            created     
   +      └─ aws:eks:NodeGroup                 demo-py-managed-nodegroup-spot-ng0                            created     
   
   Diagnostics:
   pulumi:pulumi:Stack (aws-classic-py-aws-load-balancer-controller-helm-release-dev):
      2021/11/30 10:38:17 [DEBUG] Chart dependencies are up to date.
   
      zone: us-east-2a
      public cidr: 10.0.0.0/25
      private cidr: 10.0.1.0/26
      zone: us-east-2b
      public cidr: 10.0.0.128/26
      private cidr: 10.0.1.64/26
      zone: us-east-2c
      public cidr: 10.0.0.192/26
      private cidr: 10.0.1.128/25
   
      Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in v1.16+, unavailable in v1.22+; use apiextensions.k8s.io/v1 CustomResourceDefinition
   
   Outputs:
      cluster_name                   : "demo-py-eks-eksCluster-db5e5d6"
      k8s_chart                      : "aws-load-balancer-controller"
      k8s_chart_app_version          : "v2.3.0"
      k8s_namespace                  : "awslbcontroller-ns-kexxwvud"
      kubeconfig                     : "[secret]"
      managed_nodegroup_capacity_type: "SPOT"
      managed_nodegroup_name         : "demo-py-managed-nodegroup-spot-ng0-5db46b7"
      managed_nodegroup_version      : "1.21"
      vpcname                        : "vpc-00c65bddad6a95ab8"

   Resources:
      + 48 created

   Duration: 12m48s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (8):
    Current stack outputs (9):
    OUTPUT                           VALUE
    cluster_name                     demo-py-eks-eksCluster-db5e5d6
    k8s_chart                        aws-load-balancer-controller
    k8s_chart_app_version            v2.3.0
    k8s_namespace                    awslbcontroller-ns-kexxwvud
    kubeconfig                       [secret]
    managed_nodegroup_capacity_type  SPOT
    managed_nodegroup_name           demo-py-managed-nodegroup-spot-ng0-5db46b7
    managed_nodegroup_version        1.21
    vpcname                          vpc-00c65bddad6a95ab8
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