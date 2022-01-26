# Deploying Azure DatalakeStore with Synapse SQLPool

Deploys Azure [DatalakeStore](https://www.pulumi.com/registry/packages/azure-native/api-docs/datalakestore/) with [Synapse SqlPool](https://www.pulumi.com/registry/packages/azure-native/api-docs/synapse/sqlpool/)

## Deployment

1. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step)

    ```bash
    az login
    ```

1. Create a new stack:

    ```bash
    pulumi stack init dev
    ```
1. Install dependencies
    ```bash
    npm install
    ```
1. Configure the location to deploy the resources to.  The Azure region to deploy to is pre-set to **WestUS** - but you can modify the region you would like to deploy to.

    ```bash
    pulumi config set azure-native:location eastus2
    ```

1. Create that stack via `pulumi up`
    ```bash
    pulumi up -y
    ```

    The Result will be

    ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/azure-ts-synapse-workspace/dev/updates/7

        Type                                     Name                            Status      
    +   pulumi:pulumi:Stack                      azure-ts-synapse-workspace-dev  created     
    +   ├─ azure-native:resources:ResourceGroup  demo-resourcegroup              created     
    +   ├─ random:index:RandomPassword           demo-randompassword             created     
    +   ├─ azure-native:datalakestore:Account    demodatalakest                  created     
    +   ├─ azure-native:synapse:Workspace        demo-workspace                  created     
    +   └─ azure-native:synapse:SqlPool          demosqlpool                     created     
    
    Outputs:
        datalake_store_account    : "demodatalakest61978b52"
        datalake_store_account_url: "https://demodatalakest61978b52.dfs.core.windows.net"
        datalake_store_endpoint   : "demodatalakest61978b52.azuredatalakestore.net"
        resource_group_name       : "demo-resourcegroupba699aff"
        sql_admin_password        : "[secret]"
        sql_pool_synapse_name     : "demosqlpool"
        synapse_workspace_name    : "demo-workspace3352a864"

    Resources:
        + 6 created

    Duration: 12m39s
    ```
1. Check the Outputs
   ```bash
   pulumi stack output
   ```

   Returns:
   ```bash
    Current stack outputs (7):
    OUTPUT                      VALUE
    datalake_store_account      demodatalakest61978b52
    datalake_store_account_url  https://demodatalakest61978b52.dfs.core.windows.net
    datalake_store_endpoint     demodatalakest61978b52.azuredatalakestore.net
    resource_group_name         demo-resourcegroupba699aff
    sql_admin_password          [secret]
    sql_pool_synapse_name       demosqlpool
    synapse_workspace_name      demo-workspace3352a864
   ```

1. Destroy the Stack
   ```bash
   pulumi destroy -y
   ```

1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```