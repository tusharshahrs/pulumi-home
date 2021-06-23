import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as web from "@pulumi/azure-native/web";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("resourcegroup_functions");

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount("storageaccount", {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
});

// Create a consumption plan
const plan = new web.AppServicePlan("consumption-plan", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    kind: "functionapp",
    sku: {
        name: "Y1",
        tier: "Dynamic",
    },
});

// Export the Azure Resource Group
export const resourcegroup = resourceGroup.name;

// Export the Storage Account
export const storageaccount = storageAccount.name;

// Export the Consumption Plan
export const consumptionplan = plan.name;

// List of storage account keys 
const storageAccountKeys = pulumi.all([resourceGroup.name, storageAccount.name]).apply(([resourceGroupName, accountName]) =>
    storage.listStorageAccountKeys({ resourceGroupName, accountName }));

// Export the primary key of the Storage Account
export const primaryStorageKey = pulumi.secret(storageAccountKeys.keys[0].value);

// Build a storage connection string out of it:
const storageConnectionString = pulumi.interpolate`DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${primaryStorageKey}`;