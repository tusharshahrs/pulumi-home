# Deploying Azure Managed Instance that takes 3 plus hours in the azure portal

Deploys Azure resource group, storage account, vnet, 2 delegated subnets, and random password. The Azure MangedInstance is created via the [azure portal](portal.azure.com) because it takes [3+ hours](images/sqlmanagedinstance_creation_time.png) to stand up. We [import](https://www.pulumi.com/registry/packages/azure-native/api-docs/sql/managedinstance/#import) the managedinstance.  More about [Importing Infrastructure]([importing infrastructure](https://www.pulumi.com/docs/guides/adopting/import/#adopting-existing-resources)


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
1. Create that stack via `pulumi up`.
    ```bash
    pulumi up -y
    ```

    Results

    ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/azure-ts-managedinstance/dev/updates/25

        Type                                     Name                          Status      
    +   pulumi:pulumi:Stack                      azure-ts-managedinstance-dev  created     
    +   ├─ azure-native:resources:ResourceGroup  demo-rg                       created     
    +   ├─ random:index:RandomPassword           demo-sqlseverpassword         created     
    +   ├─ azure-native:storage:StorageAccount   demosa                        created     
    +   ├─ azure-native:network:VirtualNetwork   demo-vnet                     created     
    +   ├─ azure-native:network:Subnet           demo-subnet2                  created     
    +   └─ azure-native:network:Subnet           demo-subnet1                  created     
    
    Outputs:
        managedinstance_password: "[secret]"
        resource_group_name     : "demo-rga7d67441"
        storage_account_name    : "demosaf0029a8c"
        subnet1_name            : "demo-subnet1"
        subnet2_name            : "demo-subnet2"
        username                : "pulumiadmin"
        virtualnetwork_name     : "demo-vnetb71f9063"

    Resources:
        + 7 created

    Duration: 28s

1. Check the Outputs
   ```bash
   pulumi stack output
   ```

   Returns:
   ```bash
    Current stack outputs (7):
    OUTPUT                    VALUE
    managedinstance_password  [secret]
    resource_group_name       demo-rga7d67441
    storage_account_name      demosaf0029a8c
    subnet1_name              demo-subnet1
    subnet2_name              demo-subnet2
    username                  pulumiadmin
    virtualnetwork_name       demo-vnetb71f9063
   ```

1. Go to the [Azure portal])(portal.azure.com) and create the managedinstance into the resource group and vnet/subnet that we just created.  Wait a couple
of hours till it is up.

1. Next, we will import the [sql managedinstance](https://www.pulumi.com/registry/packages/azure-native/api-docs/sql/managedinstance/#import).

   `demoinstance` below is the name of the resource that I want in `Pulumi`.  This will NOT change the resouce name in azure.
   For example, `const cool_managed_instance = new sql.ManagedInstance("mymanagedinstance", {`, this is the `cool_managed_instance` part.

   ```bash
   pulumi import azure-native:sql:ManagedInstance demoinstance /subscriptions/REPLACE_WITH_YOUR_SUBSCRIPTION_ID/resourceGroups/demo-rgfee5a5c5/providers/Microsoft.Sql/managedInstances/mymanagedinstance123
   ```

   Results
   ```bash
   View Live: https://app.pulumi.com/shaht/azure-ts-managedinstance/dev/updates/20

        Type                                 Name                          Status       
        pulumi:pulumi:Stack                  azure-ts-managedinstance-dev               
    =   └─ azure-native:sql:ManagedInstance  demoinstance                  imported     
    
    Outputs:
        managedinstance_password: "[secret]"
        resource_group_name     : "demo-rgfee5a5c5"
        storage_account_name    : "demosaedd641fd"
        subnet1_name            : "demo-subnet1"
        subnet2_name            : "demo-subnet2"
        username                : "pulumiadmin"
        virtualnetwork_name     : "demo-vnetb1e0063d"

    Resources:
        = 1 imported
        7 unchanged

    Duration: 31s
   ```

1. You will get the following instructions
   ```bash
       Please copy the following code into your Pulumi application. Not doing so
    will cause Pulumi to report that an update will happen on the next update command.

    Please note that the imported resources are marked as protected. To destroy them
    you will need to remove the `protect` option and run `pulumi update` *before*
    the destroy will take effect.
   ```

1. Take the code that was generated from the import above and place it in your `index.ts` file. For example, here is mine.
   ```bash

    import * as pulumi from "@pulumi/pulumi";
    import * as azure_native from "@pulumi/azure-native";

    const demoinstance = new azure_native.sql.ManagedInstance("demoinstance", {
        administratorLogin: "tushar",
        collation: "SQL_Latin1_General_CP1_CI_AS",
        identity: {
            type: "SystemAssigned",
        },
        licenseType: "LicenseIncluded",
        location: "eastus2",
        maintenanceConfigurationId: "/subscriptions/REPLACE_WITH_YOUR_SUBSCRIPTION_ID/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/SQL_Default",
        managedInstanceName: "tusharshah",
        minimalTlsVersion: "1.2",
        proxyOverride: "Proxy",
        publicDataEndpointEnabled: false,
        resourceGroupName: "demo-rgfee5a5c5",
        sku: {
            capacity: 4,
            family: "Gen5",
            name: "GP_Gen5",
            tier: "GeneralPurpose",
        },
        storageAccountType: "GRS",
        storageSizeInGB: 32,
        subnetId: "/subscriptions/REPLACE_WITH_YOUR_SUBSCRIPTION_ID/resourceGroups/demo-rgfee5a5c5/providers/Microsoft.Network/virtualNetworks/demo-vnetb1e0063d/subnets/demo-subnet2",
        timezoneId: "UTC",
        vCores: 4,
        zoneRedundant: false,
    }, {
        protect: true,
    });
   ```

1. The managedinstance has [protect](https://www.pulumi.com/docs/intro/concepts/resources/#protect) turned on.  If you want to destroy this resource, you
will need to change `protect: true` to `protect: false` and then run `pulumi up`.  Once that is done, then you can do `pulumi destroy`.

1. To delete resource "urn:pulumi:dev::azure-ts-managedinstance::azure-native:sql:ManagedInstance::demoinstance"
    as it is currently marked for protection. To unprotect the resource, either remove the `protect` flag from the resource in your Pulumiprogram and run `pulumi up` or use the command:
    `pulumi state unprotect urn:pulumi:dev::azure-ts-managedinstance::azure-native:sql:ManagedInstance::demoinstance`

   ```bash
   pulumi state unprotect urn:pulumi:dev::azure-ts-managedinstance::azure-native:sql:ManagedInstance::demoinstance
   ```

   ```bash
   :ManagedInstance::demoinstance
    warning: This command will edit your stack's state directly. Confirm? Yes
    Resource successfully unprotected
    ```

1. Destroy the Stack.  Need to run `pulumi up` because we unprotected the managedinstance.
   ```bash
   pulumi up -y
   ```

   ```bash
   pulumi destroy -y
   ```
   Note, deleting the `managedinstance` takes a while, like 60+ minutes.

   Results
   ```bash
   View Live: https://app.pulumi.com/shaht/azure-ts-managedinstance/dev/updates/24

        Type                                     Name                          Status      
    -   pulumi:pulumi:Stack                      azure-ts-managedinstance-dev  deleted     
    -   ├─ azure-native:sql:ManagedInstance      demoinstance                  deleted     
    -   ├─ azure-native:network:Subnet           demo-subnet1                  deleted     
    -   ├─ azure-native:network:Subnet           demo-subnet2                  deleted     
    -   ├─ azure-native:network:VirtualNetwork   demo-vnet                     deleted     
    -   ├─ azure-native:storage:StorageAccount   demosa                        deleted     
    -   ├─ azure-native:resources:ResourceGroup  demo-rg                       deleted     
    -   └─ random:index:RandomPassword           demo-sqlseverpassword         deleted     
    
    Outputs:
    - managedinstance_password: "[secret]"
    - resource_group_name     : "demo-rgfee5a5c5"
    - storage_account_name    : "demosaedd641fd"
    - subnet1_name            : "demo-subnet1"
    - subnet2_name            : "demo-subnet2"
    - username                : "tushar"
    - virtualnetwork_name     : "demo-vnetb1e0063d"

    Resources:
        - 8 deleted

    Duration: 1h5m55s
    ```

1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```