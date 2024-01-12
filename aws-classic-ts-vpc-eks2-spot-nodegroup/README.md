# AWS EKS2 SPOT Managed Nodes and Grafana Monitoring for Prometheus Metrics, Loki, Tempo, & Opencost

AWS vpc with [awsx 2](https://www.pulumi.com/registry/packages/awsx/), [eks 2](https://www.pulumi.com/registry/packages/eks/), [grafana .2](https://www.pulumi.com/registry/packages/grafana/), [kubernetes 4](https://www.pulumi.com/registry/packages/kubernetes/) with spot managed nodes in TypeScript. Creating helm release for grafana prometheus metrics, loki, tempo, and opencost. Avoiding metric server.

## Requirements
 -  Add the following managed policy arn role: `arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy` in `iam.ts`
 -  Must install Amazon EBS CSI driver via [helm release/chart](https://artifacthub.io/packages/helm/deliveryhero/aws-ebs-csi-driver) if running k8s version 1.23+ as per [aws managing ebs csi](https://docs.aws.amazon.com/eks/latest/userguide/managing-ebs-csi.html).  
 - Otherwise, you will encounter the following error: [K8s Pods Failure : error while running "VolumeBinding" prebind plugin for pod "app": Failed to bind volumes: timed out waiting for the condition](https://stackoverflow.com/questions/68725070/k8s-pods-failure-error-while-running-volumebinding-prebind-plugin-for-pod-a)


## Metrics
   Installed the prometheus metrics via helm chart Sign up for a user account at: grafanalabs.com

## Kubcost
 - requires aws ebs csi driver for k8s 1.23+
 - changed the volume size from 30Gi to 12Gi to save cost.
 - Disabled node-exporter and kube-state-metrics (recommended) since they are installed due to the prometheus helm chart.
 -  

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

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-vpc-eks2-spot-nodegroup/dev/previews/f172e771-7ce7-4841-ad2b-081ddc282b7c

        Type                                          Name                                        Plan       Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-vpc-eks2-spot-nodegroup-dev  create     2 messages
    +   ├─ aws:iam:Policy                             AWSLoadBalancerControllerIAMPolicy          create     
    +   ├─ aws:iam:Role                               demo-role-role-0-iamrole                    create     
    +   ├─ aws:iam:Policy                             EKSClusterAutoscalePolicy                   create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-2                   create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-3                   create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-4                   create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-0                   create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-5                   create     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-1                   create     
    +   ├─ awsx:ec2:Vpc                               demo-vpc                                    create     
    +   │  ├─ aws:ec2:Vpc                             demo-vpc                                    create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-1                           create     
    +   │  │  │  ├─ aws:ec2:Eip                       demo-vpc-1                                  create     
    +   │  │  │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                           create     
    +   │  │  │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                           create     
    +   │  │  │  │  └─ aws:ec2:Route                  demo-vpc-public-1                           create     
    +   │  │  │  └─ aws:ec2:NatGateway                demo-vpc-1                                  create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-3                          create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-3                          create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                          create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-3                          create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-2                           create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-2                           create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                           create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-2                           create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-2                          create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-2                          create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                          create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-2                          create     
    +   │  │  ├─ aws:ec2:InternetGateway              demo-vpc                                    create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-3                           create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-3                           create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                           create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-3                           create     
    +   │  │  └─ aws:ec2:Subnet                       demo-vpc-private-1                          create     
    +   │  │     └─ aws:ec2:RouteTable                demo-vpc-private-1                          create     
    +   │  │        ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                          create     
    +   │  │        └─ aws:ec2:Route                  demo-vpc-private-1                          create     
    +   │  └─ aws:ec2:SecurityGroup                   demo-eksclustersg                           create     
    +   ├─ eks:index:Cluster                          demo-eks                                    create     
    +   │  ├─ eks:index:ServiceRole                   demo-eks-eksRole                            create     
    +   │  │  ├─ aws:iam:Role                         demo-eks-eksRole-role                       create     
    +   │  │  └─ aws:iam:RolePolicyAttachment         demo-eks-eksRole-4b490823                   create     
    +   │  ├─ aws:eks:Cluster                         demo-eks-eksCluster                         create     
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-eks-k8s                            create     
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-provider                           create     
    +   │  ├─ aws:ec2:SecurityGroup                   demo-eks-nodeSecurityGroup                  create     
    +   │  ├─ kubernetes:core/v1:ConfigMap            demo-eks-nodeAccess                         create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeClusterIngressRule          create     
    +   │  ├─ eks:index:VpcCni                        demo-eks-vpc-cni                            create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeInternetEgressRule          create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeIngressRule                 create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksExtApiServerClusterIngressRule  create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksClusterIngressRule              create     
    +   │  └─ eks:index:ManagedNodeGroup              demo-manangednodegroup                      create     
    +   │     └─ aws:eks:NodeGroup                    demo-manangednodegroup                      create     
    +   ├─ pulumi:providers:kubernetes                demo-k8sprovider                            create     
    +   ├─ kubernetes:core/v1:Namespace               demo-metric-ns                              create     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-grafanahelmchart                       create     
    +   ├─ kubernetes:core/v1:Namespace               demo-kubecost-ns                            create     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-kubecosthelmchart                      create     
    +   └─ kubernetes:helm.sh/v3:Release              demo-awsebscsidriver                        create     

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-vpc-eks2-spot-nodegroup-dev):
        (node:60070) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

    Outputs:
        cluster_name                 : "demo-eks-eksCluster-2e733f7"
        helm_chart_aws_ebs_csi_driver: output<string>
        helm_chart_kubecost          : output<string>
        helm_chart_prometheus_metrics: output<string>
        kubeconfig                   : output<string>
        managed_node_group_name      : output<string>
        managed_node_group_version   : output<string>
        namespace_kubecost           : output<string>
        namespace_metrics            : output<string>
        private_subnet_ids           : output<string>
        public_subnet_ids            : output<string>
        vpc_id                       : output<string>

    Resources:
        + 63 to create

    Do you want to perform this update? yes
    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-vpc-eks2-spot-nodegroup/dev/updates/83

        Type                                          Name                                        Status              Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-vpc-eks2-spot-nodegroup-dev  created (736s)      7 messages
    +   ├─ aws:iam:Role                               demo-role-role-0-iamrole                    created (0.58s)     
    +   ├─ aws:iam:Policy                             EKSClusterAutoscalePolicy                   created (0.56s)     
    +   ├─ aws:iam:Policy                             AWSLoadBalancerControllerIAMPolicy          created (0.71s)     
    +   ├─ awsx:ec2:Vpc                               demo-vpc                                    created (1s)        
    +   │  ├─ aws:ec2:Vpc                             demo-vpc                                    created (2s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-1                           created (11s)       
    +   │  │  │  ├─ aws:ec2:Eip                       demo-vpc-1                                  created (0.95s)     
    +   │  │  │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                           created (1s)        
    +   │  │  │  │  ├─ aws:ec2:Route                  demo-vpc-public-1                           created (1s)        
    +   │  │  │  │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                           created (1s)        
    +   │  │  │  └─ aws:ec2:NatGateway                demo-vpc-1                                  created (95s)       
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-3                          created (1s)        
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-3                          created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                          created (0.95s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-3                          created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-2                          created (1s)        
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-2                          created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                          created (0.95s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-2                          created (1s)        
    +   │  │  ├─ aws:ec2:InternetGateway              demo-vpc                                    created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-2                           created (12s)       
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-2                           created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                           created (0.74s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-2                           created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-1                          created (2s)        
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-1                          created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                          created (0.61s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-1                          created (1s)        
    +   │  │  └─ aws:ec2:Subnet                       demo-vpc-public-3                           created (13s)       
    +   │  │     └─ aws:ec2:RouteTable                demo-vpc-public-3                           created (1s)        
    +   │  │        ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                           created (0.89s)     
    +   │  │        └─ aws:ec2:Route                  demo-vpc-public-3                           created (1s)        
    +   │  └─ aws:ec2:SecurityGroup                   demo-eksclustersg                           created (2s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-2                   created (0.48s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-1                   created (0.63s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-4                   created (0.86s)     
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-3                   created (1s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-0                   created (1s)        
    +   ├─ aws:iam:RolePolicyAttachment               demo-role-role-0-policy-5                   created (1s)        
    +   ├─ eks:index:Cluster                          demo-eks                                    created (415s)      
    +   │  ├─ eks:index:ServiceRole                   demo-eks-eksRole                            created (1s)        
    +   │  │  ├─ aws:iam:Role                         demo-eks-eksRole-role                       created (0.50s)     
    +   │  │  └─ aws:iam:RolePolicyAttachment         demo-eks-eksRole-4b490823                   created (0.31s)     
    +   │  ├─ aws:eks:Cluster                         demo-eks-eksCluster                         created (412s)      
    +   │  ├─ aws:ec2:SecurityGroup                   demo-eks-nodeSecurityGroup                  created (2s)        
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-provider                           created (0.78s)     
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-eks-k8s                            created (0.90s)     
    +   │  ├─ kubernetes:core/v1:ConfigMap            demo-eks-nodeAccess                         created (0.63s)     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeClusterIngressRule          created (0.96s)     
    +   │  ├─ eks:index:VpcCni                        demo-eks-vpc-cni                            created (2s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeIngressRule                 created (1s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeInternetEgressRule          created (1s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksExtApiServerClusterIngressRule  created (2s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksClusterIngressRule              created (2s)        
    +   │  └─ eks:index:ManagedNodeGroup              demo-manangednodegroup                      created (0.38s)     
    +   │     └─ aws:eks:NodeGroup                    demo-manangednodegroup                      created (117s)      
    +   ├─ pulumi:providers:kubernetes                demo-k8sprovider                            created (0.68s)     
    +   ├─ kubernetes:core/v1:Namespace               demo-metric-ns                              created (0.50s)     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-grafanahelmchart                       created (57s)       
    +   ├─ kubernetes:core/v1:Namespace               demo-kubecost-ns                            created (0.72s)     
    +   │  └─ kubernetes:helm.sh/v3:Release           demo-kubecosthelmchart                      created (61s)       
    +   └─ kubernetes:helm.sh/v3:Release              demo-awsebscsidriver                        created (27s)       

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-vpc-eks2-spot-nodegroup-dev):
        (node:60104) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

        Warning: resource clusterroles/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource serviceaccounts/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource clusterrolebindings/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource daemonsets/aws-node is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
        Warning: resource customresourcedefinitions/eniconfigs.crd.k8s.amazonaws.com is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.

    Outputs:
        cluster_name                 : "demo-eks-eksCluster-0043b7e"
        helm_chart_aws_ebs_csi_driver: "demo-awsebscsidriver-9156cbb4"
        helm_chart_kubecost          : "demo-kubecosthelmchart-703318d0"
        helm_chart_prometheus_metrics: "demo-grafanahelmchart-339ff724"
        kubeconfig                   : [secret]
        managed_node_group_name      : "demo-eks-eksCluster-0043b7e:demo-manangednodegroup-81aceaf"
        managed_node_group_version   : "1.26"
        namespace_kubecost           : "demo-kubecost-ns-e23188d4"
        namespace_metrics            : "demo-metric-ns-6f32bc9a"
        private_subnet_ids           : [
            [0]: "subnet-00ce6043492aee514"
            [1]: "subnet-04cdf40329b897f62"
            [2]: "subnet-02c6e6577f7f081f9"
        ]
        public_subnet_ids            : [
            [0]: "subnet-0874bb6b98130231d"
            [1]: "subnet-0c7389ec35dbdbb76"
            [2]: "subnet-079fa596937944fcd"
        ]
        vpc_id                       : "vpc-026fe530773f2c0c7"

    Resources:
        + 63 created

    Duration: 12m20s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (12):
    OUTPUT                         VALUE
    cluster_name                   demo-eks-eksCluster-0043b7e
    helm_chart_aws_ebs_csi_driver  demo-awsebscsidriver-9156cbb4
    helm_chart_kubecost            demo-kubecosthelmchart-703318d0
    helm_chart_prometheus_metrics  demo-grafanahelmchart-339ff724
    kubeconfig                     [secret]
    managed_node_group_name        demo-eks-eksCluster-0043b7e:demo-manangednodegroup-81aceaf
    managed_node_group_version     1.26
    namespace_kubecost             demo-kubecost-ns-e23188d4
    namespace_metrics              demo-metric-ns-6f32bc9a
    private_subnet_ids             ["subnet-00ce6043492aee514","subnet-04cdf40329b897f62","subnet-02c6e6577f7f081f9"]
    public_subnet_ids              ["subnet-0874bb6b98130231d","subnet-0c7389ec35dbdbb76","subnet-079fa596937944fcd"]
    vpc_id                         vpc-026fe530773f2c0c7
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