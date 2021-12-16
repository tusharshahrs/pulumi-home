# AWS EKS No Managed NodesGroups, Spot Nodegroups, Awsx Vpc, and Nginx Deployments

AWS EKS No Managed NodesGroups, Spot Nodegroups, Awsx Vpc, and Nginx Deploymentss

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Install the dependencies:
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
   pulumi config set vpc_name vpc-fargate-dev
   pulumi config set vpc_cidr 10.0.0.0/24
   pulumi config set zone_number 3 # number of availability zones, recommend to keep 3
   pulumi config set number_of_nat_gateways 1 # number of nat gateways. 1 to N(where N is zone_number). recommended to keep at least 2 for high availability.  This is expensive so for dev testing, set to 1.
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

    View Live: https://app.pulumi.com/shaht/aws-classic-ts-eks-awsx-spot/dev/updates/42

        Type                    Name                                Status       
    +   pulumi:pulumi:Stack          aws-classic-ts-eks-awsx-spot-dev    creating...  
    +   ├─ eks:index:NodeGroup       demo-nodegroup-spot-1a              created      
    +   ├─ awsx:x:ec2:Vpc                 demoflag                            created      
    +   │  ├─ awsx:x:ec2:NatGateway       demoflag-0                          creating     
    +   │  ├─ awsx:x:ec2:Subnet           demoflag-private-2                  creating     
    +   │  ├─ awsx:x:ec2:InternetGateway  demoflag                            creating     
    +   │  ├─ awsx:x:ec2:Subnet           demoflag-private-0                  creating     
    +   │  ├─ awsx:x:ec2:Subnet           demoflag-public-2                   creating     
    +   │  ├─ awsx:x:ec2:Subnet           demoflag-private-1                  creating     
    +   │  ├─ awsx:x:ec2:Subnet           demoflag-private-1                   creating..   
    +   │  ├─ awsx:x:ec2:Subnet           demoflag-public-0                    creating..   
    +   │  ├─ awsx:x:ec2:Subnet           demoflag-public-1                    creating..   
    +   │  └─ aws:ec2:Vpc                 demoflag                             creating     
    +   ├─ eks:index:Cluster              demo-ekscluster                      creating...  
    +   │  └─ eks:index:ServiceRole       demo-ekscluster-eksRole              creating..   
    +   ├─ aws:iam:Policy                 EKSClusterAutoscalePolicy            created      
    +   ├─ aws:iam:Policy                 AWSLoadBalancerControllerIAMPolicy   created      
    +   ├─ aws:iam:Policy                 AWSLoadBalancerControllerIAMPolicy   created      
    +   ├─ aws:iam:Policy                 AWSLoadBalancerControllerIAMPolicy   created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy   created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy   created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy   created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy   created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                      AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy       created      
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy            created      
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy            created      
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy            created      
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy            created      
    +   │  ├─ eks:index:ServiceRole             demo-ekscluster-eksRole                       created      
    +   │  │  ├─ aws:iam:Role                   demo-ekscluster-eksRole-role                  created      
        Type                                    Name                                          Status       Info
    +   │  │  └─ aws:iam:RolePolicyAttachment   demo-ekscluster-eksRole-90eb1c99              created      
    +   │  └─ aws:ec2:SecurityGroup             demo-nodegroup-spot-1a-nodeSecurityGroup      creating.    
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-ekscluster-eksClusterInternetEgressRule  created      
    +   │  └─ aws:ec2:SecurityGroup             demo-nodegroup-spot-1a-nodeSecurityGroup      created      
    +   pulumi:pulumi:Stack                     aws-classic-ts-eks-awsx-spot-dev              creating     
    +   │  ├─ eks:index:VpcCni                  demo-ekscluster-vpc-cni                       creating...  
    +   │  ├─ eks:index:VpcCni                  demo-ekscluster-vpc-cni                           creating...  
    +   │  ├─ eks:index:VpcCni                  demo-ekscluster-vpc-cni                           creating...  
    +   │  ├─ eks:index:VpcCni                  demo-ekscluster-vpc-cni                                   creating...  
    +   │  ├─ eks:index:VpcCni                  demo-ekscluster-vpc-cni                                   creating...  
    +   │  ├─ eks:index:VpcCni                  demo-ekscluster-vpc-cni                                   creating...  
    +   │  ├─ pulumi:providers:kubernetes       demo-ekscluster-provider                                  created      
    +   │  ├─ pulumi:providers:kubernetes       demo-ekscluster-eks-k8s                                   created      
    +   │  ├─ kubernetes:core/v1:ConfigMap      demo-ekscluster-nodeAccess                                creating.    
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-ekscluster-eksClusterIngressRule                     creating..   
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-ekscluster-eksNodeClusterIngressRule                 creating..   
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-ekscluster-eksNodeClusterIngressRule                 created      
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-ekscluster-eksNodeInternetEgressRule                 creating     
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-ekscluster-eksNodeInternetEgressRule                 creating.    
    +   │  ├─ aws:ec2:SecurityGroupRule         demo-ekscluster-eksNodeInternetEgressRule                 created      
    +   │  └─ aws:ec2:SecurityGroupRule         demo-ekscluster-eksExtApiServerClusterIngressRule         created     
    +   ├─ aws:iam:Policy                       EKSClusterAutoscalePolicy                                 created     
    +   ├─ aws:iam:Policy                       AWSLoadBalancerControllerIAMPolicy                        created     
    +   ├─ aws:iam:Role                         demo-role-0-iamrole                                       created     
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-0                                      created     
    +   ├─ aws:iam:InstanceProfile              demo-instanceProfile-0                                    created     
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-1                                      created     
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-2                                      created     
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-4                                      created     
    +   ├─ aws:iam:RolePolicyAttachment         demo-role-0-policy-3                                      created     
    +   ├─ pulumi:providers:kubernetes          eks-provider                                              created     
    +   ├─ kubernetes:core/v1:Namespace         light-ns                                                  created     
    +   ├─ kubernetes:core/v1:Namespace         starry-ns                                                 created     
    +   ├─ kubernetes:apps/v1:Deployment        starry-falgship                                           created     
    +   └─ kubernetes:apps/v1:Deployment        light-falgship                                            created     
    
    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-eks-awsx-spot-dev):
        Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in v1.16+, unavailable in v1.22+; use apiextensions.k8s.io/v1 CustomResourceDefinition
    
    Outputs:
        cluster_name                      : "demo-ekscluster-eksCluster-b7f081a"
        kubeconfig                        : "[secret]"
        pulumi_vpc_aws_tags               : {
            Name                   : "demoflag"
            availability_zones_used: "3"
            cidr_block             : "10.0.0.0/16"
            cost_center            : "1234"
            crosswalk              : "yes"
            demo                   : "true"
            number_of_nat_gateways : "1"
            pulumi:Project         : "aws-classic-ts-eks-awsx-spot"
            pulumi:Stack           : "dev"
        }
        pulumi_vpc_az_zones               : 3
        pulumi_vpc_cidr                   : "10.0.0.0/16"
        pulumi_vpc_id                     : "vpc-05106f8175e2cfb61"
        pulumi_vpc_name                   : "demoflag"
        pulumi_vpc_private_subnet_ids     : [
            [0]: "subnet-0a5ee1649a65c8eb4"
            [1]: "subnet-04e08806b808c23a2"
            [2]: "subnet-0fe724127af7ca12a"
        ]
        pulumi_vpc_public_subnet_ids      : [
            [0]: "subnet-02ca49bb25d7b156b"
            [1]: "subnet-00dc1064644281dfd"
            [2]: "subnet-0db0436aa73100fd3"
        ]
        pulumic_vpc_number_of_nat_gateways: 1

    Resources:
        + 80 created

    Duration: 16m16s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (10):
    OUTPUT                              VALUE
    cluster_name                        demo-ekscluster-eksCluster-b7f081a
    kubeconfig                          [secret]
    pulumi_vpc_aws_tags                 {"Name":"demoflag","availability_zones_used":"3","cidr_block":"10.0.0.0/16","cost_center":"1234","crosswalk":"yes","demo":"true","number_of_nat_gateways":"1","pulumi:Project":"aws-classic-ts-eks-awsx-spot","pulumi:Stack":"dev"}
    pulumi_vpc_az_zones                 3
    pulumi_vpc_cidr                     10.0.0.0/16
    pulumi_vpc_id                       vpc-05106f8175e2cfb61
    pulumi_vpc_name                     demoflag
    pulumi_vpc_private_subnet_ids       ["subnet-0a5ee1649a65c8eb4","subnet-04e08806b808c23a2","subnet-0fe724127af7ca12a"]
    pulumi_vpc_public_subnet_ids        ["subnet-02ca49bb25d7b156b","subnet-00dc1064644281dfd","subnet-0db0436aa73100fd3"]
    pulumic_vpc_number_of_nat_gateways  
   ```

   If you need to see the value in kubeconfig, you will have to do the following
   ```bash
   pulumi stack output --show-secrets kubeconfig
   ```

1. View the deployment

   ```bash
   pulumi stack output --show-secrets kubeconfig >kubeconfig
   export KUBECONFIG=`pwd`/kubeconfig
   kubectl get ns
   ```

   Results
   ```bash
    NAME                 STATUS   AGE
    default              Active   10m
    kube-node-lease      Active   10m
    kube-public          Active   10m
    kube-system          Active   10m
    light-ns-uu4bvhez    Active   4m43s
    starry-ns-c9jlj1vx   Active   4m43s
    ```

1. View the replica set for light-flagship
   ```bash
   kubectl -n light-ns-uu4bvhez get rs
   ```
   Result
   ```bash
    NAME                                 DESIRED   CURRENT   READY   AGE
    light-falgship-yua86nlj-5b48c4c5c8   3         3         3       5m44s
   ```

1. View the replica set for starry-flaghship
   ```bash
   kubectl -n starry-ns-c9jlj1vx get rs
   ```
   Result
   ```bash
    NAME                                  DESIRED   CURRENT   READY   AGE
    starry-falgship-c19als00-746769f7f5   4         4         4       6m49s
   ```

1. Clean up
   ```bash
   rm kubeconfig
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```