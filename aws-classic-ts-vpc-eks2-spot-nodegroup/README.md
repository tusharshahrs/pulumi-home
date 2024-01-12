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

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-vpc-eks2-spot-nodegroup/dev/previews/b31126eb-a2f4-4693-9200-354c2b2ace15

        Type                                          Name                                        Plan       Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-vpc-eks2-spot-nodegroup-dev  create     2 messages
    +   ├─ awsx:ec2:Vpc                               demo-vpc                                    create     
    +   │  ├─ aws:ec2:Vpc                             demo-vpc                                    create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-3                           create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-3                           create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                           create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-3                           create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-2                           create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-2                           create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                           create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-2                           create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-1                          create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-1                          create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                          create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-1                          create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-3                          create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-3                          create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                          create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-3                          create     
    +   │  │  ├─ aws:ec2:InternetGateway              demo-vpc                                    create     
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-2                          create     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-2                          create     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                          create     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-2                          create     
    +   │  │  └─ aws:ec2:Subnet                       demo-vpc-public-1                           create     
    +   │  │     ├─ aws:ec2:Eip                       demo-vpc-1                                  create     
    +   │  │     ├─ aws:ec2:RouteTable                demo-vpc-public-1                           create     
    +   │  │     │  ├─ aws:ec2:Route                  demo-vpc-public-1                           create     
    +   │  │     │  └─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                           create     
    +   │  │     └─ aws:ec2:NatGateway                demo-vpc-1                                  create     
    +   │  └─ aws:ec2:SecurityGroup                   demo-eksclustersg                           create     
    +   ├─ eks:index:Cluster                          demo-eks                                    create     
    +   │  ├─ eks:index:ServiceRole                   demo-eks-instanceRole                       create     
    +   │  │  ├─ aws:iam:Role                         demo-eks-instanceRole-role                  create     
    +   │  │  ├─ aws:iam:RolePolicyAttachment         demo-eks-instanceRole-03516f97              create     
    +   │  │  ├─ aws:iam:RolePolicyAttachment         demo-eks-instanceRole-e1b295bd              create     
    +   │  │  └─ aws:iam:RolePolicyAttachment         demo-eks-instanceRole-3eb088f2              create     
    +   │  ├─ eks:index:ServiceRole                   demo-eks-eksRole                            create     
    +   │  │  ├─ aws:iam:Role                         demo-eks-eksRole-role                       create     
    +   │  │  └─ aws:iam:RolePolicyAttachment         demo-eks-eksRole-4b490823                   create     
    +   │  ├─ aws:eks:Cluster                         demo-eks-eksCluster                         create     
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-provider                           create     
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-eks-k8s                            create     
    +   │  ├─ aws:ec2:SecurityGroup                   demo-eks-nodeSecurityGroup                  create     
    +   │  ├─ kubernetes:core/v1:ConfigMap            demo-eks-nodeAccess                         create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksExtApiServerClusterIngressRule  create     
    +   │  ├─ eks:index:VpcCni                        demo-eks-vpc-cni                            create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeClusterIngressRule          create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksClusterIngressRule              create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeIngressRule                 create     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeInternetEgressRule          create     
    +   │  └─ eks:index:ManagedNodeGroup              demo-manangednodegroup                      create     
    +   │     ├─ aws:eks:NodeGroup                    demo-manangednodegroup                      create     
    +   │     └─ kubernetes:core/v1:Namespace         demo-metric-ns                              create     
    +   │        └─ kubernetes:helm.sh/v3:Release     demo-grafanak8smonitoring                   create     
    +   └─ pulumi:providers:kubernetes                demo-k8sprovider                            create     

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-vpc-eks2-spot-nodegroup-dev):
        (node:36663) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

    Outputs:
        cluster_name                       : "demo-eks-eksCluster-31877ad"
        kubeconfig                         : output<string>
        managed_node_group_name            : output<string>
        managed_node_group_version         : output<string>
        metrics_ns                         : output<string>
        private_subnet_ids                 : output<string>
        prometheus_metrics_helmrelease_name: output<string>
        public_subnet_ids                  : output<string>
        vpc_id                             : output<string>

    Resources:
        + 56 to create

    Do you want to perform this update? yes
    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-vpc-eks2-spot-nodegroup/dev/updates/54

        Type                                          Name                                        Status              Info
    +   pulumi:pulumi:Stack                           aws-classic-ts-vpc-eks2-spot-nodegroup-dev  created (763s)      2 messages
    +   ├─ awsx:ec2:Vpc                               demo-vpc                                    created (3s)        
    +   │  ├─ aws:ec2:Vpc                             demo-vpc                                    created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-2                          created (0.81s)     
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-2                          created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                          created (0.83s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-2                          created (1s)        
    +   │  │  ├─ aws:ec2:InternetGateway              demo-vpc                                    created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-3                           created (11s)       
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-3                           created (1s)        
    +   │  │  │     ├─ aws:ec2:Route                  demo-vpc-public-3                           created (1s)        
    +   │  │  │     └─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                           created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-3                          created (1s)        
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-3                          created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                          created (0.84s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-3                          created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-public-2                           created (12s)       
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-public-2                           created (0.97s)     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                           created (1s)        
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-2                           created (1s)        
    +   │  │  ├─ aws:ec2:Subnet                       demo-vpc-private-1                          created (2s)        
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-1                          created (1s)        
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                          created (0.59s)     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-1                          created (0.83s)     
    +   │  │  └─ aws:ec2:Subnet                       demo-vpc-public-1                           created (13s)       
    +   │  │     ├─ aws:ec2:Eip                       demo-vpc-1                                  created (1s)        
    +   │  │     ├─ aws:ec2:RouteTable                demo-vpc-public-1                           created (1s)        
    +   │  │     │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                           created (1s)        
    +   │  │     │  └─ aws:ec2:Route                  demo-vpc-public-1                           created (1s)        
    +   │  │     └─ aws:ec2:NatGateway                demo-vpc-1                                  created (105s)      
    +   │  └─ aws:ec2:SecurityGroup                   demo-eksclustersg                           created (2s)        
    +   ├─ eks:index:Cluster                          demo-eks                                    created (450s)      
    +   │  ├─ eks:index:ServiceRole                   demo-eks-instanceRole                       created (3s)        
    +   │  │  ├─ aws:iam:Role                         demo-eks-instanceRole-role                  created (0.72s)     
    +   │  │  ├─ aws:iam:RolePolicyAttachment         demo-eks-instanceRole-03516f97              created (0.55s)     
    +   │  │  ├─ aws:iam:RolePolicyAttachment         demo-eks-instanceRole-e1b295bd              created (0.71s)     
    +   │  │  └─ aws:iam:RolePolicyAttachment         demo-eks-instanceRole-3eb088f2              created (0.96s)     
    +   │  ├─ eks:index:ServiceRole                   demo-eks-eksRole                            created (3s)        
    +   │  │  ├─ aws:iam:Role                         demo-eks-eksRole-role                       created (0.59s)     
    +   │  │  └─ aws:iam:RolePolicyAttachment         demo-eks-eksRole-4b490823                   created (0.92s)     
    +   │  ├─ aws:eks:Cluster                         demo-eks-eksCluster                         created (444s)      
    +   │  ├─ aws:ec2:SecurityGroup                   demo-eks-nodeSecurityGroup                  created (3s)        
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-eks-k8s                            created (0.46s)     
    +   │  ├─ pulumi:providers:kubernetes             demo-eks-provider                           created (0.79s)     
    +   │  ├─ eks:index:VpcCni                        demo-eks-vpc-cni                            created (3s)        
    +   │  ├─ kubernetes:core/v1:ConfigMap            demo-eks-nodeAccess                         created (0.89s)     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksClusterIngressRule              created (0.92s)     
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksExtApiServerClusterIngressRule  created (1s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeInternetEgressRule          created (1s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeIngressRule                 created (2s)        
    +   │  ├─ aws:ec2:SecurityGroupRule               demo-eks-eksNodeClusterIngressRule          created (2s)        
    +   │  └─ eks:index:ManagedNodeGroup              demo-manangednodegroup                      created (0.40s)     
    +   │     ├─ aws:eks:NodeGroup                    demo-manangednodegroup                      created (117s)      
    +   │     └─ kubernetes:core/v1:Namespace         demo-metric-ns                              created (0.43s)     
    +   │        └─ kubernetes:helm.sh/v3:Release     demo-grafanak8smonitoring                   created (49s)       
    +   └─ pulumi:providers:kubernetes                demo-k8sprovider                            created (1s)        

    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-vpc-eks2-spot-nodegroup-dev):
        (node:36736) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

    Outputs:
        cluster_name                       : "demo-eks-eksCluster-75f0a4c"
        kubeconfig                         : [secret]
        managed_node_group_name            : "demo-eks-eksCluster-75f0a4c:demo-manangednodegroup-deb122c"
        managed_node_group_version         : "1.26"
        metrics_ns                         : "demo-metric-ns-1c8e628f"
        private_subnet_ids                 : [
            [0]: "subnet-0dedbf947772dfdfd"
            [1]: "subnet-0481666f6c215571b"
            [2]: "subnet-0c853b4344232535e"
        ]
        prometheus_metrics_helmrelease_name: "demo-grafanak8smonitoring-5177cd5c"
        public_subnet_ids                  : [
            [0]: "subnet-035056b317d9a53ad"
            [1]: "subnet-0cb50511e45dc5015"
            [2]: "subnet-0bc964f8b4b66d927"
        ]
        vpc_id                             : "vpc-098f92b6de22c9af3"

    Resources:
        + 56 created

    Duration: 12m46s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (11):
    OUTPUT                               VALUE
    aws_ebs_csi_driver_chart             demo-awsebscsidriver-fb5a2a3b
    cluster_name                         demo-eks-eksCluster-22a0aa7
    kubeconfig                           [secret]
    kubecost_ns                          demo-kubecost-ns-c8c13276
    managed_node_group_name              demo-eks-eksCluster-22a0aa7:demo-manangednodegroup-b296a9b
    managed_node_group_version           1.26
    metrics_ns                           demo-metric-ns-cd6741d2
    private_subnet_ids                   ["subnet-0ef0ae57e3c896723","subnet-003a14cf1919b2ee5","subnet-045e8b50dcd8ac498"]
    prometheus_metrics_helmrelease_name  demo-grafanahelmchart-858f6111
    public_subnet_ids                    ["subnet-02257cb4e034e84b6","subnet-0cfb974d62a861913","subnet-0d26f0871d41138df"]
    vpc_id                               vpc-0770d598fe8dbb215
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