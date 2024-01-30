# Azure Managed Cluster AKS Grafana Monitoring for Prometheus Metrics, Loki, Tempo, & Opencost, and Kubecost

Azure native [2](https://www.pulumi.com/registry/packages/azure-native/),[grafana .2](https://www.pulumi.com/registry/packages/grafana/), [kubernetes 4](https://www.pulumi.com/registry/packages/kubernetes/). Creating helm release for grafana prometheus metrics, loki, tempo, and opencost. Avoiding metric server. KubeCost 2

## Requirements

## Metrics
   Installed the prometheus metrics via helm chart Sign up for a user account at: grafanalabs.com

## Kubcost
 - Disabled node-exporter and kube-state-metrics (recommended) since they are installed due to the prometheus helm chart.

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
   pulumi config set azure-native:location  eastus2 # any valid azure region
   pulumi config set myipaddress 1.2.3.4/32 # optional passing in YOUR IP address if you want access to the managed nodes
   pulumi config set --secret GRAFANA_AUTH  blahblahblah  # required if you want grafana monitoring
   pulumi config set --secret GRAFANA_PROMETHEUS_USERNAME blahblahblah2222 # required for grafana prometheus monitoring
   pulumi config set --secret GRAFANA_LOKI_USERNAME blahblahblah333 # required for  grafana loki 
   pulumi config set --secret GRAFANA_TEMPO_USERNAME blahblahblah444 # required for  grafana tempo
   pulumi config set --secret KUBECOST_TOKEN blahblahblah555 # required for  kubecost
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
    Previewing update (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-vpc-eks2-spot-nodegroup/dev/previews/e5589f2a-3305-4d30-ac32-75a65371b8b5

        Type                                          Name                                                                          Plan       Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-vpc-eks2-spot-nodegroup-dev                                    create     2 messages
    +   ├─ aws:iam:Policy                             AmazonEKSAdminPolicy                                                          create     
    +   ├─ aws:iam:Policy                             AWSLoadBalancerControllerIAMPolicy                                            create     
    +   ├─ aws:iam:Policy                             AmazonEKSViewNodesAndWorkloadsPolicy                                          create     
    +   ├─ aws:iam:Policy                             EKSClusterAutoscalePolicy                                                     create     
    +   ├─ aws:iam:Role                               demo-role-role-0-iamrole                                                      create     
    +   ├─ aws:iam:InstanceProfile                    demo-instance-profile-instanceProfile-0                                       create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-1                                                 create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_AmazonEKSViewNodesAndWorkloadsPolicy-5  create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-3                                                 create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policyAWSLoadBalancerControllerIAMPolicy-8     create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-2                                                 create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_eksclusterautoscalePolicy-7             create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_AmazonEKSAdminPolicy-6                  create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-0                                                 create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-4                                                 create     
    +   ├─ awsx:ec2:Vpc                               demo-vpc                                                                      create     
    +   │  ├─ aws:ec2:Vpc                             demo-vpc                                                                      create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-3                                                             create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-3                                                             create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                                                             create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-3                                                             create     
    +   │  │  ├─ aws:ec2:InternetGateway              demo-vpc                                                                      create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-1                                                            create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-1                                                            create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                                                            create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-1                                                            create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-3                                                            create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-3                                                            create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                                                            create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-3                                                            create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-2                                                             create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-2                                                             create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                                                             create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-2                                                             create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-1                                                             create     
    +   │  │  │  ├─ aws:ec2:Eip                       demo-vpc-1                                                                    create     
    +   │  │  │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                                                             create     
    +   │  │  │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                                                             create     
    +   │  │  │  │  └─ aws:ec2:Route                  demo-vpc-public-1                                                             create     
    +   │  │  │  └─ aws:ec2:NatGateway                demo-vpc-1                                                                    create     
    +   │  │  └─ aws:ec2:Subnet                       demo-vpc-private-2                                                            create     
    +   │  │     └─ aws:ec2:RouteTable                demo-vpc-private-2                                                            create     
    +   │  │        ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                                                            create     
    +   │  │        └─ aws:ec2:Route                  demo-vpc-private-2                                                            create     
    +   │  └─ aws:ec2:SecurityGroup                   demo-eksclustersg                                                             create     
    +   ├─ eks:index:Cluster                          demo-eks                                                                      create     
    +   │  ├─ eks:index:ServiceRole                   demo-eks-eksRole                                                              create     
    +   │  │  ├─ aws:iam:Role                         demo-eks-eksRole-role                                                         create     
    +   │  │  └─ aws:iam:RolePolicyAttachment         demo-eks-eksRole-4b490823                                                     create     
    +   │  ├─ aws:eks:Cluster                         demo-eks-eksCluster                                                           create     
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-provider                                                             create     
    +   │  ├─ aws:ec2:SecurityGroup                   demo-eks-nodeSecurityGroup                                                    create     
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-eks-k8s                                                              create     
    +   │  ├─ aws:iam:OpenIdConnectProvider           demo-eks-oidcProvider                                                         create     
    +   │  ├─ kubernetes:core/v1:ConfigMap            demo-eks-nodeAccess                                                           create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeIngressRule                                                   create     
    +   │  ├─ eks:index:VpcCni                        demo-eks-vpc-cni                                                              create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksClusterIngressRule                                                create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeInternetEgressRule                                            create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksExtApiServerClusterIngressRule                                    create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeClusterIngressRule                                            create     
    +   │  └─ eks:index:ManagedNodeGroup              demo-manangednodegroup                                                        create     
    +   │     └─ aws:eks:NodeGroup                    demo-manangednodegroup                                                        create     
    +   ├─ aws:iam:Role                               demo-eks-vpc-cni-role                                                         create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-eks-vpc-cni-role-policy                                                  create     
    +   ├─ pulumi:providers:kubernetes                demo-k8sprovider                                                              create     
    +   ├─ aws:eks:Addon                              demo-amazon-vpc-cni-addon                                                     create     
    +   ├─ kubernetes:core/v1:Namespace               demo-metric-ns                                                                create     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-k8smonitoringhelmr                                                       create     
    +   │     └─ kubernetes:helm.sh/v3:Release        demo-cluster-autoscalerhelmr                                                  create     
    +   ├─ kubernetes:core/v1:Namespace               demo-kubecost-ns                                                              create     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-kubecosthelmr                                                            create     
    +   └─ kubernetes:helm.sh/v3:Release              demo-awsebscsidriver                                                          create     

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-vpc-eks2-spot-nodegroup-dev):
        (node:99216) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

    Outputs:
        cluster_name                     : "demo-eks-eksCluster-5ee9a84"
        helm_chart_aws_ebs_csi_driver    : output<string>
        helm_chart_cluster_autoscaler_hpa: output<string>
        helm_chart_kubecost              : output<string>
        helm_chart_prometheus_metrics    : output<string>
        kubeconfig                       : output<string>
        managed_node_group_name          : output<string>
        managed_node_group_version       : output<string>
        namespace_kubecost               : output<string>
        namespace_metrics                : output<string>
        private_subnet_ids               : output<string>
        public_subnet_ids                : output<string>
        vpcCniAddonName                  : "vpc-cni"
        vpcRoleCniName                   : "demo-eks-vpc-cni-role-fb7ca7a"
        vpcRolePolicyName                : output<string>
        vpc_id                           : output<string>

    Resources:
        + 74 to create

    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-vpc-eks2-spot-nodegroup/dev/updates/229

        Type                                          Name                                                                          Status              Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-vpc-eks2-spot-nodegroup-dev                                    created (869s)      7 messages
    +   ├─ aws:iam:Policy                             AmazonEKSAdminPolicy                                                          created (0.48s)     
    +   ├─ aws:iam:Policy                             EKSClusterAutoscalePolicy                                                     created (0.52s)     
    +   ├─ aws:iam:Policy                             AmazonEKSViewNodesAndWorkloadsPolicy                                          created (0.61s)     
    +   ├─ aws:iam:Role                               demo-role-role-0-iamrole                                                      created (0.37s)     
    +   ├─ aws:iam:Policy                             AWSLoadBalancerControllerIAMPolicy                                            created (0.51s)     
    +   ├─ awsx:ec2:Vpc                               demo-vpc                                                                      created (1s)        
    +   │  ├─ aws:ec2:Vpc                             demo-vpc                                                                      created (3s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-1                                                             created (11s)       
    +   │  │  │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                                                             created (0.90s)     
    +   │  │  │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                                                             created (0.99s)     
    +   │  │  │  │  └─ aws:ec2:Route                  demo-vpc-public-1                                                             created (1s)        
    +   │  │  │  ├─ aws:ec2:Eip                       demo-vpc-1                                                                    created (1s)        
    +   │  │  │  └─ aws:ec2:NatGateway                demo-vpc-1                                                                    created (85s)       
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-3                                                            created (1s)        
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-3                                                            created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                                                            created (0.63s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-3                                                            created (1s)        
    +   │  │  ├─ aws:ec2:InternetGateway              demo-vpc                                                                      created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-2                                                            created (1s)        
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-2                                                            created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                                                            created (0.79s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-2                                                            created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-2                                                             created (12s)       
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-2                                                             created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                                                             created (0.55s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-2                                                             created (0.99s)     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-1                                                            created (2s)        
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-1                                                            created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                                                            created (0.65s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-1                                                            created (1s)        
    +   │  │  └─ aws:ec2:Subnet                       demo-vpc-public-3                                                             created (13s)       
    +   │  │     └─ aws:ec2:RouteTable                demo-vpc-public-3                                                             created (1s)        
    +   │  │        ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                                                             created (0.71s)     
    +   │  │        └─ aws:ec2:Route                  demo-vpc-public-3                                                             created (1s)        
    +   │  └─ aws:ec2:SecurityGroup                   demo-eksclustersg                                                             created (2s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_AmazonEKSAdminPolicy-6                  created (0.30s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-3                                                 created (0.46s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_AmazonEKSViewNodesAndWorkloadsPolicy-5  created (0.62s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_eksclusterautoscalePolicy-7             created (0.85s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-4                                                 created (0.98s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-0                                                 created (1s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-1                                                 created (1s)        
    +   ├─ aws:iam:InstanceProfile                    demo-instance-profile-instanceProfile-0                                       created (1s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-2                                                 created (1s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policyAWSLoadBalancerControllerIAMPolicy-8     created (1s)        
    +   ├─ eks:index:Cluster                          demo-eks                                                                      created (498s)      
    +   │  ├─ eks:index:ServiceRole                   demo-eks-eksRole                                                              created (2s)        
    +   │  │  ├─ aws:iam:Role                         demo-eks-eksRole-role                                                         created (0.49s)     
    +   │  │  └─ aws:iam:RolePolicyAttachment         demo-eks-eksRole-4b490823                                                     created (0.41s)     
    +   │  ├─ aws:eks:Cluster                         demo-eks-eksCluster                                                           created (494s)      
    +   │  ├─ aws:iam:OpenIdConnectProvider           demo-eks-oidcProvider                                                         created (0.56s)     
    +   │  ├─ aws:ec2:SecurityGroup                   demo-eks-nodeSecurityGroup                                                    created (2s)        
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-eks-k8s                                                              created (0.98s)     
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-provider                                                             created (1s)        
    +   │  ├─ kubernetes:core/v1:ConfigMap            demo-eks-nodeAccess                                                           created (0.49s)     
    +   │  ├─ eks:index:VpcCni                        demo-eks-vpc-cni                                                              created (3s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeIngressRule                                                   created (1s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksExtApiServerClusterIngressRule                                    created (1s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeClusterIngressRule                                            created (2s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeInternetEgressRule                                            created (2s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksClusterIngressRule                                                created (2s)        
    +   │  └─ eks:index:ManagedNodeGroup              demo-manangednodegroup                                                        created (0.41s)     
    +   │     └─ aws:eks:NodeGroup                    demo-manangednodegroup                                                        created (117s)      
    +   ├─ aws:iam:Role                               demo-eks-vpc-cni-role                                                         created (0.83s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-eks-vpc-cni-role-policy                                                  created (0.66s)     
    +   ├─ aws:eks:Addon                              demo-amazon-vpc-cni-addon                                                     created (126s)      
    +   ├─ pulumi:providers:kubernetes                demo-k8sprovider                                                              created (0.84s)     
    +   ├─ kubernetes:core/v1:Namespace               demo-kubecost-ns                                                              created (0.51s)     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-kubecosthelmr                                                            created (83s)       
    +   ├─ kubernetes:core/v1:Namespace               demo-metric-ns                                                                created (0.80s)     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-k8smonitoringhelmr                                                       created (55s)       
    +   │     └─ kubernetes:helm.sh/v3:Release        demo-cluster-autoscalerhelmr                                                  created (4s)        
    +   └─ kubernetes:helm.sh/v3:Release              demo-awsebscsidriver                                                          created (28s)       

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-vpc-eks2-spot-nodegroup-dev):
        (node:99238) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

        Warning: resource clusterroles/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource serviceaccounts/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource clusterrolebindings/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource daemonsets/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource customresourcedefinitions/eniconfigs.crd.k8s.amazonaws.com is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.

    Outputs:
        cluster_name                     : "demo-eks-eksCluster-e8b2abc"
        helm_chart_aws_ebs_csi_driver    : "demo-awsebscsidriver-4c71133b"
        helm_chart_cluster_autoscaler_hpa: "demo-cluster-autoscalerhelmr-25adc45b"
        helm_chart_kubecost              : "demo-kubecosthelmr-9f6be401"
        helm_chart_prometheus_metrics    : "demo-k8smonitoringhelmr-c87bd334"
        kubeconfig                       : [secret]
        managed_node_group_name          : "demo-eks-eksCluster-e8b2abc:demo-manangednodegroup-eae0dc6"
        managed_node_group_version       : "1.26"
        namespace_kubecost               : "demo-kubecost-ns-2699e17e"
        namespace_metrics                : "demo-metric-ns-09a11e18"
        private_subnet_ids               : [
            [0]: "subnet-0ad09f7df30e5792b"
            [1]: "subnet-05a9a2c30af30740d"
            [2]: "subnet-0c121573b599d898e"
        ]
        public_subnet_ids                : [
            [0]: "subnet-073a5dc18ac093019"
            [1]: "subnet-0646cf385236d4dc9"
            [2]: "subnet-0a0c95ff81ffb6a90"
        ]
        vpcCniAddonName                  : "vpc-cni"
        vpcRoleCniName                   : "demo-eks-vpc-cni-role-667e8d7"
        vpcRolePolicyName                : "demo-eks-vpc-cni-role-667e8d7-2024013013185479350000000b"
        vpc_id                           : "vpc-074e9be938ac8aa4a"

    Resources:
        + 74 created

    Duration: 14m33s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (16):
    OUTPUT                             VALUE
    cluster_name                       demo-eks-eksCluster-e8b2abc
    helm_chart_aws_ebs_csi_driver      demo-awsebscsidriver-4c71133b
    helm_chart_cluster_autoscaler_hpa  demo-cluster-autoscalerhelmr-25adc45b
    helm_chart_kubecost                demo-kubecosthelmr-9f6be401
    helm_chart_prometheus_metrics      demo-k8smonitoringhelmr-c87bd334
    kubeconfig                         [secret]
    managed_node_group_name            demo-eks-eksCluster-e8b2abc:demo-manangednodegroup-eae0dc6
    managed_node_group_version         1.26
    namespace_kubecost                 demo-kubecost-ns-2699e17e
    namespace_metrics                  demo-metric-ns-09a11e18
    private_subnet_ids                 ["subnet-0ad09f7df30e5792b","subnet-05a9a2c30af30740d","subnet-0c121573b599d898e"]
    public_subnet_ids                  ["subnet-073a5dc18ac093019","subnet-0646cf385236d4dc9","subnet-0a0c95ff81ffb6a90"]
    vpcCniAddonName                    vpc-cni
    vpcRoleCniName                     demo-eks-vpc-cni-role-667e8d7
    vpcRolePolicyName                  demo-eks-vpc-cni-role-667e8d7-2024013013185479350000000b
    vpc_id                             vpc-074e9be938ac8aa4a
   ```

   If you need to see the value in kubeconfig, you will have to do the following
   ```bash
   pulumi stack output --show-secrets kubeconfig
   ```

1. To view Prometheus metrics(Note, this makes it easy to identify the ebs permission issue in volume expansion for kubecost):
      https://REPLACEYOURID.grafana.net/a/grafana-k8s-app/navigation


1. To view kubecost: 
   Load something like:  `kubectl port-forward --namespace kubecost  deployment/cost-analyzer9090 --address 0.0.0.0`

   For Example: 
   ```bash
   kubectl port-forward --namespace demo-kubecost-ns-c8c13276 deployment/demo-kubecosthelmchart-4781769d-cost-analyzer 9090 --address 0.0.0.0
   ```

   To have it run in the background:
   ```bash
   nohup kubectl port-forward --namespace demo-kubecost-ns-c8c13276 deployment/demo-kubecosthelmchart-4781769d-cost-analyzer 9090 --address 0.0.0.0 > /dev/null 2>&1 &
   ```
   Load:  `http://0.0.0.0:9090`

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```