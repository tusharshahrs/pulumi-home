import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as network from "@pulumi/azure-native/network";
import * as azuread from "@pulumi/azuread";
import * as random from "@pulumi/random";
import * as tls from "@pulumi/tls";
import * as containerservice from "@pulumi/azure-native/containerservice";
import * as k8s from "@pulumi/kubernetes";

// variable name
const name = "shaht1";
// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`${name}-rg`, 
    {tags: {"Name": `${name}-rg`}});

export const resourceGroupName = resourceGroup.name;

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount(`${name}sa`, {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
    tags: {"Name": `${name}sa`},
});

export const storageAccountName = storageAccount.name;

// Export the primary key of the Storage Account
const storageAccountKeys = storage.listStorageAccountKeysOutput({
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name
});

export const primaryStorageKey = pulumi.secret(storageAccountKeys.keys[0].value);


// Create an Azure Virtual Network
const virtualNetwork = new network.VirtualNetwork(`${name}-vnet`, {
    resourceGroupName: resourceGroup.name,
    addressSpace: {
        addressPrefixes: ["10.0.0.0/21"],
    },
    tags: {"Name": `${name}-vnet`},
}, {parent: resourceGroup});

export const virtualNetworkname = virtualNetwork.name;

/*
https://www.davidc.net/sites/default/subnets/subnets.html
VNET: 10.0.0.0 Mask Bits: 21
Subnet address	Range of addresses	Useable IPs	Hosts	Divide	Join
10.0.0.0/24	10.0.0.0 - 10.0.0.255	10.0.0.1 - 10.0.0.254	254	Divide   // DON"T USE THIS				
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
let my_previous_subnet = null;
// Create 3 public subnets
for (let i = 1; i <= 3; i++) {
    const subnet  = new network.Subnet(`${name}-publicSubnet${i}`, {
        resourceGroupName: resourceGroup.name,
        virtualNetworkName: virtualNetwork.name,
        addressPrefix: `10.0.${i}.0/24`, // Increment the third octet for each subnet
        
    }, {parent: virtualNetwork});
    //publicSubnetIds.push(subnet.id);
    publicSubnets.push(subnet);
}

// Create 3 private subnets
for (let i = 4; i <= 6; i++) {
    const subnet = new network.Subnet(`${name}-privateSubnet${i}`, {
        resourceGroupName: resourceGroup.name,
        virtualNetworkName: virtualNetwork.name,
        addressPrefix: `10.0.${i}.0/24`, // Increment the third octet for each subnet
    }, 
    {parent: virtualNetwork, dependsOn: publicSubnets[i-3]});
    //{parent: virtualNetwork});
    //privateSubnetIds.push(subnet.id);
    privateSubnets.push(subnet);
}

export const publicSubnetNames = publicSubnets.map(sn => sn.name);
export const privateSubnetNames = privateSubnets.map(sn => sn.name);



// Create an AD Application. Pre-Req for service principal
const adApp = new azuread.Application(`${name}-aad-application`,
    {
        displayName:`${name}-aad-application`,
    });

export const azuread_application_id = adApp.id;

export const azuread_application_display_name = adApp.displayName;

// Generate random password for the service principal
/*
const password = new random.RandomPassword(`${name}-password`, {
    length: 20,
    special: true,
    upper: true,
    lower: true,
    number: true,
});

export const randompassword = password.result;
*/
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
const sshkey = new tls.PrivateKey(`${name}-ssh-private-key`, {
    //algorithm: "ECDSA",
    //ecdsaCurve: "P384",
    algorithm: "RSA",
    rsaBits: 4096,
});

// Export the subnet IDs
//export const publicSubnetsIds = pulumi.all(publicSubnetIds);
//export const privateSubnetsIds = pulumi.all(privateSubnetIds);

const nodeCount = 3;
const maxPodsCount = 10;
const osDiskSizeinGB = 30;
const vmSizeInfo = "Standard_DS2_v2";

const cluster = new containerservice.ManagedCluster(`${name}-managedcluster`, {
    resourceGroupName: resourceGroup.name,
    
    agentPoolProfiles: [{
        count: nodeCount,
        maxPods: maxPodsCount,
        mode: "System",
        name: "agentpool",
        nodeLabels: {},
        osDiskSizeGB: osDiskSizeinGB,
        osType: "Linux",
        type: "VirtualMachineScaleSets",
        vmSize: "Standard_DS2_v2",
        //vnetSubnetID: publicSubnets[0].id,
        //vnetSubnetID: publicSubnets[0].id,
        //vnetSubnetID: privateSubnets[2].id,
    }],
    dnsPrefix: resourceGroup.name,
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
    nodeResourceGroup: `${name}-managedcluster-ng`,
    networkProfile: {
        // https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni?tabs=configure-networking-portal
        //networkPolicy: "calico",
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
}, {deleteBeforeReplace: true,dependsOn: [adSp, adApp,virtualNetwork]});

export const cluster_name = cluster.name;
export const cluster_k8s_version = cluster.kubernetesVersion;

// Export the kubeconfig for the AKS cluster
export const kubeconfig = pulumi.all([cluster.name, resourceGroup.name]).apply(([name, rgName]) =>
    containerservice.listManagedClusterUserCredentials({
        resourceName: name,
        resourceGroupName: rgName,
    }).then(creds => {
        const encoded = creds.kubeconfigs[0].value;
        return Buffer.from(encoded, 'base64').toString();
    })
);

const creds = containerservice.listManagedClusterUserCredentialsOutput({
    resourceGroupName: resourceGroup.name,
    resourceName: cluster.name,
});


// Export the kubeconfig for the AKS cluster
export const kubeconfig2 =
    creds.kubeconfigs[0].value
        .apply(enc => Buffer.from(enc, "base64").toString());