import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure";

const name = "demo";

const resourceGroup = new azure.core.ResourceGroup(`${name}-rg`);
const factory = new azure.datafactory.Factory(`${name}-datafactory`, {
    resourceGroupName: resourceGroup.name,
    identity: {type: "SystemAssigned"},
});

export const resource_group_name = resourceGroup.name;
export const datafactory_name = factory.name;