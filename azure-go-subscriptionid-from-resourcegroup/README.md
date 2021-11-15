# Azure Resource Group returning subscription ID in go

Create an Azure resource group and return the Azure **subscriptionId**

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

1. Restore dependencies and build (Optional Step)
    ```bash
    go build
    ```


1. Create that stack via `pulumi up`
    ```bash
    pulumi up -y
    ```

    The Result will be

    ```bash
    Previewing update (dev)

    View Live: https://app.pulumi.com/myuser/azure-go-subscriptionid-from-resourcegroup/dev/previews/9d225479-c903-4fce-b80f-80100e5a40b0

        Type                                     Name                                            Plan       
    +   pulumi:pulumi:Stack                      azure-go-subscriptionid-from-resourcegroup-dev  create     
    +   └─ azure-native:resources:ResourceGroup  resourcegroup                                   create     
    
    Resources:
        + 2 to create

    Updating (dev)

    View Live: https://app.pulumi.com/myuser/azure-go-subscriptionid-from-resourcegroup/dev/updates/12

        Type                                     Name                                            Status      
    +   pulumi:pulumi:Stack                      azure-go-subscriptionid-from-resourcegroup-dev  created     
    +   └─ azure-native:resources:ResourceGroup  resourcegroup                                   created     
    
    Outputs:
        resource_group_name: "resourcegroup988c8a6e"
        subscription_id    : "[secret]"

    Resources:
        + 2 created

    Duration: 6s

1. View the outputs created via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)
   ```bash
   pulumi stack output
   ```
   Results
   ```bash
   Current stack outputs (2):
    OUTPUT               VALUE
    resource_group_name  resourcegroup988c8a6e
    subscription_id      [secret]
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