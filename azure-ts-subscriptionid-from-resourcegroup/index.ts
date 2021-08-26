import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";

// Create an Azure Resource Group
const my_name = "demo";
const resourceGroup = new resources.ResourceGroup(`${my_name}-rg`);
const subscriptionID = resourceGroup.id.apply(myrg => myrg.split("/")[2]);

export const myresourcegroup_name = resourceGroup.name;

export const subscriptionid = pulumi.secret(subscriptionID);