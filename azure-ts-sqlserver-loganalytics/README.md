# Deploying Azure SQL Server and Database with Auditing using Log Analytics

Deploys Azure SQL Server and Database with Auditing using Log Analytics


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

    View Live: https://app.pulumi.com/shaht/azure-ts-sqlserver-loganalytics/dev/updates/226

        Type                                                Name                                 Status      
    +   pulumi:pulumi:Stack                                 azure-ts-sqlserver-loganalytics-dev  created     
    +   ├─ azure-native:resources:ResourceGroup             loganalytics-rg                      created     
    +   │  ├─ azure-native:operationalinsights:Workspace    loganalytics-workspace               created     
    +   │  ├─ azure-native:sql:Server                       sqlserver                            created     
    +   │  │  ├─ azure-native:sql:ServerBlobAuditingPolicy  serverblobauditingpolicy             created     
    +   │  │  ├─ azure-native:sql:Database                  sqldatabase                          created     
    +   │  │  └─ azure-native:insights:DiagnosticSetting    diagnosticsetting                    created     
    +   │  └─ azure-native:storage:StorageAccount           loganalyticssa                       created     
    +   └─ random:index:RandomPassword                      sqlseverpassword                     created     
    
    Outputs:
        loganalytics_workspace_name: "loganalytics-workspace4931f9e9"
        resourcegroup_name         : "loganalytics-rg99d2cc8a"
        sql_password               : "[secret]"
        sql_user                   : "pulumiadmin"
        sqlserver_database_name    : "sqldatabase"
        sqlserver_name             : "sqlserverff648141"
        storageaccount_name        : "loganalyticssa65496eb1"
    ```
1. Check the Outputs
   ```bash
   pulumi stack output
   ```

   Returns:
   ```bash
    Current stack outputs (7):
    OUTPUT                       VALUE
    loganalytics_workspace_name  loganalytics-workspace4931f9e9
    resourcegroup_name           loganalytics-rg99d2cc8a
    sql_password                 [secret]
    sql_user                     pulumiadmin
    sqlserver_database_name      sqldatabase
    sqlserver_name               sqlserverff648141
    storageaccount_name          loganalyticssa65496eb1
   ```

1. Check the Azure portal to validate that the Azure SQL Auditing is turned on at the database level.

1. Destroy the Stack
   ```bash
   pulumi destroy -y
   ```

   Note:  The `serverblobauditingpolicy` resource is not getting deleted correctly.
   Current workaround,
   - Go to Azure portal and find the **SQL Server**.
   - Delete the SQL Server
   - Go back to the command-line and type in `pulumi destroy -y -r`.  The `-r` will refresh the state file before deleting the resources.

1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```