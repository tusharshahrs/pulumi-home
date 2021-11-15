# Azure Resource Group returning subscription ID in typescript
Create an Azure resource group and return the Azure subscriptionId

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
1. Create that stack via `pulumi up`
    ```bash
    pulumi up -y
    ```

    Results
    ```bash
    Previewing update (dev)

    View Live: https://app.pulumi.com/myuser/azure-ts-subscriptionid-from-resourcegroup/dev/previews/0c785e89-b887-48e2-8fb3-fdd78ea9d749

        Type                                     Name                                            Plan       
    +   pulumi:pulumi:Stack                      azure-ts-subscriptionid-from-resourcegroup-dev  create     
    +   └─ azure-native:resources:ResourceGroup  demo-rg                                         create     
    
    Resources:
        + 2 to create

    Updating (dev)

    View Live: https://app.pulumi.com/myuser/azure-ts-subscriptionid-from-resourcegroup/dev/updates/5

        Type                                     Name                                            Status      
    +   pulumi:pulumi:Stack                      azure-ts-subscriptionid-from-resourcegroup-dev  created     
    +   └─ azure-native:resources:ResourceGroup  demo-rg                                         created     
    
    Outputs:
        myresourcegroup_name: "demo-rg9f01d49b"
        subscriptionid      : "[secret]"

    Resources:
        + 2 created

    Duration: 5s
    ```


1. View the outputs created via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)
   ```bash
   pulumi stack output
   ```
   Results
   ```bash
   Current stack outputs (2):
    OUTPUT                VALUE
    myresourcegroup_name  demo-rg9f01d49b
    subscriptionid        [secret]
   ```

1. The outputs are secrets. To view them run the following
    ```bash
    pulumi stack output --show-secrets
    ```

    The **Subscription ID** will show up.

1. Clean up - Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```
