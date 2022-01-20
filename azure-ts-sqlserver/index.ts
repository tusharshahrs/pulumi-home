import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as sql from "@pulumi/azure-native/sql";
import * as random from "@pulumi/random";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("sqlserverfirewall-rg");

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount("sqlsrvfirewallsa", {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
}, {parent: resourceGroup });

// The primary key of the Storage Account
const storageAccountKeys = pulumi.all([resourceGroup.name, storageAccount.name]).apply(([resourceGroupName, accountName]) =>
    storage.listStorageAccountKeys({ resourceGroupName, accountName }));
const primaryStorageKey = storageAccountKeys.keys[0].value;

// Create random password for sql admin
const sqlpassword = new random.RandomPassword("sqlserverpassword", {
    length: 16,
    minLower: 4,
    minUpper: 4, 
    number: true,
    minNumeric: 4,
    special: false,
    });

// create sql admin user
const username = "pulumiadmin";

// create an Azure sql server
const sqlServer = new sql.Server("sqlserverfirewalls", {
    resourceGroupName: resourceGroup.name,
    administratorLogin: username,
    administratorLoginPassword: sqlpassword.result,
    version: "12.0",
}, {parent: resourceGroup });

// creates a firewall rule.  Note, that in Azure, 0.0.0.0 for start and end ip means internal
// as per https://www.pulumi.com/registry/packages/azure-native/api-docs/sql/firewallrule/#endipaddress_nodejs
// This also toggles the Allow Azure services and resources to access this server from No to Yes
const firewallRuleResource = new sql.FirewallRule("sqlserverfirewallRule", {
    resourceGroupName: resourceGroup.name,
    serverName: sqlServer.name,
    startIpAddress: "0.0.0.0",
    endIpAddress: "0.0.0.0",
});

export const resourcegroup_name = resourceGroup.name;
export const storageaccount_name = storageAccount.name;
export const sql_user = username;
export const sql_password = sqlpassword.result;
export const sqlserver_name = sqlServer.name;
export const sql_firewallrules = firewallRuleResource.name;