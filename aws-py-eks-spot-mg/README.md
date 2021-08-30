
# AWS EKS SPOT Managed Nodes

AWS eks with spot managed nodes in python

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

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
   Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-py-eks-spot-mg/dev/updates/24

        Type                           Name                                Status       
        pulumi:pulumi:Stack                     aws-py-eks-spot-mg-dev                    running      
        pulumi:pulumi:Stack                     aws-py-eks-spot-mg-dev                    running.     
    +   │  ├─ aws:ec2:InternetGateway           demoeks-igw                               created      
    +   │  ├─ aws:ec2:SecurityGroup             demoeks-security-group                    created      
        pulumi:pulumi:Stack                     aws-py-eks-spot-mg-dev                    running...   
    +   │  ├─ aws:ec2:Subnet                    demoeks-private-subnet-us-east-2b         created      
        pulumi:pulumi:Stack                     aws-py-eks-spot-mg-dev                    running      
    +   │  │  └─ aws:ec2:RouteTableAssociation  demoeks-public-rt-association-us-east-2b  created      
        pulumi:pulumi:Stack                     aws-py-eks-spot-mg-dev                    running.     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demoeks-public-rt-association-us-east-2a  created      
        pulumi:pulumi:Stack                     aws-py-eks-spot-mg-dev                    running..    
        pulumi:pulumi:Stack                     aws-py-eks-spot-mg-dev                    running...   
        pulumi:pulumi:Stack                     aws-py-eks-spot-mg-dev                    running      
    +   │  ├─ aws:ec2:RouteTable                demoeks-public-route-table                created      
    +   │  ├─ aws:ec2:RouteTable                demoeks-private-rt-us-east-2a             creating..   
    +   │  │  └─ aws:ec2:RouteTableAssociation  demoeks-private-rt-association-us-east-2a  creating     
    +   │  ├─ aws:ec2:RouteTable                demoeks-private-rt-us-east-2b              created      
    +   │  │  └─ aws:ec2:RouteTableAssociation  demoeks-private-rt-association-us-east-2b  creating     
        pulumi:pulumi:Stack                     aws-py-eks-spot-mg-dev                     running..    
        pulumi:pulumi:Stack                     aws-py-eks-spot-mg-dev                     running      
    +   ├─ aws:ec2:Eip                          demoeks-eip-nat-gateway-us-east-2a             created      
    +   │  └─ aws:ec2:NatGateway                demoeks-natgw-us-east-2a                       created      
    +   └─ eks:index:Cluster                    demo-py-eks                                    creating.    
    +      ├─ eks:index:ServiceRole             demo-py-eks-eksRole                            created      
    +   └─ eks:index:Cluster                    demo-py-eks                                    creating.    
    +      │  ├─ aws:iam:RolePolicyAttachment   demo-py-eks-eksRole-90eb1c99                   created      
    +      │  └─ aws:iam:RolePolicyAttachment   demo-py-eks-eksRole-4b490823                   created      
        pulumi:pulumi:Stack                     aws-py-eks-spot-mg-dev                         running...   
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksClusterInternetEgressRule       created      
    +   │  ├─ aws:eks:Cluster                   demo-py-eks-eksCluster                         created      Cluster is ready
    +   │  ├─ aws:eks:Cluster                   demo-py-eks-eksCluster                         created     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksNodeIngressRule                 created     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksExtApiServerClusterIngressRule  created     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksNodeInternetEgressRule          created     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksClusterIngressRule              created     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-py-eks-eksNodeClusterIngressRule          created     
    +   │  ├─ pulumi:providers:kubernetes       demo-py-eks-provider                           created     
    +   │  ├─ pulumi:providers:kubernetes       demo-py-eks-eks-k8s                            created     
    +   │  ├─ kubernetes:core/v1:ConfigMap      demo-py-eks-nodeAccess                         created     
    +   │  └─ eks:index:VpcCni                  demo-py-eks-vpc-cni                            created     
    +   └─ eks:index:ManagedNodeGroup           demo-py-managed-nodegroup-spot-ng0             created     
    +      └─ aws:eks:NodeGroup                 demo-py-managed-nodegroup-spot-ng0             created     
    
    Diagnostics:
    pulumi:pulumi:Stack (aws-py-eks-spot-mg-dev):
        Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in v1.16+, unavailable in v1.22+; use apiextensions.k8s.io/v1 CustomResourceDefinition
    
        zone: us-east-2a
        public cidr: 10.0.0.0/25
        private cidr: 10.0.1.0/26
        zone: us-east-2b
        public cidr: 10.0.0.128/26
        private cidr: 10.0.1.64/26
        zone: us-east-2c
        public cidr: 10.0.0.192/26
        private cidr: 10.0.1.128/25
    
    Outputs:
    + cluster_name                   : "demo-py-eks-eksCluster-0c4735a"
    + managed_nodegroup_capacity_type: "SPOT"
    + managed_nodegroup_name         : "demo-py-managed-nodegroup-spot-ng0-01748de"
    + managed_nodegroup_version      : "1.21"
    + kubeconfig                     : [secret]


    Resources:
        + 41 created
        5 unchanged

    Duration: 13m38s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (4):
    OUTPUT                           VALUE
    cluster_name                     demo-py-eks-eksCluster-0c4735a
    kubeconfig                       [secret]
    managed_nodegroup_capacity_type  SPOT
    managed_nodegroup_name           demo-py-managed-nodegroup-spot-ng0-01748de
    managed_nodegroup_version        1.21
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