# Azure Managed Cluster AKS Grafana Monitoring for Prometheus Metrics, Loki, Tempo, & Opencost, and Kubecost

Azure native [2](https://www.pulumi.com/registry/packages/azure-native/),[grafana .2](https://www.pulumi.com/registry/packages/grafana/), [kubernetes 4](https://www.pulumi.com/registry/packages/kubernetes/). Creating helm release for grafana k8s-monitoring, loki, tempo, and opencost. Avoiding metric-server(built in). KubeCost 2

## Requirements

## Metrics
   Comes installed with it for AKS.  
   
## HPA
    Automatic with AKS

## Kubcost
 - Disabled node-exporter and kube-state-metrics (recommended) since they are installed due to the prometheus helm chart.

## Deployment

1. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step)

    ```bash
    az login
    ```

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
   pulumi config set azure-native:location  centralus # any valid azure region
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

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/azure-ts-aks-autoscale-grafana-autoscale-kubecost/dev/previews/3010d65b-ca3a-41a3-b35c-cd719ab3ed8d

        Type                                                   Name                                                   Plan       Info
    +   pulumi:pulumi:Stack                                    azure-ts-aks-autoscale-grafana-autoscale-kubecost-dev  create     2 messages
    +   ├─ azuread:index:Application                           demo2-aad-application                                  create     
    +   │  └─ azuread:index:ServicePrincipal                   demo2-adsp                                             create     
    +   │     └─ azuread:index:ServicePrincipalPassword        demo2-adsp-password                                    create     
    +   ├─ tls:index:PrivateKey                                demo2-ssh-private-key                                  create     
    +   ├─ azure-native:resources:ResourceGroup                demo2-rg                                               create     
    +   │  ├─ azure-native:storage:StorageAccount              demo2sa                                                create     
    +   │  └─ azure-native:network:VirtualNetwork              demo2-vnet                                             create     
    +   │     ├─ azure-native:network:Subnet                   demo2-publicSubnet0                                    create     
    +   │     │  └─ azure-native:network:Subnet                demo2-privateSubnet3                                   create     
    +   │     ├─ azure-native:network:Subnet                   demo2-publicSubnet2                                    create     
    +   │     │  └─ azure-native:network:Subnet                demo2-privateSubnet5                                   create     
    +   │     ├─ azure-native:network:Subnet                   demo2-publicSubnet1                                    create     
    +   │     │  └─ azure-native:network:Subnet                demo2-privateSubnet4                                   create     
    +   │     └─ azure-native:containerservice:ManagedCluster  demo2-managedcluster                                   create     
    +   │        └─ azure-native:containerservice:AgentPool    demo2-userAgentPool                                    create     
    +   ├─ pulumi:providers:kubernetes                         demo2-k8sprovider                                      create     
    +   ├─ kubernetes:core/v1:Namespace                        demo2-kubecost-ns                                      create     
    +   │  └─ kubernetes:helm.sh/v3:Release                    demo2-kubecosthelmr                                    create     
    +   └─ kubernetes:core/v1:Namespace                        demo2-metric-ns                                        create     
    +      └─ kubernetes:helm.sh/v3:Release                    demo2-k8smonitoringhelmr                               create     

    Diagnostics:
    pulumi:pulumi:Stack (azure-ts-aks-autoscale-grafana-autoscale-kubecost-dev):
        (node:62108) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

    Outputs:
        azuread_application_display_name: "demo2-aad-application"
        azuread_application_id          : output<string>
        azuread_service_principal_name  : output<string>
        cluster_k8s_version             : "1.26.10"
        cluster_name                    : output<string>
        helm_chart_kubecost             : output<string>
        helm_chart_prometheus_metrics   : output<string>
        kubeconfig                      : output<string>
        namespace_kubecost              : output<string>
        namespace_metrics               : output<string>
        primary_storage_key             : output<string>
        private_subnet_names            : [
            [0]: output<string>
            [1]: output<string>
            [2]: output<string>
        ]
        public_subnet_names             : [
            [0]: output<string>
            [1]: output<string>
            [2]: output<string>
        ]
        resource_group_name             : output<string>
        storage_account_name            : output<string>
        user_agentpool_name             : output<string>
        vnet_name                       : output<string>

    Resources:
        + 21 to create

    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/azure-ts-aks-autoscale-grafana-autoscale-kubecost/dev/previews/d1059f2c-afe7-4928-8b20-19df0f3e8720

        Type                                                   Name                                                   Plan       Info
    +   pulumi:pulumi:Stack                                    azure-ts-aks-autoscale-grafana-autoscale-kubecost-dev  create     2 messages
    +   ├─ tls:index:PrivateKey                                demo2-ssh-private-key                                  create     
    +   ├─ azuread:index:Application                           demo2-aad-application                                  create     
    +   │  └─ azuread:index:ServicePrincipal                   demo2-adsp                                             create     
    +   │     └─ azuread:index:ServicePrincipalPassword        demo2-adsp-password                                    create     
    +   ├─ azure-native:resources:ResourceGroup                demo2-rg                                               create     
    +   │  ├─ azure-native:storage:StorageAccount              demo2sa                                                create     
    +   │  └─ azure-native:network:VirtualNetwork              demo2-vnet                                             create     
    +   │     ├─ azure-native:network:Subnet                   demo2-publicSubnet2                                    create     
    +   │     │  └─ azure-native:network:Subnet                demo2-privateSubnet5                                   create     
    +   │     ├─ azure-native:network:Subnet                   demo2-publicSubnet1                                    create     
    +   │     │  └─ azure-native:network:Subnet                demo2-privateSubnet4                                   create     
    +   │     ├─ azure-native:network:Subnet                   demo2-publicSubnet0                                    create     
    +   │     │  └─ azure-native:network:Subnet                demo2-privateSubnet3                                   create     
    +   │     └─ azure-native:containerservice:ManagedCluster  demo2-managedcluster                                   create     
    +   │        └─ azure-native:containerservice:AgentPool    demo2-userAgentPool                                    create     
    +   ├─ pulumi:providers:kubernetes                         demo2-k8sprovider                                      create     
    +   ├─ kubernetes:core/v1:Namespace                        demo2-kubecost-ns                                      create     
    +   │  └─ kubernetes:helm.sh/v3:Release                    demo2-kubecosthelm                                     create     
    +   └─ kubernetes:core/v1:Namespace                        demo2-monitoring-ns                                    create     
    +      └─ kubernetes:helm.sh/v3:Release                    demo2-k8smonitoring-helm                               create     

    Diagnostics:
    pulumi:pulumi:Stack (azure-ts-aks-autoscale-grafana-autoscale-kubecost-dev):
        (node:97184) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

    Outputs:
        azuread_application_display_name : "demo2-aad-application"
        azuread_application_id           : output<string>
        azuread_service_principal_name   : output<string>
        cluster_k8s_version              : "1.26.10"
        cluster_name                     : output<string>
        helm_chart_grafana_k8s_monitoring: output<string>
        helm_chart_kubecost              : output<string>
        kubeconfig                       : output<string>
        namespace_grafana_k8s_monitoring : output<string>
        namespace_kubecost               : output<string>
        primary_storage_key              : output<string>
        private_subnet_names             : [
            [0]: output<string>
            [1]: output<string>
            [2]: output<string>
        ]
        public_subnet_names              : [
            [0]: output<string>
            [1]: output<string>
            [2]: output<string>
        ]
        resource_group_name              : output<string>
        storage_account_name             : output<string>
        user_agentpool_name              : output<string>
        vnet_name                        : output<string>

    Resources:
        + 21 to create

    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/azure-ts-aks-autoscale-grafana-autoscale-kubecost/dev/updates/124

        Type                                                   Name                                                   Status              Info
    +   pulumi:pulumi:Stack                                    azure-ts-aks-autoscale-grafana-autoscale-kubecost-dev  created (385s)      2 messages
    +   ├─ azuread:index:Application                           demo2-aad-application                                  created (4s)        
    +   │  └─ azuread:index:ServicePrincipal                   demo2-adsp                                             created (2s)        
    +   │     └─ azuread:index:ServicePrincipalPassword        demo2-adsp-password                                    created (5s)        
    +   ├─ tls:index:PrivateKey                                demo2-ssh-private-key                                  created (6s)        
    +   ├─ azure-native:resources:ResourceGroup                demo2-rg                                               created (1s)        
    +   │  ├─ azure-native:storage:StorageAccount              demo2sa                                                created (21s)       
    +   │  └─ azure-native:network:VirtualNetwork              demo2-vnet                                             created (5s)        
    +   │     ├─ azure-native:network:Subnet                   demo2-publicSubnet2                                    created (15s)       
    +   │     │  └─ azure-native:network:Subnet                demo2-privateSubnet5                                   created (3s)        
    +   │     ├─ azure-native:network:Subnet                   demo2-publicSubnet0                                    created (4s)        
    +   │     │  └─ azure-native:network:Subnet                demo2-privateSubnet3                                   created (4s)        
    +   │     ├─ azure-native:network:Subnet                   demo2-publicSubnet1                                    created (4s)        
    +   │     │  └─ azure-native:network:Subnet                demo2-privateSubnet4                                   created (3s)        
    +   │     └─ azure-native:containerservice:ManagedCluster  demo2-managedcluster                                   created (156s)      
    +   │        └─ azure-native:containerservice:AgentPool    demo2-userAgentPool                                    created (125s)      
    +   ├─ pulumi:providers:kubernetes                         demo2-k8sprovider                                      created (0.53s)     
    +   ├─ kubernetes:core/v1:Namespace                        demo2-kubecost-ns                                      created (0.61s)     
    +   │  └─ kubernetes:helm.sh/v3:Release                    demo2-kubecosthelm                                     created (132s)      
    +   └─ kubernetes:core/v1:Namespace                        demo2-monitoring-ns                                    created (0.93s)     
    +      └─ kubernetes:helm.sh/v3:Release                    demo2-k8smonitoring-helm                               created (62s)       

    Diagnostics:
    pulumi:pulumi:Stack (azure-ts-aks-autoscale-grafana-autoscale-kubecost-dev):
        (node:97298) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)

    Outputs:
        azuread_application_display_name : "demo2-aad-application"
        azuread_application_id           : "/applications/832bc277-085b-4a36-b52c-4c5df0f91c9e"
        azuread_service_principal_name   : "demo2-aad-application"
        cluster_k8s_version              : "1.26.10"
        cluster_name                     : "demo2-managedcluster7df65b01"
        helm_chart_grafana_k8s_monitoring: "demo2-k8smonitoring-helm-110ba50f"
        helm_chart_kubecost              : "demo2-kubecosthelm-347693f7"
        kubeconfig                       : [secret]
        namespace_grafana_k8s_monitoring : "demo2-monitoring-ns-da649697"
        namespace_kubecost               : "demo2-kubecost-ns-28c6b829"
        primary_storage_key              : [secret]
        private_subnet_names             : [
            [0]: "demo2-privateSubnet3"
            [1]: "demo2-privateSubnet4"
            [2]: "demo2-privateSubnet5"
        ]
        public_subnet_names              : [
            [0]: "demo2-publicSubnet0"
            [1]: "demo2-publicSubnet1"
            [2]: "demo2-publicSubnet2"
        ]
        resource_group_name              : "demo2-rg3dc790b7"
        storage_account_name             : "demo2sa5f4b05e2"
        user_agentpool_name              : "demo2spot"
        vnet_name                        : "demo2-vnetf5f3fec0"

    Resources:
        + 21 created

    Duration: 6m29s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (17):
    OUTPUT                             VALUE
    azuread_application_display_name   demo2-aad-application
    azuread_application_id             /applications/832bc277-085b-4a36-b52c-4c5df0f91c9e
    azuread_service_principal_name     demo2-aad-application
    cluster_k8s_version                1.26.10
    cluster_name                       demo2-managedcluster7df65b01
    helm_chart_grafana_k8s_monitoring  demo2-k8smonitoring-helm-110ba50f
    helm_chart_kubecost                demo2-kubecosthelm-347693f7
    kubeconfig                         [secret]
    namespace_grafana_k8s_monitoring   demo2-monitoring-ns-da649697
    namespace_kubecost                 demo2-kubecost-ns-28c6b829
    primary_storage_key                [secret]
    private_subnet_names               ["demo2-privateSubnet3","demo2-privateSubnet4","demo2-privateSubnet5"]
    public_subnet_names                ["demo2-publicSubnet0","demo2-publicSubnet1","demo2-publicSubnet2"]
    resource_group_name                demo2-rg3dc790b7
    storage_account_name               demo2sa5f4b05e2
    user_agentpool_name                demo2spot
    vnet_name                          demo2-vnetf5f3fec0
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