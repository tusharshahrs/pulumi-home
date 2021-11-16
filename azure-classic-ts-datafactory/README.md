# Azure Classic Datafactory with Identity in TypeScript

Deploying [Azure Classic](https://www.pulumi.com/registry/packages/azure/api-docs/) Resource Group, Storage Account, DataFactory with Identity in TypeScript

## Deployment

1. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step)

    ```bash
    az login
    ```

1. Create a new stack

    ```bash
    pulumi stack init dev
    ```
1. Install dependencies
    ```bash
    npm install
    ```

1. Configure the location to deploy the resources to. The Azure region to deploy to is pre-set to **WestUS** - but you can modify the region you would like to deploy to.

    ```bash
    pulumi config set azure-native:location eastus2
    ```
1. Create the stack via `pulumi up`
    ```bash
    pulumi up -y
    ```

    The Result will be
    ```bash
    View Live: https://app.pulumi.com/shaht/azure-classic-ts-datafactory/dev/updates/3

        Type                          Name                              Status      
    +   pulumi:pulumi:Stack           azure-classic-ts-datafactory-dev  created     
    +   ├─ azure:core:ResourceGroup   demo-rg                           created     
    +   └─ azure:datafactory:Factory  demo-datafactory                  created     
    
    Outputs:
        datafactory_name   : "demo-datafactory268f917"
        resource_group_name: "demo-rg821b2fc8"

    Resources:
        + 3 created

    Duration: 19s
    ```

1. Check the Outputs
   ```bash
   pulumi stack output
   ```
   Returns:
   ```bash
    Current stack outputs (2):
    OUTPUT               VALUE
    datafactory_name     demo-datafactory268f917
    resource_group_name  demo-rg821b2fc8
   ```

1. Perform a refresh. There should be *NO* changes.
   ```bash
   pulumi up --refresh --diff
   ```

   Results
   ```bash
   View Live: https://app.pulumi.com/shaht/azure-classic-ts-datafactory/dev/previews/316f62ee-e373-4551-8aa2-0042be59f2dd

    ~ pulumi:pulumi:Stack: (refresh)
        [urn=urn:pulumi:dev::azure-classic-ts-datafactory::pulumi:pulumi:Stack::azure-classic-ts-datafactory-dev]
    pulumi:pulumi:Stack: (same)
        [urn=urn:pulumi:dev::azure-classic-ts-datafactory::pulumi:pulumi:Stack::azure-classic-ts-datafactory-dev]
    Resources:              
        3 unchanged
    Do you want to perform this update? details
    ~ pulumi:pulumi:Stack: (refresh)
        [urn=urn:pulumi:dev::azure-classic-ts-datafactory::pulumi:pulumi:Stack::azure-classic-ts-datafactory-dev]
    pulumi:pulumi:Stack: (same)
        [urn=urn:pulumi:dev::azure-classic-ts-datafactory::pulumi:pulumi:Stack::azure-classic-ts-datafactory-dev]

    Do you want to perform this update? 2D  [Use arrows to move, enter to select, type to filter]
    ```

1. If you see an *error* along the lines of `once Managed Virtual Network has been Enabled it's not possible to disable it`, it could be
   due to the following upstream issues
   - [Support for managed virtual networking in azure data factory](https://github.com/hashicorp/terraform-provider-azurerm/issues/10542#issuecomment-891583123)
   - [Managed virtual networking in azure data factory not setting correctly](https://github.com/hashicorp/terraform-provider-azurerm/issues/12949)

1. Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```