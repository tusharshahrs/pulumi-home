# Deploying Azure SQL Server and Database with Auditing using Log Analytics in GO

Deploys Azure SQL Server and Database with Auditing using Log Analytics in GO


## Deployment

1. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step)

    ```bash
    az login
    ```

1. Create a new stack:

    ```bash
    pulumi stack init dev
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

    View Live: https://app.pulumi.com/myuser/azure-go-sqlserver-loganalytics/dev/updates/19

        Type                                                    Name                                 Status       
    +   pulumi:pulumi:Stack                                     azure-go-sqlserver-loganalytics-dev  created     
    +   ├─ azure-native:resources:ResourceGroup                 loganalytics-rg                      created     
    +   ├─ random:index:RandomPassword                          loginpassword                        created     
    +   ├─ azure-native:operationalinsights:Workspace           loganalytics-workspace               created     
    +   ├─ azure-native:sql:Server                              sqlserver                            created     
    +   ├─ azure-native:storage:StorageAccount                  loganalyticssa                       created     
    +   ├─ azure-native:sql:ExtendedServerBlobAuditingPolicy    extendedServerBlobAuditingPolicy     created     
    +   ├─ azure-native:sql:Database                            sqldatabase                          created     
    +   ├─ azure-native:insights:DiagnosticSetting              diagnosticSetting                    created     
    +   └─ azure-native:sql:ExtendedDatabaseBlobAuditingPolicy  extendedDatabaseBlobAuditingPolicy   created     
    
    Outputs:
        diagnosticSetting                : "diagnosticSetting6bd61604"
        extendeddatabaseblobauditing_name: "Default"
        extendedserverblobauditing_name  : "Default"
        loganalytic_sworkspace_name      : "loganalytics-workspace21327617"
        primarystoragekey                : "[secret]"
        resourcegroup_name               : "loganalytics-rg00f18358"
        sqladmin_password                : "[secret]"
        sqladmin_user                    : "pulumiadmin"
        sqlserver_database_name          : "sqldatabase"
        sqlserver_name                   : "sqlserver0221fd97"
        storageaccount_name              : "loganalyticssa4af24ad9"

    Resources:
        + 10 created

    Duration: 2m38s
    ```
1. Check the Outputs
   ```bash
   pulumi stack output
   ```
   Returns:
   ```
    Current stack outputs (11):
        OUTPUT                             VALUE
        diagnosticSetting                  diagnosticSetting6bd61604
        extendeddatabaseblobauditing_name  Default
        extendedserverblobauditing_name    Default
        loganalytic_sworkspace_name        loganalytics-workspace21327617
        primarystoragekey                  [secret]
        resourcegroup_name                 loganalytics-rg00f18358
        sqladmin_password                  [secret]
        sqladmin_user                      pulumiadmin
        sqlserver_database_name            sqldatabase
        sqlserver_name                     sqlserver0221fd97
        storageaccount_name                loganalyticssa4af24ad9
   ```

1. Check the azure portal to validate that the Azure SQL Auditing is turned on at the database level.
   
   [Azure SQL Auditing sending to Log Analytics] Screen Pending

1. Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
   
   Note:  The `extendedserverblobauditing` resource is not getting deleted correctly.
   Current workaround,
    - go to azure portal and find the SQL Server.
    - Delete the SQL Server
    - go back to the command line and type in `pulumi refresh -y`
    - Run the destroy command again:  `pulumi destroy -y`

1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```