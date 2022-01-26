import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as datalakestore from "@pulumi/azure-native/datalakestore";
import * as random from "@pulumi/random";
import * as synapse from "@pulumi/azure-native/synapse";

const name = "demo";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`${name}-resourcegroup`);

// Create sql admin login password
const sqlAdministratorLoginPassword = new random.RandomPassword(`${name}-randompassword`, {
    length: 16,
    special: true,
    overrideSpecial: `_!-%`,

});

// Create a datalakestore account
const datalake = new datalakestore.Account(`${name}datalakest`, {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    encryptionState: "Enabled",
    identity: {
        type: "SystemAssigned",
    },
});

// create a synapse workspace
const synapse_workspace = new synapse.Workspace(`${name}-workspace`, {
    resourceGroupName: resourceGroup.name,
    defaultDataLakeStorage: {
        filesystem: "default",
        accountUrl: pulumi.interpolate`https://${datalake.name}.dfs.core.windows.net`,
    },
    identity: {
        type: "SystemAssigned",
   },
   managedVirtualNetwork: "default",
            managedVirtualNetworkSettings: {
                allowedAadTenantIdsForLinking: [],
                preventDataExfiltration: true,
            },
   sqlAdministratorLogin: "demouser",
   sqlAdministratorLoginPassword: sqlAdministratorLoginPassword.result,

});

// Create a synapse sqlpool 
const sqlpoolsynapse = new synapse.SqlPool(`${name}sqlpool`, {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    storageAccountType:"LRS",
    workspaceName: synapse_workspace.name,
});

// https://www.pulumi.com/docs/reference/pkg/azure-native/synapse/workspacesqlaadadmin/#administratortype_nodejs
// This is throwing an error.
// regardless of the user email that we put in login:..., we get an error due to active directory.
/*const workspaceAadAdmin= new synapse.WorkspaceSqlAadAdmin(`${name}-Workspacesqlaadadmin`, {
    resourceGroupName: resourceGroup.name,
    administratorType: "ActiveDirectory",
    login: "bob@contoso.com",
    workspaceName: synapse_workspace.name,
});

//export const workspaceAadAdmin_name = workspaceAadAdmin;
*/

// Outputs
export const resource_group_name =resourceGroup.name;
export const sql_admin_password =sqlAdministratorLoginPassword.result;
export const datalake_store_account =datalake.name;
export const datalake_store_endpoint =datalake.endpoint;
export const datalake_store_account_url = pulumi.interpolate`https://${datalake.name}.dfs.core.windows.net`
export const synapse_workspace_name =synapse_workspace.name;
export const sql_pool_synapse_name = sqlpoolsynapse.name;