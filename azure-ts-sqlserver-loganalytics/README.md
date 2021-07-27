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

    View Live: https://app.pulumi.com/myuser/azure-ts-sqlserver-loganalytics/dev/updates/150

        Type                                                          Name                                 Status      
    +   pulumi:pulumi:Stack                                           azure-ts-sqlserver-loganalytics-dev  created     
    +   ├─ random:index:RandomPassword                                sqlseverpassword                     created     
    +   ├─ azure-native:resources:ResourceGroup                       loganalytics-rg                      created     
    +   ├─ azure-native:operationalinsights:Workspace                 loganalytics-workspace               created     
    +   ├─ azure-native:sql:Server                                    sqlserver                            created     
    +   │  ├─ azure-native:sql:Database                               sqldatabase                          created     
    +   │  │  ├─ azure-native:sql:ExtendedDatabaseBlobAuditingPolicy  extendeddatabaseblobauditingpolicy   created     
    +   │  │  └─ azure-native:insights:DiagnosticSetting              diagnosticsetting                    created     
    +   │  └─ azure-native:sql:ExtendedServerBlobAuditingPolicy       extendedserverblobauditingpolicy     created     
    +   └─ azure-native:storage:StorageAccount                        loganalyticssa                       created     
    
    Outputs:
        loganalytics_workspace_name      : "loganalytics-workspace74d41999"
        resourcegroup_name               : "loganalytics-rg6689aea7"
        sql_password                     : "[secret]"
        sql_user                         : "pulumiadmin"
        sqlserver_database_name          : "sqldatabase"
        sqlserver_name                   : "sqlserverf43911a4"
        storageaccount_name              : "loganalyticssa607b50fe"

    Resources:
        + 10 created
    ```
1. Check the Outputs
   ```bash
   pulumi stack output
   ```

   Returns:
   ```bash
    Current stack outputs (7):
        OUTPUT                       VALUE
        loganalytics_workspace_name  loganalytics-workspace74d41999
        resourcegroup_name           loganalytics-rg6689aea7
        sql_password                 [secret]
        sql_user                     pulumiadmin
        sqlserver_database_name      sqldatabase
        sqlserver_name               sqlserverf43911a4
        storageaccount_name          loganalyticssa607b50fe
   ```

1. Check the azure portal to validate that the Azure SQL Auditing is turned on at the database level.

   [Azure SQL Auditing sending to Log Analytics](https://share.getcloudapp.com/Kou4gEzl)

1. Destroy the Stack
   ```bash
   pulumi destoy -y
   ```

   Note:  The `extendedserverblobauditing` resource is not getting deleted correctly.
   Current workaround,
   - Go to azure portal and find the SQL Server.
   - Delete the SQL Server
   - Go back to the command line and type in `pulumi refresh -y`
   - Run the destroy command again:  `pulumi destroy -y`

1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```