import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as web from "@pulumi/azure-native/web";
import * as managedidentity from "@pulumi/azure-native/managedidentity";
//import { ManagedIdentityType } from "@pulumi/azure-native/types/enums/appplatform/v20190501preview";
//import { ManagedServiceIdentityType } from "@pulumi/azure-native/types/enums/blueprint/v20171111preview";


const name = "demo";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`${name}-rg`);

const userIdentity = new managedidentity.UserAssignedIdentity(`${name}-userassignedidentity`, {
    resourceGroupName: resourceGroup.name,
});

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

// Build a storage connection string out of it
const storageConnectionString = pulumi.interpolate`DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${primaryStorageKey}`;

// Create a consumption plan
const plan = new web.AppServicePlan("consumption-plan", {
    resourceGroupName: resourceGroup.name,
    kind: "functionapp",
    reserved: true,
    sku: {
        name: "Y1",
        tier: "Dynamic",
    },
});

// Create the Function App
const app = new web.WebApp("functionapp", {
    resourceGroupName: resourceGroup.name,
    serverFarmId: plan.id,
    kind: "functionapp",
    //identity: {type: ManagedServiceIdentityType,userAssignedIdentities: useridentity_name},
    //identity: {userAssignedIdentities: userIdentity.id},
    siteConfig: {
        appSettings: [
            { name: "AzureWebJobsStorage", value: storageConnectionString },            
            { name: "FUNCTIONS_EXTENSION_VERSION", value: "~3" },            
            { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
            { name: "WEBSITE_NODE_DEFAULT_VERSION", value: "~14" },
            { name: "WEBSITE_RUN_FROM_PACKAGE", value: "https://github.com/tusharshahrs/demo/raw/main/content/lab/pulumi/azure-native/typescript/app.zip" },
        ]    
    },
});



// Export the Azure Resource Group
export const resourcegroup_name = resourceGroup.name;
// Export the Storage Account
export const storageaccount_name = storageAccount.name;
// Export the Consumption Plan
export const consumptionplan_name = plan.name;
// Export the ManagedIdentity
export const useridentity_name = userIdentity.name;