import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as azure from "@pulumi/azure";

const config = new pulumi.Config();
const id1 = config.getSecret("objectid_azure_ad_user_1")
const id2 = config.getSecret("objectid_azure_ad_user_2")

const name = "demo"
// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`${name}-rg`);

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount(`${name}sa`, {
    resourceGroupName: resourceGroup.name,
    isHnsEnabled: true,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
});

// Export the primary key of the Storage Account
const storageAccountKeys = pulumi.all([resourceGroup.name, storageAccount.name]).apply(([resourceGroupName, accountName]) =>
    storage.listStorageAccountKeys({ resourceGroupName, accountName }));
export const primaryStorageKey = pulumi.secret(storageAccountKeys.keys[0].value);

const datalake2filesystem = new azure.storage.DataLakeGen2Filesystem(`${name}-dlakegen2fs`, {
    storageAccountId: storageAccount.id,
    properties: {
        hello: "aGVsbG8=",
    },
});

const datalakegen2path = new azure.storage.DataLakeGen2Path(`${name}-datalakegen2path`, {
    path: "enreched",
    filesystemName: datalake2filesystem.name,
    storageAccountId: storageAccount.id,
    resource: "directory",
    aces: [
        {   
            id: id1,
            permissions: "r--" ,
            type: 'user',
        },
         {
            id: id2,
            permissions: "r--",
            type: 'user',
        },
    ]
});

export const resourcegroup_name = resourceGroup.name;
export const storageaccount_name = storageAccount.name;
export const datalakegen2filesystem_name = datalake2filesystem.name;
export const datalakegen2path_id = datalakegen2path.id;
export const datalakegen2path_aces = datalakegen2path.aces;