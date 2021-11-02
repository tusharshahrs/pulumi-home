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

// StaticWebsite index.html and 404.html
const staticWebsite = new storage.StorageAccountStaticWebsite(`${name}-staticwebsite`, {
    accountName: storageAccount.name,
    resourceGroupName: resourceGroup.name,
    indexDocument: "index.html",
    error404Document: "404.html",
}, {parent: storageAccount});

// Upload the files.  The index.html and the 404.html file are in the www folder.
["index.html", "404.html"].map(filename =>
    new storage.Blob(filename, {
        resourceGroupName: resourceGroup.name,
        accountName: storageAccount.name,
        containerName: staticWebsite.containerName,
        source: new pulumi.asset.FileAsset(`./www/${filename}`),
        type: "Block", // The endpoint url works only if this line is in here.
        contentType: "text/html",
    }),
);

export const resource_group_name = resourceGroup.name;
export const storage_account_name = storageAccount.name;
export const staticEndpoint = storageAccount.primaryEndpoints.web;