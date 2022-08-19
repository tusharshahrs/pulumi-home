import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as synapse from "@pulumi/azure-native/synapse/v20210601preview";
import * as datalakestore from "@pulumi/azure-native/datalakestore";

const name = "demo";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`${name}-rg`);

// Export resource group name
export const resource_group_name = resourceGroup.name;

// Create a datalakestore account
const datalake = new datalakestore.Account(
  `${name}datalakest`,
  {
    resourceGroupName: resourceGroup.name,
    encryptionState: "Enabled",
    identity: {
      type: "SystemAssigned",
    },
  },
  { parent: resourceGroup, dependsOn: resourceGroup }
);

// Export datalake store name
export const datalake_storage_name = datalake.name;

// create a synapse workspace.  This is required for bigdatapool
const synapse_workspace = new synapse.Workspace(
  `${name}-workspace`,
  {
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
  },
  { parent: datalake, dependsOn: datalake }
);

export const synapse_workspace_name = synapse_workspace.name;

// create a bigdatapool
const bdp = new synapse.BigDataPool(
  `${name}bdp1`,
  {
    resourceGroupName: resourceGroup.name,
    sparkVersion: "3.1",
    workspaceName: synapse_workspace.name,
    // Commented out the library requirements block below due to the following error when running pulumi up:
    // Synapse Spark pool must be created before libraries are installed.
    //libraryRequirements: {
    //   content: "pyproj==3.8.0\r\nowslib==0.25.0\r\n",
    //   filename: "requirements.txt",
    // },
    nodeSize: synapse.NodeSize.Small,
    nodeSizeFamily: synapse.NodeSizeFamily.MemoryOptimized,
    nodeCount: 3,
    autoPause: {
      delayInMinutes: 10,
      enabled: true,
    },
    autoScale: {
      enabled: true,
      minNodeCount: 3,
      maxNodeCount: 10,
    },
    dynamicExecutorAllocation: {
      enabled: true,
      minExecutors: 4,
      maxExecutors: 9,
    },
    sessionLevelPackagesEnabled: true,
    tags: {
      "created-by": `${name}bdp1`,
    },
  },
  { parent: synapse_workspace, dependsOn: synapse_workspace }
);

export const big_data_pool_name = bdp.name;
