import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";


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

// Export the Azure Resource Group
export const resourcegroup = resourceGroup.name;

// Export the Storage Account
export const storageaccount = storageAccount.name;
