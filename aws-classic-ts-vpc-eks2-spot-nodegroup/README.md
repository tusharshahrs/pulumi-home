# AWS EKS2 SPOT Managed Nodes and Grafana Monitoring for Prometheus Metrics, Loki, Tempo, & Opencost

AWS vpc with [awsx 2](https://www.pulumi.com/registry/packages/awsx/), [eks 2](https://www.pulumi.com/registry/packages/eks/), [grafana](https://www.pulumi.com/registry/packages/grafana/), [kubernetes 4](https://www.pulumi.com/registry/packages/kubernetes/) with spot managed nodes in TypeScript. Creating helm release for grafana prometheus metrics, loki, tempo, and opencost.

## Requirements
 -  Add the following managed policy arn role: `arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy` in `iam.ts`
 -  Must install Amazon EBS CSI driver via [helm release/chart](https://artifacthub.io/packages/helm/deliveryhero/aws-ebs-csi-driver) if running k8s version 1.23+ as per [aws managing ebs csi](https://docs.aws.amazon.com/eks/latest/userguide/managing-ebs-csi.html).  
 - Otherwise, you will encounter the following error: [K8s Pods Failure : error while running "VolumeBinding" prebind plugin for pod "app": Failed to bind volumes: timed out waiting for the condition](https://stackoverflow.com/questions/68725070/k8s-pods-failure-error-while-running-volumebinding-prebind-plugin-for-pod-a)


## Metrics
   - Installed the metrics-server
   - installed via helm chart(release)
   
## Grafana
    - prometheus k8s-monitoring. Sign up for a user account at: grafanalabs.com
    - installed via helm chart(release)
    - Configurations are under -> Infrastructure -> Kubernetes -> Configuration

## Kubcost
 - requires aws ebs csi driver for k8s 1.23+
 - Disabled node-exporter and kube-state-metrics (recommended) since they are installed due to the prometheus helm chart.
 - installed via helm chart(release)
 - This is local, i.e. localhost:9090, not the cloud.  If you want cloud, change the `kubecost_token` to this: https://www.kubecost.com/install#show-instructions

 ## Cluster AutoScaler
 - installed via helm chart(release)
 - requires oidc
 - instructions including labels: https://www.kubecost.com/kubernetes-autoscaling/kubernetes-cluster-autoscaler/
 - https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/CA_with_AWS_IAM_OIDC.md#change-2
 - required for the chart to show up in the pods:
 - -   `namespace: "kube-system", // required otherwise it will not show up in the cluster`
   -   `name: "cluster-autoscaler", // required otherwise it will not show up in the cluster`
   -   `labels: {"k8s-addon":"cluster-autoscaler.addons.k8s.io","k8s-app":"cluster-autoscaler"}, // critical part, need this for it to show up`
   -   `"eks.amazonaws.com/role-arn": clusterautoscaleRole.arn,`


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

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-vpc-eks2-spot-nodegroup/dev/previews/35c2b051-f471-4642-a5d2-7aadf67c6d71

        Type                                          Name                                                                          Plan       Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-vpc-eks2-spot-nodegroup-dev                                    create     2 messages
    +   ├─ aws:iam:Policy                             AmazonEKSViewNodesAndWorkloadsPolicy                                          create     
    +   ├─ aws:iam:Role                               demo-role-role-0-iamrole                                                      create     
    +   ├─ aws:iam:Policy                             AmazonEKSAdminPolicy                                                          create     
    +   ├─ aws:iam:Policy                             AWSLoadBalancerControllerIAMPolicy                                            create     
    +   ├─ aws:iam:Policy                             EKSClusterAutoscalePolicy                                                     create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-2                                                 create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-0                                                 create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-4                                                 create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policyAWSLoadBalancerControllerIAMPolicy-8     create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_AmazonEKSAdminPolicy-6                  create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-3                                                 create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-1                                                 create     
    +   ├─ aws:iam:InstanceProfile                    demo-instance-profile-instanceProfile-0                                       create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_eksclusterautoscalePolicy-7             create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_AmazonEKSViewNodesAndWorkloadsPolicy-5  create     
    +   ├─ awsx:ec2:Vpc                               demo-vpc                                                                      create     
    +   │  ├─ aws:ec2:Vpc                             demo-vpc                                                                      create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-1                                                             create     
    +   │  │  │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                                                             create     
    +   │  │  │  │  ├─ aws:ec2:Route                  demo-vpc-public-1                                                             create     
    +   │  │  │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                                                             create     
    +   │  │  │  ├─ aws:ec2:Eip                       demo-vpc-1                                                                    create     
    +   │  │  │  └─ aws:ec2:NatGateway                demo-vpc-1                                                                    create     
    +   │  │  ├─ aws:ec2:InternetGateway              demo-vpc                                                                      create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-2                                                             create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-2                                                             create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                                                             create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-2                                                             create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-2                                                            create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-2                                                            create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                                                            create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-2                                                            create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-1                                                            create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-1                                                            create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                                                            create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-1                                                            create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-3                                                            create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-3                                                            create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                                                            create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-3                                                            create     
    +   │  │  └─ aws:ec2:Subnet                       demo-vpc-public-3                                                             create     
    +   │  │     └─ aws:ec2:RouteTable                demo-vpc-public-3                                                             create     
    +   │  │        ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                                                             create     
    +   │  │        └─ aws:ec2:Route                  demo-vpc-public-3                                                             create     
    +   │  └─ aws:ec2:SecurityGroup                   demo-eksclustersg                                                             create     
    +   │     └─ eks:index:Cluster                    demo-eks                                                                      create     
    +   │        ├─ eks:index:ServiceRole             demo-eks-eksRole                                                              create     
    +   │        │  ├─ aws:iam:Role                   demo-eks-eksRole-role                                                         create     
    +   │        │  └─ aws:iam:RolePolicyAttachment   demo-eks-eksRole-4b490823                                                     create     
    +   │        ├─ aws:eks:Cluster                   demo-eks-eksCluster                                                           create     
    +   │        ├─ pulumi:providers:kubernetes       demo-eks-provider                                                             create     
    +   │        ├─ aws:iam:OpenIdConnectProvider     demo-eks-oidcProvider                                                         create     
    +   │        ├─ aws:ec2:SecurityGroup             demo-eks-nodeSecurityGroup                                                    create     
    +   │        ├─ pulumi:providers:kubernetes       demo-eks-eks-k8s                                                              create     
    +   │        ├─ aws:ec2:SecurityGroupRule         demo-eks-eksExtApiServerClusterIngressRule                                    create     
    +   │        ├─ eks:index:VpcCni                  demo-eks-vpc-cni                                                              create     
    +   │        ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeIngressRule                                                   create     
    +   │        ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeClusterIngressRule                                            create     
    +   │        ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterIngressRule                                                create     
    +   │        ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeInternetEgressRule                                            create     
    +   │        ├─ kubernetes:core/v1:ConfigMap      demo-eks-nodeAccess                                                           create     
    +   │        └─ eks:index:ManagedNodeGroup        demo-manangednodegroup                                                        create     
    +   │           └─ aws:eks:NodeGroup              demo-manangednodegroup                                                        create     
    +   ├─ pulumi:providers:kubernetes                demo-k8sprovider                                                              create     
    +   ├─ kubernetes:core/v1:Namespace               demo-kubecost-ns                                                              create     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-kubecost-helm                                                            create     
    +   ├─ kubernetes:core/v1:Namespace               demo-metric-ns                                                                create     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-metrics-server-helm                                                      create     
    +   ├─ kubernetes:core/v1:Namespace               demo-monitoring-ns                                                            create     
    +   │  ├─ kubernetes:helm.sh/v3:Release           demo-cluster-autoscaler-helm                                                  create     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-k8smonitoring-helm                                                       create     
    +   └─ kubernetes:helm.sh/v3:Release              demo-awsebscsidriver                                                          create     

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-vpc-eks2-spot-nodegroup-dev):
        (node:97787) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

    Outputs:
        cluster_name                     : "demo-eks-eksCluster-9666a68"
        helm_chart_aws_ebs_csi_driver    : output<string>
        helm_chart_cluster_autoscaler_hpa: output<string>
        helm_chart_grafana_k8s_monitoring: output<string>
        helm_chart_kubecost              : output<string>
        helm_chart_metrics_server        : output<string>
        kubeconfig                       : output<string>
        managed_node_group_name          : output<string>
        managed_node_group_version       : output<string>
        namespace_grafana_k8s_monitoring : output<string>
        namespace_kubecost               : output<string>
        namespace_metrics                : output<string>
        private_subnet_ids               : output<string>
        public_subnet_ids                : output<string>
        vpc_id                           : output<string>

    Resources:
        + 73 to create

    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-vpc-eks2-spot-nodegroup/dev/updates/267

        Type                                          Name                                                                          Status              Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-vpc-eks2-spot-nodegroup-dev                                    created (797s)      9 messages
    +   ├─ aws:iam:Policy                             AmazonEKSViewNodesAndWorkloadsPolicy                                          created (0.52s)     
    +   ├─ aws:iam:Policy                             AWSLoadBalancerControllerIAMPolicy                                            created (0.54s)     
    +   ├─ aws:iam:Policy                             AmazonEKSAdminPolicy                                                          created (0.67s)     
    +   ├─ aws:iam:Policy                             EKSClusterAutoscalePolicy                                                     created (0.84s)     
    +   ├─ aws:iam:Role                               demo-role-role-0-iamrole                                                      created (0.39s)     
    +   ├─ awsx:ec2:Vpc                               demo-vpc                                                                      created (1s)        
    +   │  ├─ aws:ec2:Vpc                             demo-vpc                                                                      created (2s)        
    +   │  │  ├─ aws:ec2:InternetGateway              demo-vpc                                                                      created (0.67s)     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-2                                                             created (11s)       
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-2                                                             created (0.76s)     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                                                             created (1s)        
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-2                                                             created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-1                                                            created (1s)        
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-1                                                            created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                                                            created (1s)        
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-1                                                            created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-1                                                             created (11s)       
    +   │  │  │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                                                             created (1s)        
    +   │  │  │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                                                             created (1s)        
    +   │  │  │  │  └─ aws:ec2:Route                  demo-vpc-public-1                                                             created (1s)        
    +   │  │  │  ├─ aws:ec2:Eip                       demo-vpc-1                                                                    created (1s)        
    +   │  │  │  └─ aws:ec2:NatGateway                demo-vpc-1                                                                    created (105s)      
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-3                                                             created (12s)       
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-3                                                             created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                                                             created (1s)        
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-3                                                             created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-3                                                            created (2s)        
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-3                                                            created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                                                            created (0.76s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-3                                                            created (1s)        
    +   │  │  └─ aws:ec2:Subnet                       demo-vpc-private-2                                                            created (2s)        
    +   │  │     └─ aws:ec2:RouteTable                demo-vpc-private-2                                                            created (1s)        
    +   │  │        ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                                                            created (0.85s)     
    +   │  │        └─ aws:ec2:Route                  demo-vpc-private-2                                                            created (1s)        
    +   │  └─ aws:ec2:SecurityGroup                   demo-eksclustersg                                                             created (2s)        
    +   │     └─ eks:index:Cluster                    demo-eks                                                                      created (416s)      
    +   │        ├─ eks:index:ServiceRole             demo-eks-eksRole                                                              created (1s)        
    +   │        │  ├─ aws:iam:Role                   demo-eks-eksRole-role                                                         created (0.54s)     
    +   │        │  └─ aws:iam:RolePolicyAttachment   demo-eks-eksRole-4b490823                                                     created (0.30s)     
    +   │        ├─ aws:eks:Cluster                   demo-eks-eksCluster                                                           created (412s)      
    +   │        ├─ aws:iam:OpenIdConnectProvider     demo-eks-oidcProvider                                                         created (0.41s)     
    +   │        ├─ aws:ec2:SecurityGroup             demo-eks-nodeSecurityGroup                                                    created (2s)        
    +   │        ├─ pulumi:providers:kubernetes       demo-eks-provider                                                             created (1s)        
    +   │        ├─ pulumi:providers:kubernetes       demo-eks-eks-k8s                                                              created (0.98s)     
    +   │        ├─ eks:index:VpcCni                  demo-eks-vpc-cni                                                              created (2s)        
    +   │        ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeIngressRule                                                   created (0.98s)     
    +   │        ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeClusterIngressRule                                            created (1s)        
    +   │        ├─ aws:ec2:SecurityGroupRule         demo-eks-eksClusterIngressRule                                                created (1s)        
    +   │        ├─ aws:ec2:SecurityGroupRule         demo-eks-eksExtApiServerClusterIngressRule                                    created (1s)        
    +   │        ├─ aws:ec2:SecurityGroupRule         demo-eks-eksNodeInternetEgressRule                                            created (2s)        
    +   │        ├─ kubernetes:core/v1:ConfigMap      demo-eks-nodeAccess                                                           created (0.93s)     
    +   │        └─ eks:index:ManagedNodeGroup        demo-manangednodegroup                                                        created (0.43s)     
    +   │           └─ aws:eks:NodeGroup              demo-manangednodegroup                                                        created (106s)      
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_AmazonEKSViewNodesAndWorkloadsPolicy-5  created (0.30s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policyAWSLoadBalancerControllerIAMPolicy-8     created (0.44s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-1                                                 created (0.61s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-4                                                 created (0.76s)     
    +   ├─ aws:iam:InstanceProfile                    demo-instance-profile-instanceProfile-0                                       created (1s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-2                                                 created (1s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-0                                                 created (1s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_policy-3                                                 created (1s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_AmazonEKSAdminPolicy-6                  created (1s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-rpa_my_custom_policy_eksclusterautoscalePolicy-7             created (1s)        
    +   ├─ pulumi:providers:kubernetes                demo-k8sprovider                                                              created (0.60s)     
    +   ├─ kubernetes:core/v1:Namespace               demo-kubecost-ns                                                              created (0.54s)     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-kubecost-helm                                                            created (62s)       
    +   ├─ kubernetes:core/v1:Namespace               demo-monitoring-ns                                                            created (0.74s)     
    +   │  ├─ kubernetes:helm.sh/v3:Release           demo-cluster-autoscaler-helm                                                  created (3s)        
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-k8smonitoring-helm                                                       created (53s)       
    +   ├─ kubernetes:core/v1:Namespace               demo-metric-ns                                                                created (1s)        
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-metrics-server-helm                                                      created (35s)       
    +   └─ kubernetes:helm.sh/v3:Release              demo-awsebscsidriver                                                          created (19s)       

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-vpc-eks2-spot-nodegroup-dev):
        (node:97812) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

        Warning: resource customresourcedefinitions/eniconfigs.crd.k8s.amazonaws.com is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource customresourcedefinitions/policyendpoints.networking.k8s.aws is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource serviceaccounts/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource configmaps/amazon-vpc-cni is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource clusterroles/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource clusterrolebindings/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource daemonsets/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.

    Outputs:
        cluster_name                     : "demo-eks-eksCluster-9593af5"
        helm_chart_aws_ebs_csi_driver    : "demo-awsebscsidriver-99d5dd3d"
        helm_chart_cluster_autoscaler_hpa: "demo-cluster-autoscaler-helm-976e4b74"
        helm_chart_grafana_k8s_monitoring: "demo-k8smonitoring-helm-e1598104"
        helm_chart_kubecost              : "demo-kubecost-helm-fd5879a2"
        helm_chart_metrics_server        : "demo-metrics-server-helm-9b9e04c6"
        kubeconfig                       : [secret]
        managed_node_group_name          : "demo-eks-eksCluster-9593af5:demo-manangednodegroup-a89e124"
        managed_node_group_version       : "1.26"
        namespace_grafana_k8s_monitoring : "demo-monitoring-ns-e5cdf7f9"
        namespace_kubecost               : "demo-kubecost-ns-76091d81"
        namespace_metrics                : "demo-metric-ns-abcef26a"
        private_subnet_ids               : [
            [0]: "subnet-079c27e3e6163f353"
            [1]: "subnet-074699ea7d5c8b285"
            [2]: "subnet-0d9fb7944cb073344"
        ]
        public_subnet_ids                : [
            [0]: "subnet-0d7b73c29166c7a17"
            [1]: "subnet-0d78cd5feaf42b0e1"
            [2]: "subnet-0619beec245f7f151"
        ]
        vpc_id                           : "vpc-078f2c653ed152a8e"

    Resources:
        + 73 created

    Duration: 13m21s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (15):
    OUTPUT                             VALUE
    cluster_name                       demo-eks-eksCluster-9593af5
    helm_chart_aws_ebs_csi_driver      demo-awsebscsidriver-99d5dd3d
    helm_chart_cluster_autoscaler_hpa  demo-cluster-autoscaler-helm-976e4b74
    helm_chart_grafana_k8s_monitoring  demo-k8smonitoring-helm-e1598104
    helm_chart_kubecost                demo-kubecost-helm-fd5879a2
    helm_chart_metrics_server          demo-metrics-server-helm-9b9e04c6
    kubeconfig                         [secret]
    managed_node_group_name            demo-eks-eksCluster-9593af5:demo-manangednodegroup-a89e124
    managed_node_group_version         1.26
    namespace_grafana_k8s_monitoring   demo-monitoring-ns-e5cdf7f9
    namespace_kubecost                 demo-kubecost-ns-76091d81
    namespace_metrics                  demo-metric-ns-abcef26a
    private_subnet_ids                 ["subnet-079c27e3e6163f353","subnet-074699ea7d5c8b285","subnet-0d9fb7944cb073344"]
    public_subnet_ids                  ["subnet-0d7b73c29166c7a17","subnet-0d78cd5feaf42b0e1","subnet-0619beec245f7f151"]
    vpc_id                             vpc-078f2c653ed152a8e
   ```

   If you need to see the value in kubeconfig, you will have to do the following
   ```bash
   pulumi stack output --show-secrets kubeconfig
   ```

   Export the kubeconfig
   ```bash
   pulumi stack output --show-secrets kubeconfig > kubeconfig
   export KUBECONFIG=$PWD/kubeconfig
   kubectl version
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

1. Cluster Autoscaler validation
    - configmap
        `kubectl -n kube-system get cm cluster-autoscaler-status -o yaml`
    - deploy
        `kubectl -n kube-system get deploy`
    - pods
        `kubectl get pods -n kube-system | grep cluster-autoscaler`
        
    - Test Scaling of deployments:
        `kubectl -n kube-system scale deploy cluster-autoscaler-aws-cluster-autoscaler --replicas=50`
        `kubectl -n kube-system scale deploy cluster-autoscaler-aws-cluster-autoscaler --replicas=1`

1. Clean up
   ```bash
   pulumi destroy -y
   rm kubeconfig
   unset KUBECONFIG
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```