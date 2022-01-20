# Deploying Azure SQL Server with Firewall Rules

Deploys Azure SQL Server with [FirewallRule](https://www.pulumi.com/registry/packages/azure-native/api-docs/sql/firewallrule/)


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

    View Live: https://app.pulumi.com/shaht/azure-ts-sqlserver/dev/updates/6

        Type                                       Name                    Status      
    +   pulumi:pulumi:Stack                        azure-ts-sqlserver-dev  created     
    +   ├─ random:index:RandomPassword             sqlserverpassword       created     
    +   ├─ azure-native:resources:ResourceGroup    sqlserverfirewall-rg    created     
    +   │  ├─ azure-native:sql:Server              sqlserverfirewalls      created     
    +   │  └─ azure-native:storage:StorageAccount  sqlsrvfirewallsa        created     
    +   └─ azure-native:sql:FirewallRule           sqlserverfirewallRule   created     
    
    Outputs:
        resourcegroup_name : "sqlserverfirewall-rg448bf63c"
        sql_firewallrules  : "sqlserverfirewallRule"
        sql_password       : "[secret]"
        sql_user           : "pulumiadmin"
        sqlserver_name     : "sqlserverfirewallsf5fd42c3"
        storageaccount_name: "sqlsrvfirewallsa91408512"

    Resources:
        + 6 created

    Duration: 1m23s
    ```
1. Check the Outputs
   ```bash
   pulumi stack output
   ```

   Returns:
   ```bash
    Current stack outputs (6):
    OUTPUT               VALUE
    resourcegroup_name   sqlserverfirewall-rg448bf63c
    sql_firewallrules    sqlserverfirewallRule
    sql_password         [secret]
    sql_user             pulumiadmin
    sqlserver_name       sqlserverfirewallsf5fd42c3
    storageaccount_name  sqlsrvfirewallsa91408512
   ```

1. Check the azure portal to validate that the Azure SQL -> Firewalls and virtual networks -> Allow Azure services and resources to access this server is toggled to `Yes`.

1. Destroy the Stack
   ```bash
   pulumi destroy -y
   ```

1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```