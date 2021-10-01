# AWS EKS Cluster with Fixed and Spot Node Groups with no managed nodes

AWS eks cluster with no managednode groups and a mix of spot/on-demand node groups in python
A vpc is created as part of the eks cluster.

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
   Do you want to perform this update? yes
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-py-eks-spot-nodegroups/dev/updates/13

        Type                             Name                                Status       
    +   pulumi:pulumi:Stack              aws-py-eks-spot-nodegroups-dev      creating.    
    +   ├─ aws:ec2:Vpc                   demoeks-vpc                         created      
    +   │  ├─ aws:ec2:InternetGateway    demoeks-igw                         creating     
    +   │  ├─ aws:ec2:SecurityGroup      demoeks-security-group              creating     
    +   │  ├─ aws:ec2:InternetGateway    demoeks-igw                         created      
    +   │  ├─ aws:ec2:Subnet             demoeks-public-subnet-us-east-2a    created      
    +   │  ├─ aws:ec2:Subnet                    demoeks-private-subnet-us-east-2a         created      
    +   │  │  └─ aws:ec2:RouteTableAssociation  demoeks-public-rt-association-us-east-2a  creating.    
    +   │  │  └─ aws:ec2:RouteTableAssociation  demoeks-public-rt-association-us-east-2c  creating..   
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev            creating     
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev            creating.    
    +   │  ├─ aws:ec2:Subnet                    demoeks-private-subnet-us-east-2b         created      
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev            creating..   
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev            creating...  
    +   ├─ aws:ec2:Eip                          demoeks-eip-nat-gateway-us-east-2a        created      
    +   │  └─ aws:ec2:NatGateway                demoeks-natgw-us-east-2a                      creating...  
    +   ├─ aws:iam:Role                         demo-my-worker-role1                          created      
    +   ├─ aws:iam:Role                         demo-my-worker-role1                          created      
    +   ├─ aws:iam:Role                         demo-my-worker-role1                          created      
    +   ├─ aws:iam:Role                         demo-my-worker-role1                          created      
    +   ├─ aws:iam:Role                         demo-my-worker-role1                          created      
    +   ├─ aws:iam:Role                         demo-my-worker-role1                          created      
    +   ├─ aws:iam:Role                         demo-my-worker-role1                          created      
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev                creating...  
        Type                                    Name                                          Status       Info
    +   ├─ aws:iam:RolePolicyAttachment         demo-my-worker-role2-policy-1                 created      
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev                creating..   
    +   ├─ aws:iam:InstanceProfile              demo-my-instance-profile2                     created      
    +   ├─ aws:iam:RolePolicyAttachment         demo-my-worker-role1-policy-0                 created      
    +   ├─ aws:iam:RolePolicyAttachment         demo-my-worker-role1-policy-1                 created      
    +   ├─ aws:iam:RolePolicyAttachment         demo-my-worker-role1-policy-2                 created      
    +   ├─ aws:iam:InstanceProfile              demo-my-instance-profile1                     created      
    +   └─ eks:index:Cluster                    demo-my-cluster                                    created      
    +   │  ├─ eks:index:ServiceRole             demo-my-cluster-eksRole                            created      
    +   │  │  ├─ aws:iam:Role                   demo-my-cluster-eksRole-role                       created      
    +   │  │  ├─ aws:iam:RolePolicyAttachment   demo-my-cluster-eksRole-90eb1c99                   created      
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev                     creating..   Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in
    +   │  ├─ aws:ec2:SecurityGroup             demo-my-cluster-eksClusterSecurityGroup             created      
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-my-cluster-eksClusterInternetEgressRule        created      
    +   │  ├─ aws:eks:Cluster                   demo-my-cluster-eksCluster                          created      Cluster is ready
    +   │  ├─ aws:ec2:SecurityGroup             demo-my-cluster-nodeSecurityGroup                   created      
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev                      creating...  Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated i
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev                      creating.    Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated i
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev                      creating.    Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated i
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev                      creating..   Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated i
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-my-cluster-eksNodeClusterIngressRule           created      
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev                      creating     Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated i
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-my-cluster-eksNodeIngressRule                  created      
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-my-cluster-eksClusterIngressRule               created      
    +   │  └─ aws:ec2:SecurityGroupRule         demo-my-cluster-eksExtApiServerClusterIngressRule   created      
    +   ├─ eks:index:NodeGroup                  demo-my-ng-fixed                                    created      
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev                      creating.    Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated i
    +   pulumi:pulumi:Stack                     aws-py-eks-spot-nodegroups-dev                      creating...  Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated i
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-my-ng-fixed-eksClusterIngressRule              created     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-my-ng-fixed-eksExtApiServerClusterIngressRule  created     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-my-ng-fixed-eksNodeIngressRule                 created     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-my-ng-fixed-eksNodeInternetEgressRule          created     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-my-ng-fixed-eksNodeClusterIngressRule          created     
    +   │  ├─ aws:ec2:LaunchConfiguration       demo-my-ng-fixed-nodeLaunchConfiguration            created     
    +   │  └─ aws:cloudformation:Stack          demo-my-ng-fixed-nodes                              created     
    +   └─ eks:index:NodeGroup                  demo-my-ng-spot                                     created     
    +      ├─ eks:index:RandomSuffix            demo-my-ng-spot-cfnStackName                        created     
    +      ├─ aws:ec2:SecurityGroup             demo-my-ng-spot-nodeSecurityGroup                   created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-my-ng-spot-eksClusterIngressRule               created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-my-ng-spot-eksExtApiServerClusterIngressRule   created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-my-ng-spot-eksNodeClusterIngressRule           created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-my-ng-spot-eksNodeIngressRule                  created     
    +      ├─ aws:ec2:SecurityGroupRule         demo-my-ng-spot-eksNodeInternetEgressRule           created     
    +      ├─ aws:ec2:LaunchConfiguration       demo-my-ng-spot-nodeLaunchConfiguration             created     
    +      └─ aws:cloudformation:Stack          demo-my-ng-spot-nodes                               created     
    
    Diagnostics:
    pulumi:pulumi:Stack (aws-py-eks-spot-nodegroups-dev):
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
        cluster_name     : "demo-my-cluster-eksCluster-407d3ff"
        iam_role1        : "demo-my-worker-role1-74174f0"
        iam_role2        : "demo-my-worker-role2-c9f6be4"
        instance_profile1: "demo-my-instance-profile1-c21a55e"
        instance_profile2: "demo-my-instance-profile2-989afd5"
        kubeconfig       : "[secret]"
        fixed_node_group_name: "demo-my-ng-fixed-20848fd4"
        spot_node_group_name : "demo-my-ng-spot-0eeec6ff"

    Resources:
        + 70 created

    Duration: 11m58s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (8):
    OUTPUT                 VALUE
    cluster_name           demo-my-cluster-eksCluster-407d3ff
    fixed_node_group_name  demo-my-ng-fixed-20848fd4
    iam_role1              demo-my-worker-role1-74174f0
    iam_role2              demo-my-worker-role2-c9f6be4
    instance_profile1      demo-my-instance-profile1-c21a55e
    instance_profile2      demo-my-instance-profile2-989afd5
    kubeconfig             [secret]
    spot_node_group_name   demo-my-ng-spot-0eeec6ff
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