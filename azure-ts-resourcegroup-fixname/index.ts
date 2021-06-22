import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("resourceGroup", {
    resourceGroupName: "rg-tvserver-test",
});

// Export the Azure Resource Group
export const resourcegroup = resourceGroup.name;