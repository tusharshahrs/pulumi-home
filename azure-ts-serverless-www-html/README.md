# Azure Native Deploying Static website in typescript using StorageAccountStaticWebsite

Deploy an Azure Native static website in typescript deployed using with [StorageAccountStaticWebsite](https://www.pulumi.com/registry/packages/azure-native/api-docs/storage/storageaccountstaticwebsite/).

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

    [pulumi config set](https://www.pulumi.com/docs/reference/cli/pulumi_config_set/) allows us to pass in [configuration values](https://www.pulumi.com/docs/intro/concepts/config/#setting-and-getting-configuration-values) from the command line.
    Feel free to choose any Azure region that supports the services used in these labs ([see this infographic](https://azure.microsoft.com/en-us/global-infrastructure/regions/) for current list of available regions).  A list of some of the regions:

    ```bash
    centralus,eastasia,southeastasia,eastus,eastus2,westus,westus2,northcentralus,southcentralus,
    westcentralus,northeurope,westeurope,japaneast,japanwest,brazilsouth,australiasoutheast,australiaeast,
    westindia,southindia,centralindia,canadacentral,canadaeast,uksouth,ukwest,koreacentral,koreasouth,
    francecentral,southafricanorth,uaenorth,australiacentral,switzerlandnorth,germanywestcentral,
    norwayeast,jioindiawest,australiacentral2
    ```

    The command updates and persists the value to the local `Pulumi.dev.yaml` file. You can view or edit this file at any time to effect the configuration of the current stack.

1. Run `pulumi up` to preview and select `yes` to deploy changes:

   ```bash
   pulumi up
   ```

   ```bash
    Previewing update (dev)

    Updating (dev)

    View Live: https://app.pulumi.com/shaht/azure-ts-serverless-www-html/dev/updates/77

        Type                                                       Name                              Status      
    +   pulumi:pulumi:Stack                                        azure-ts-serverless-www-html-dev  created     
    +   ├─ azure-native:resources:ResourceGroup                    demo-rg                           created     
    +   │  └─ azure-native:storage:StorageAccount                  demosa                            created     
    +   │     └─ azure-native:storage:StorageAccountStaticWebsite  demo-staticwebsite                created     
    +   ├─ azure-native:storage:Blob                               index.html                        created     
    +   └─ azure-native:storage:Blob                               404.html                          created     
    
    Outputs:
        resource_group_name : "demo-rgac8b82c7"
        staticEndpoint      : "https://demosa57132147.z20.web.core.windows.net/"
        storage_account_name: "demosa57132147"

    Resources:
        + 6 created

    Duration: 29s
   ```
1. Check the deployed function endpoints via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)

    ```bash
    pulumi stack output endpoint
    ```
    Results
    ```bash
    Current stack outputs (3):
    OUTPUT                VALUE
    resource_group_name   demo-rgac8b82c7
    staticEndpoint        https://demosa57132147.z20.web.core.windows.net/
    storage_account_name  demosa5713214
    ```

    You can now open the resulting endpoint in the browser or curl it:
   ```bash
   curl $(pulumi stack output staticEndpoint)
   ```
   **Welcome to Pulumi!!! This is Infrastructure as Code.  This file is served from Azure Native.**

1. Clean up - Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```