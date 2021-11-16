import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as datafactory from "@pulumi/azure-native/datafactory";


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



const factory = new datafactory.Factory(`${name}-factory`, {
    resourceGroupName: resourceGroup.name,
    identity: {type: "SystemAssigned"}
});


export const resource_group_name = resourceGroup.name;
export const storage_group_name = storageAccount.name
export const datafactory_name = factory.name;