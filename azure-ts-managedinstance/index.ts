import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as network from "@pulumi/azure-native/network";
import * as sql from "@pulumi/azure-native/sql";
import * as random from "@pulumi/random";
import { AddressPrefixType } from "@pulumi/azure-native/network/v20210201preview";

// prefix
const name = "demo";

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
const storageAccountKeys = pulumi.all([resourceGroup.name, storageAccount.name]).apply(([resourceGroupName, accountName]) =>
    storage.listStorageAccountKeys({ resourceGroupName, accountName }));
const primaryStorageKey = storageAccountKeys.keys[0].value;

// Create random password for sql admin
const sqlpassword = new random.RandomPassword(`${name}-sqlseverpassword`, {
    length: 16,
    minLower: 4,
    minUpper: 4, 
    number: true,
    minNumeric: 4,
    special: false,
    });

// create a managedinstance user
export const username = "pulumiadmin";

// create vnet
const virtualnetwork = new network.VirtualNetwork(`${name}-vnet`,{
    resourceGroupName: resourceGroup.name,
    addressSpace: {
        addressPrefixes: ["10.0.0.0/23"],
    },
});

// create subnet 1
const subnet1 = new network.Subnet(`${name}-subnet1`,{
    resourceGroupName: resourceGroup.name,
    virtualNetworkName: virtualnetwork.name,
    addressPrefix: "10.0.0.0/24",
    delegations: [{
        name: `${name}-subnet1-delegation`,
        serviceName: "Microsoft.Sql/managedInstances",
    }],
});

// create subnet 2
const subnet2 = new network.Subnet(`${name}-subnet2`,{
    resourceGroupName: resourceGroup.name,
    virtualNetworkName: virtualnetwork.name,
    addressPrefix: "10.0.1.0/24",
    delegations: [{
        name: `${name}-subnet2-delegation`,
        serviceName: "Microsoft.Sql/managedInstances",
        }],
});

// Strongly Advising NOT to create this resource via code because it takes hours to create in the azure portal.  The resource will most likely
// timeout on creation even if you use the customtimeout unless you know how long it takes by already creating the managedinstance in the azure portal.
/*
const managedInstance = new sql.ManagedInstance(`${name}-managedinstance`, {
    resourceGroupName: resourceGroup.name,
    administratorLogin: username,
    administratorLoginPassword: sqlpassword.result,
    licenseType: "LicenseIncluded",
    publicDataEndpointEnabled: false,
    collation: "SQL_Latin1_General_CP1_CI_AS",
    minimalTlsVersion: "1.2",
    sku: {
        name: "GP_Gen5",
        tier: "GeneralPurpose",
    },
    storageSizeInGB: 32,
    subnetId: subnet1.id,
    timezoneId: "UTC",
    vCores: 4,
}, {customTimeouts: { create: "240m"}});
*/

// Code from Importing the Resource.  This will be generated on the cli and you have to bring it inside the index.ts file.
// Note, that I swapped out some of the hard coded stuff with variable from above to make it easier.
// Also, you have to update the following with your subsription_id:  REPLACE_WITH_YOUR_SUBSCRIPTION_ID
/*
const demoinstance = new sql.ManagedInstance("demoinstance", {
    administratorLogin: username,
    collation: "SQL_Latin1_General_CP1_CI_AS",
    identity: {
        type: "SystemAssigned",
    },
    licenseType: "LicenseIncluded",
    location: "eastus2",
    maintenanceConfigurationId: "/subscriptions/REPLACE_WITH_YOUR_SUBSCRIPTION_ID/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/SQL_Default",
    managedInstanceName: "tusharshah",
    minimalTlsVersion: "1.2",
    proxyOverride: "Proxy",
    publicDataEndpointEnabled: false,
    resourceGroupName: resourceGroup.name,
    sku: {
        capacity: 4,
        family: "Gen5",
        name: "GP_Gen5",
        tier: "GeneralPurpose",
    },
    storageAccountType: "GRS",
    storageSizeInGB: 32,
    subnetId: subnet2.id,
    timezoneId: "UTC",
    vCores: 4,
    zoneRedundant: false,
}, {
    protect: false,
});
*/

export const resource_group_name = resourceGroup.name;
export const storage_account_name = storageAccount.name;
export const managedinstance_password = pulumi.secret(sqlpassword.result);
export const virtualnetwork_name = virtualnetwork.name;
export const subnet1_name = subnet1.name;
export const subnet2_name = subnet2.name;
//export const managedinstance_name = managedInstance.id;