import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as network from "@pulumi/azure-native/network";
import * as azuread from "@pulumi/azuread";
import * as tls from "@pulumi/tls";
import * as containerservice from "@pulumi/azure-native/containerservice";
import * as k8s from "@pulumi/kubernetes";

// variable name
const name = "demo2";
const config = new pulumi.Config();

// https://github.com/grafana/k8s-monitoring-helm/blob/main/charts/k8s-monitoring/README.md
// get the grafana auth token from the pulumi config
const grafanaauth = config.requireSecret("GRAFANA_AUTH");
// get the grafana prometheus user from the pulumi config
const grafana_prometheus_user = config.requireSecret("GRAFANA_PROMETHEUS_USERNAME");
// get the grafana loki user from the pulumi config
const grafana_loki_user = config.requireSecret("GRAFANA_LOKI_USERNAME");
// get the grafana tempo user from the pulumi config
const grafana_tempo_user = config.requireSecret("GRAFANA_TEMPO_USERNAME");
// get the kubecost token from the pulumi config
const kubecost_token = config.requireSecret("KUBECOST_TOKEN");

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`${name}-rg`, 
    {tags: {"Name": `${name}-rg`}});

export const resource_group_name = resourceGroup.name;

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount(`${name}sa`, {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
    tags: {"Name": `${name}sa`},
}, {parent: resourceGroup, dependsOn: resourceGroup});

export const storage_account_name = storageAccount.name;

// Export the primary key of the Storage Account
const storageAccountKeys = storage.listStorageAccountKeysOutput({
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name
});

export const primary_storage_key = pulumi.secret(storageAccountKeys.keys[0].value);


// Create an Azure Virtual Network
const virtualNetwork = new network.VirtualNetwork(`${name}-vnet`, {
    resourceGroupName: resourceGroup.name,
    addressSpace: {
        addressPrefixes: ["10.0.0.0/21"],
    },
    tags: {"Name": `${name}-vnet`},
}, {parent: resourceGroup, dependsOn: resourceGroup});

export const vnet_name = virtualNetwork.name;

/*
https://www.davidc.net/sites/default/subnets/subnets.html
VNET: 10.0.0.0 Mask Bits: 21
Subnet address	Range of addresses	Useable IPs	Hosts	Divide	Join
10.0.0.0/24	10.0.0.0 - 10.0.0.255	10.0.0.1 - 10.0.0.254	254	Divide   			
10.0.1.0/24	10.0.1.0 - 10.0.1.255	10.0.1.1 - 10.0.1.254	254	Divide	
10.0.2.0/24	10.0.2.0 - 10.0.2.255	10.0.2.1 - 10.0.2.254	254	Divide		
10.0.3.0/24	10.0.3.0 - 10.0.3.255	10.0.3.1 - 10.0.3.254	254	Divide	
10.0.4.0/24	10.0.4.0 - 10.0.4.255	10.0.4.1 - 10.0.4.254	254	Divide			
10.0.5.0/24	10.0.5.0 - 10.0.5.255	10.0.5.1 - 10.0.5.254	254	Divide	
10.0.6.0/24	10.0.6.0 - 10.0.6.255	10.0.6.1 - 10.0.6.254	254	Divide		
10.0.7.0/24	10.0.7.0 - 10.0.7.255	10.0.7.1 - 10.0.7.254	254	Divide	
	

*/
// Holds exported subnet IDs
//export let publicSubnetIds: pulumi.Output<string>[] = [];
//export let privateSubnetIds: pulumi.Output<string>[] = [];

const publicSubnets = [];
const privateSubnets = [];
// Create 3 public subnets
for (let i = 0; i <= 2; i++) {
    const publicsubnet  = new network.Subnet(`${name}-publicSubnet${i}`, {
        resourceGroupName: resourceGroup.name,
        virtualNetworkName: virtualNetwork.name,
        addressPrefix: `10.0.${i}.0/24`, // Increment the third octet for each subnet
    }, {parent: virtualNetwork});
    //publicSubnetIds.push(subnet.id);
    publicSubnets.push(publicsubnet);
    
    // Creating private subnet, we want 3 private subnets.  If we want 4, bump the i to 4, assuming we have 4 public subnets
    const privatesubnet = new network.Subnet(`${name}-privateSubnet${i+3}`, {
        resourceGroupName: resourceGroup.name,
        virtualNetworkName: virtualNetwork.name,
        addressPrefix: `10.0.${i+3}.0/24`, // Increment the third octet for each subnet
    },{parent: publicsubnet, dependsOn: publicsubnet});
    privateSubnets.push(privatesubnet); 
}
/*
const publicSubnets = [];
const privateSubnets = [];
// Create 3 public subnets
for (let i = 0; i <= 2; i++) {
    const subnet  = new network.Subnet(`${name}-publicSubnet${i}`, {
        resourceGroupName: resourceGroup.name,
        virtualNetworkName: virtualNetwork.name,
        addressPrefix: `10.0.${i}.0/24`, // Increment the third octet for each subnet
        
    }, {parent: virtualNetwork});
    //publicSubnetIds.push(subnet.id);
    publicSubnets.push(subnet);
}

// Create 3 private subnets
for (let i = 3; i <= 5; i++) {
    const subnet = new network.Subnet(`${name}-privateSubnet${i}`, {
        resourceGroupName: resourceGroup.name,
        virtualNetworkName: virtualNetwork.name,
        addressPrefix: `10.0.${i}.0/24`, // Increment the third octet for each subnet
    }, 
    {parent: virtualNetwork, dependsOn: publicSubnets[i-1]});
    //{parent: virtualNetwork});
    //privateSubnetIds.push(subnet.id);
    privateSubnets.push(subnet);
}
*/
export const public_subnet_names = publicSubnets.map(sn => sn.name);
const public_subnet_full_path = publicSubnets.map(sn => sn.id);
export const private_subnet_names = privateSubnets.map(sn => sn.name);
const private_subnet_full_path = privateSubnets.map(sn => sn.id);


// Create an AD Application. Pre-Req for service principal
const adApp = new azuread.Application(`${name}-aad-application`,
    {
        displayName:`${name}-aad-application`,
    });

export const azuread_application_id = adApp.id;
export const azuread_application_display_name = adApp.displayName;


// Create a new service principal for the AKS cluster
const adSp = new azuread.ServicePrincipal(`${name}-adsp`,
{
    clientId: adApp.clientId,
}, {parent: adApp, dependsOn: adApp});

const ad_sp_password = new azuread.ServicePrincipalPassword(`${name}-adsp-password`, {
    servicePrincipalId: adSp.id,
    endDate: "2024-03-01T00:00:00Z",

}, {parent: adSp, dependsOn: adSp});

export const azuread_service_principal_name = adSp.displayName;

// Generate a SSH Key
// https://learn.microsoft.com/en-us/azure/virtual-machines/linux/ssh-from-windows?source=recommendations#supported-ssh-key-formats
const sshkey = new tls.PrivateKey(`${name}-ssh-private-key`, {
    //algorithm: "ECDSA", // ECDSA is not supported by AKS 
    //ecdsaCurve: "P384", // ECDSA is not supported by AKS
    algorithm: "RSA",
    rsaBits: 4096,
});

// Export the subnet IDs
//export const publicSubnetsIds = pulumi.all(publicSubnetIds);
//export const privateSubnetsIds = pulumi.all(privateSubnetIds);

const nodeCount = 3;
const osDiskSizeinGB = 60;

const mycluster = new containerservice.ManagedCluster(`${name}-managedcluster`, {
    resourceGroupName: resourceGroup.name,
    // Default node pool only runs critical system pods
    agentPoolProfiles: [{
        count: nodeCount,
        //maxPods: maxPodsCount,
        mode: "System",
        name: "agentpool",
        nodeLabels: {},
        osDiskSizeGB: osDiskSizeinGB,
        osType: "Linux",
        type: "VirtualMachineScaleSets",
        vmSize: "Standard_DS2_v2",
    }],
    //https://learn.microsoft.com/en-us/azure/aks/faq#can-i-provide-my-own-name-for-the-aks-node-resource-group
    dnsPrefix: `${name}-dns`,
    enableRBAC: true,
    kubernetesVersion: "1.26.10",
    linuxProfile: {
        adminUsername: "aksuser",
        ssh: {
            publicKeys: [{
                keyData: sshkey.publicKeyOpenssh,
            }],
        },
    },
    networkProfile: {
        // https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni?tabs=configure-networking-portal
        networkPolicy: "azure",
        networkPlugin: "azure",
        // https://learn.microsoft.com/en-us/azure/load-balancer/skus
        loadBalancerSku: "standard",         
    },
    sku: {
        name: "Base",
        tier: "Free"},
    servicePrincipalProfile: {
        clientId: adApp.clientId,
        secret: ad_sp_password.value,
    },
    tags: {"Name": `${name}-managedcluster`},
}, {parent: virtualNetwork, dependsOn: [adSp, adApp,virtualNetwork, privateSubnets[1]]});

export const cluster_name = mycluster.name;
export const cluster_k8s_version = mycluster.kubernetesVersion;

const userPoolnodecount = 1;
const userPoolmaxcount = 3;
const userPoolmincount = 1;
const userPoolosDiskSizeinGB = 50;
// Create additional user-defined agent pool

const userAgentPool = new containerservice.AgentPool(`${name}-userAgentPool`, {
    resourceGroupName: resourceGroup.name,
    resourceName: mycluster.name,
    agentPoolName: `${name}spot`, // Replace with your desired agent pool name
    count: userPoolnodecount, // Desired node count for user pool
    vmSize: "Standard_DS2_v2", // The size of the VMs in the pool Not enought quota
    type: "VirtualMachineScaleSets",
    osType: "Linux", // Operating system type
    mode: "User", // Mode must be 'User' for additional agent pools
    osDiskSizeGB: userPoolosDiskSizeinGB, // OS Disk Size in GB
    tags: {"Name": `${name}-userAgentPool`},
    maxCount: userPoolmaxcount, // Maximum number of nodes for autoscaling
    minCount: userPoolmincount, // Minimum number of nodes for autoscaling
    enableAutoScaling: true, // Enable autoscaling.  Required to make use of minCount and maxCount and spot
    scaleSetPriority: "Spot",
    spotMaxPrice: -1,
    scaleSetEvictionPolicy: "Delete",
    //nodeLabels: {"cluster-autoscaler-enabled=true,cluster-autoscaler-name=": pulumi.interpolate`${mycluster.name}`},
},{parent: mycluster, dependsOn: [mycluster]});

export const user_agentpool_name = userAgentPool.name;
export const useragentpool_agentpoolname = userAgentPool.id;


// Export the kubeconfig for the AKS cluster
// Breaking up into multiple steps so we can make it a secrets and it is easier to read
const creds = containerservice.listManagedClusterUserCredentialsOutput({
    resourceGroupName: resourceGroup.name,
    resourceName: mycluster.name,
});

const encoded = creds.kubeconfigs[0].value;
// Export the kubeconfig as a secret
export const kubeconfig = pulumi.secret(encoded.apply(enc => Buffer.from(enc, "base64").toString()));

const k8sprovider = new k8s.Provider(`${name}-k8sprovider`, {
    kubeconfig: kubeconfig,
}, {dependsOn: mycluster});


// Create a Metrics Namespace
const grafana_k8s_monitoring_namespace = new k8s.core.v1.Namespace(`${name}-monitoring-ns`, 
  {}, 
  { provider: k8sprovider, dependsOn: [k8sprovider]});

export const namespace_grafana_k8s_monitoring = grafana_k8s_monitoring_namespace.metadata.name;

// Creating a helm release for prometheus metrics, loki, tempo, and opencost
// https://github.com/grafana/helm-charts/blob/main/charts/grafana/README.md
// https://artifacthub.io/packages/helm/prometheus-community/prometheus

const grafana_k8s_monitoring = new k8s.helm.v3.Release(`${name}-k8smonitoring-helm`, {
    chart: "k8s-monitoring",
    version: "0.10.0",
    namespace: grafana_k8s_monitoring_namespace.metadata.name,
    repositoryOpts: {
        repo: "https://grafana.github.io/helm-charts",
    },
    values: {
      cluster: { name: mycluster.name },
      externalServices: {
            prometheus: {
              host: "https://prometheus-prod-13-prod-us-east-0.grafana.net",
              basicAuth: {
                username: grafana_prometheus_user,
                password: grafanaauth,
              },
            },
            loki: {
              host: "https://logs-prod-006.grafana.net",
              basicAuth: {
                username: grafana_loki_user,
                password: grafanaauth,
              },
            },
            tempo: {
              host: "https://tempo-prod-04-prod-us-east-0.grafana.net",
              basicAuth: {
                username: grafana_tempo_user,
                password: grafanaauth,
              },
            },
      },
    opencost: {
      opencost: {
        exporter: {
          defaultClusterId: mycluster.name,
        },
        prometheus: {
          external: {
            url: "https://prometheus-prod-13-prod-us-east-0.grafana.net/api/prom",
          },
        },
      },
    },
    traces: {
      enabled: true,
    },
  },
  }, { provider: k8sprovider, deleteBeforeReplace: true , parent: grafana_k8s_monitoring_namespace, dependsOn: [grafana_k8s_monitoring_namespace] });

  // Export the prometheus metrics helmrelease name
export const helm_chart_grafana_k8s_monitoring = grafana_k8s_monitoring.name;

// Create a Kubecost Namespace
const kubecost_namespace = new k8s.core.v1.Namespace(`${name}-kubecost-ns`, 
  {}, 
  { provider: k8sprovider, dependsOn: [k8sprovider] });

  export const namespace_kubecost = kubecost_namespace.metadata.name;

// Creating a helm release for kube cost
// https://github.com/kubecost/cost-analyzer-helm-chart
const kubecostchart = new k8s.helm.v3.Release(`${name}-kubecosthelm`, {
    chart: "cost-analyzer",
    version: "2.0.2",
    namespace: kubecost_namespace.metadata.name,
    repositoryOpts: {
        repo: "https://kubecost.github.io/cost-analyzer/",
    },
    values: {
      kubecostToken: kubecost_token,
      networkCosts: {
        enabled: true,
      },
      //persistentVolume: {
      //  size: "18Gi",
      //  dbSize: "18Gi",
      //},
      prometheus: {
        server:{
          retention: "1d",
          global: { external_labels: {cluster_id: mycluster.name}}, // Found in https://github.com/kubecost/cost-analyzer-helm-chart/blob/develop/cost-analyzer/values.yaml#L838
        },
        kubeStateMetrics: {
          enabled: false,
        },
        serviceAccounts: {
          nodeExporter: {
            create: false,
          },
        },
        nodeExporter: {
          enabled: false,
        },
      },
    }
  }, { provider: k8sprovider, parent: kubecost_namespace, dependsOn: [kubecost_namespace, grafana_k8s_monitoring]});
  
// export the kubecost helmrelease name
export const helm_chart_kubecost = kubecostchart.name;

  // Extract the subscription ID from the resource group ID for cluster autoscaler.
export const subscriptionID = resourceGroup.id.apply(myrg => myrg.split("/")[2]);
const current = azuread.getClientConfig({});
export const tenantid = current.then(mycurrent=>mycurrent.clientId)

// Creating a helm release for cluster autoscaler
// https://artifacthub.io/packages/helm/cluster-autoscaler/cluster-autoscaler#azure
// Need the below for cluster autoscaler to pick up the nodegroups
const nodegroupautodiscovery = pulumi.interpolate`label:cluster-autoscaler-enabled=true,cluster-autoscaler-name=${mycluster.name}`;

const cluster_autoscaler = new k8s.helm.v3.Release(`${name}-cluster-autoscalerhelmr`, {
    chart: "cluster-autoscaler",
    version: "9.35.0",
    namespace: "kube-system",
    name: "cluster-autoscaler",
    repositoryOpts: {
        repo: "https://kubernetes.github.io/autoscaler",
    },
    values: {
      autoDiscovery: {
        cluster_name: mycluster.name,
        labels: {"k8s-addon":"cluster-autoscaler.addons.k8s.io","k8s-app":"cluster-autoscaler"}, // critical part, need this for it to show up
       },
      cloudProvider: "azure",
      azureClientID: adApp.clientId,
      azureClientSecret: ad_sp_password.value,
      azureSubscriptionID: subscriptionID,
      azureTenantID: tenantid,
      azureResourceGroup: resourceGroup.name,
      azureVMType: "vmss",
      AZURE_VMSS_CACHE_TTL: "60",
      extraArgs: {
        "balance-similar-node-groups": true,
        "skip-nodes-with-system-pods": false,
        "expander": "least-waste",
        "node-group-auto-discovery": nodegroupautodiscovery,
      },
      }
  }, { provider: k8sprovider, parent: grafana_k8s_monitoring, dependsOn: [grafana_k8s_monitoring] });

// export the cluster autoscaler helmrelease name
export const helm_chart_cluster_autoscaler = cluster_autoscaler.name;