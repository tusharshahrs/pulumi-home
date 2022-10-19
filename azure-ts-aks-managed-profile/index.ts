import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as containerservice from "@pulumi/azure-native/containerservice";
import * as azuread from "@pulumi/azuread";
import * as tls from "@pulumi/tls";


const name = "demo11";
// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`${name}-rg`);

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount(`${name}sa`, {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
});

// Export the primary key of the Storage Account
const storageAccountKeys = storage.listStorageAccountKeysOutput({
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name
});

export const primaryStorageKey = pulumi.secret(storageAccountKeys.keys[0].value);

const current = azuread.getClientConfig({});
const current_clientid = current.then(mycurrent=>mycurrent.clientId)
const current_id = current.then(mycurrent=>mycurrent.id)
const current_tenantid = current.then(mycurrent=>mycurrent.clientId)

// Create an AD Service Principal
const adApp = new azuread.Application(`${name}-aad-application`,
    {
        displayName:`${name}-aad-application`,
    });

export const adApp_name = adApp.id;

const adSp = new azuread.ServicePrincipal(`${name}-ad-sp`,
{
    applicationId: adApp.applicationId,
}, {parent: adApp, dependsOn: adApp});

export const ad_sp_name = adSp.displayName;


// Create the SP Password
const adSpPassword = new azuread.ServicePrincipalPassword(`${name}-ad-sp-password`,
{
    servicePrincipalId: adSp.id,
    endDate: "2022-12-30T00:00:00Z"
}, {parent: adSp, dependsOn: adSp})

export const adSpPassword_info = adSpPassword.id;

// Generate an SSH Key
const sshKey = new tls.PrivateKey(`${name}-ssh-key`, {
    algorithm: "RSA",
    rsaBits: 4096,
});

const cluster = new containerservice.ManagedCluster(`${name}-managedcluster`, {
    resourceGroupName: resourceGroup.name,
    aadProfile: {enableAzureRBAC: true, managed: true, tenantID: pulumi.interpolate`${current_tenantid}`}, // After 1st pulumi up, comment this out.
    //aadProfile: {enableAzureRBAC: false, managed: true, tenantID: pulumi.interpolate`${current_tenantid}`, adminGroupObjectIDs: ["Test"]},  // Uncomment this and run pulumi up.  The preview shows create-replace of entire cluster.
    agentPoolProfiles: [{
        count: 3,
        maxPods: 11,
        mode: "System",
        name: "agentpool",
        nodeLabels: {},
        osDiskSizeGB: 30,
        osType: "Linux",
        type: "VirtualMachineScaleSets",
        vmSize: "Standard_DS2_v2",
    }],
    dnsPrefix: resourceGroup.name,
    enableRBAC: true,
    kubernetesVersion: "1.24.6",
    linuxProfile: {
        adminUsername: "testuser",
        ssh: {
            publicKeys: [{
                keyData: sshKey.publicKeyOpenssh,
            }],
        },
    },
    nodeResourceGroup: `${name}-managedcluster-ng`,
    servicePrincipalProfile: {
        clientId: adApp.applicationId,
        secret: adSpPassword.value,
    },
}, {dependsOn: [adSpPassword, adApp]});

export const managedcluster_name = cluster.name;
export const managedcluster_aadprofile = cluster.aadProfile;
