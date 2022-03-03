# Azure Resource Group and Storage Account in Go

Create an Azure resource group and storage account in Go

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

    View Live: https://app.pulumi.com/shaht/azure-go-resourcegroup/dev/updates/5

     Type                                     Name                        Status      
    +   pulumi:pulumi:Stack                      azure-go-resourcegroup-dev  created     
    +   ├─ azure-native:resources:ResourceGroup  resourceGroup               created     
    +   └─ azure-native:storage:StorageAccount   sa                          created     
    
    Outputs:
        primarystoragekey   : "[secret]"
        resource_group_name : "resourceGroupb583aeef"
        storage_account_name: "sa19e3646e"

    Resources:
        + 3 created

    Duration: 28s
    ```

1. View the outputs created via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)
   ```bash
   pulumi stack output
   ```
   Results
   ```bash
    Current stack outputs (3):
     OUTPUT                VALUE
     primarystoragekey     [secret]
     resource_group_name   resourceGroupb583aeef
     storage_account_name  sa19e3646e
   ```

1. The `primarystoragekey` output is secret. To view it run the following
    ```bash
    pulumi stack output --show-secrets
    ```

    The **primarystoragekey** will show up.

1. Clean up - Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```