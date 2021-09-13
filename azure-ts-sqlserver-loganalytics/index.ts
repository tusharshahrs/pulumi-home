import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as sql from "@pulumi/azure-native/sql";
import * as operationalinsights from "@pulumi/azure-native/operationalinsights";
import * as insights from "@pulumi/azure-native/insights";
import * as random from "@pulumi/random";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("loganalytics-rg");

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount("loganalyticssa", {
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
const sqlpassword = new random.RandomPassword("sqlseverpassword", {
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
const sqlServer = new sql.Server("sqlserver", {
    resourceGroupName: resourceGroup.name,
    administratorLogin: username,
    administratorLoginPassword: sqlpassword.result,
    version: "12.0",
}, {parent: resourceGroup });


// Enable log analytics for the sql server (master DB)
// Get the master DB
// Need to sleep a bit for the master DB to be created on the sql server before trying to use it.
// This doesn’t create the DB - it gets the auto-created master DB so that loganalytics can be enabled.
const masterDb = sqlServer.id.apply(async (id) => {
    await new Promise(f => setTimeout(f, 20000))
    const masterDbId = `${id}/databases/master`
    return(sql.Database.get("masterDb", masterDbId))
})

// create an Azure sql server database
const database = new sql.Database("sqldatabase", {
    resourceGroupName: resourceGroup.name,
    serverName: sqlServer.name,
    sku: {
        name: "S0",
    },
    
}, {parent: sqlServer, dependsOn: sqlServer});


// Create Azure log analytics workspace // https://www.pulumi.com/docs/reference/pkg/azure-native/operationalinsights/workspace/
const workspace = new operationalinsights.Workspace("loganalytics-workspace", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    sku: {
        name: "PerGB2018",
    },
}, {parent: resourceGroup });


// create diagnostic settings
const diagnosticSetting = new insights.DiagnosticSetting("diagnosticsetting", {
    logAnalyticsDestinationType: "Dedicated",
    logs: [
        {
        category: "SQLSecurityAuditEvents",
        enabled: true,
        retentionPolicy: {
            days: 0,
            enabled: false,
            },
        },
        {
            category: "DevOpsOperationsAudit",
            enabled: true,
            retentionPolicy: {
                days: 0,
                enabled: false,
                },
            },
    ],
    metrics: [{
        category: "AllMetrics",
        enabled: true,
        retentionPolicy: {
            days: 0,
            enabled: false,
        },
    }],
    resourceUri: masterDb.id,
    workspaceId: workspace.id,
},
{parent: sqlServer, dependsOn: masterDb});

const serverblobauditing = new sql.ServerBlobAuditingPolicy("serverblobauditingpolicy", {
    auditActionsAndGroups: [
        "SUCCESSFUL_DATABASE_AUTHENTICATION_GROUP",
        "FAILED_DATABASE_AUTHENTICATION_GROUP",
        "BATCH_COMPLETED_GROUP",
    ],
    isAzureMonitorTargetEnabled: true,
    isDevopsAuditEnabled: true,
    retentionDays: 0,
    resourceGroupName: resourceGroup.name,
    serverName: sqlServer.name,
    state: "Enabled",
},
{parent: sqlServer, dependsOn: sqlServer});

export const resourcegroup_name = resourceGroup.name;
export const storageaccount_name = storageAccount.name;
export const sql_user = username;
export const sql_password = sqlpassword.result;
export const sqlserver_name = sqlServer.name;
export const sqlserver_database_name = database.name;
export const loganalytics_workspace_name = workspace.name;