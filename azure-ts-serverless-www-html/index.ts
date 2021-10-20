import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";

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
}, {parent: resourceGroup});

// Export the primary key of the Storage Account
const storageAccountKeys = pulumi.all([resourceGroup.name, storageAccount.name]).apply(([resourceGroupName, accountName]) =>
    storage.listStorageAccountKeys({ resourceGroupName, accountName }));
const primaryStorageKey = storageAccountKeys.keys[0].value;

const storageaccountstaticwebsite = new storage.StorageAccountStaticWebsite(`${name}-StorageAccountStaticWebsite`, {
    accountName: storageAccount.name,
    resourceGroupName: resourceGroup.name,
    //error404Document: "./www/404.html",
    //error404Document: "./www/404.html",
    error404Document: "404.html",
    indexDocument: "index.html",
}, {parent: storageAccount})
/*
// Creates BlobContainer.  This is a requirement for the storage blob.
const blobContainer = new storage.BlobContainer(`${name}-blobContainer`, {
    accountName: storageAccount.name,
    resourceGroupName: resourceGroup.name,
    publicAccess: "Blob",
});
*/

export const resource_group_name = resourceGroup.name;
export const storage_account_name = storageAccount.name;
export const primarystoragekey = pulumi.secret(primaryStorageKey);
export const storageaccountstaticwebsite_container_name = storageaccountstaticwebsite.containerName;
export const storageaccountstaticwebsite_container_indexDocument = storageaccountstaticwebsite.indexDocument;
export const primaryEndpoints = storageAccount.primaryEndpoints.web;
