
# Azure Resource Group Fixed Name
Azure resource group creation that does not randomly append suffix

## Deployment
1.  Login to Azure CLI (you will be prompted to do this during deployment if you forget this step)

    ```bash
    az login
    ```

1.  Create a new stack

    ```bash
    pulumi stack init dev
    ```
1. Install dependencies
    ```bash
    npm install
    ```
1.  Configure the location to deploy the resources to. The Azure region to deploy to is pre-set to **WestUS** - but you can modify the region you would like to deploy to.

    ```bash
    pulumi config set azure-native:location eastus2
    ```
1. Create that stack via `pulumi up`
    ```bash
    pulumi up -y
    ```

    The Result will be

    ```bash
    Outputs:
    + resourcegroup: "rg-tvserver-test"

    Resources:
        + 1 created
        1 unchanged

    Duration: 6s
    ```
1. Check the Outputs
   ```bash
   pulumi stack output resourcegroup
   ```
   Returns:

   **rg-tvserver-test**

1. Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```