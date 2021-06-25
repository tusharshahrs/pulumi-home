
# Deploying Serverless Applications with Azure Functions

In this lab, you will deploy a Azure Function Apps with HTTP-triggered serverless functions.
This is in typescript



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

1. Azure Typescript Function Zip file

    The applications settings configure the app to run on Node.js v14 runtime and deploy the specified zip file to the Function App.
    The app will download the specified file, extract the code from it, discover the functions, and run them.
    We’ve prepared this zip file for you to get started faster, you can find its 
    code [here](https://github.com/tusharshahrs/demo/tree/main/content/lab/pulumi/azure-native/typescript). The code contains a single HTTP-triggered Azure Function in the zip file.

1. Run `pulumi up` to preview and select `yes` to deploy changes:

   ```bash
   pulumi up
   ```

   ```bash
    Previewing update (dev)

    View Live: https://app.pulumi.com/shaht/azure-ts-serveless-http-trigger/dev/previews/6c53075a-16f3-4b7b-a695-8b85dde7edc8

        Type                                     Name                                 Plan       
    +   pulumi:pulumi:Stack                      azure-ts-serveless-http-trigger-dev  create     
    +   ├─ azure-native:resources:ResourceGroup  resourcegroup_functions              create     
    +   ├─ azure-native:web:AppServicePlan       consumption-plan                     create     
    +   ├─ azure-native:storage:StorageAccount   storageaccount                       create     
    +   └─ azure-native:web:WebApp               functionapp                          create     
    
    Resources:
        + 5 to create

    Do you want to perform this update? yes
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/azure-ts-serveless-http-trigger/dev/updates/4

        Type                                     Name                                 Status      
    +   pulumi:pulumi:Stack                      azure-ts-serveless-http-trigger-dev  created     
    +   ├─ azure-native:resources:ResourceGroup  resourcegroup_functions              created     
    +   ├─ azure-native:storage:StorageAccount   storageaccount                       created     
    +   ├─ azure-native:web:AppServicePlan       consumption-plan                     created     
    +   └─ azure-native:web:WebApp               functionapp                          created     
    
    Outputs:
        consumptionplan  : "consumption-plandc67323d"
        endpoint         : "https://functionapp1bc0168d.azurewebsites.net/api/hello"
        primaryStorageKey: "[secret]"
        resourcegroup    : "resourcegroup_functions7583fe98"
        storageaccount   : "storageaccount8d208154"

    Resources:
        + 5 created

    Duration: 1m4s
   ```
1. Check the deployed function endpoints via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)

    ```bash
    pulumi stack output endpoint
    ```
    Results
    ```bash
    https://functionapp1bc0168d.azurewebsites.net/api/hello
    ```
    You can now open the resulting endpoint in the browser or curl it:

   ```bash
   curl $(pulumi stack output endpoint)
   ```
   **You've successfully deployed a Function App!**