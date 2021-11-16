# Azure Datafactory with Identity in TypeScript

Deploying Azure Resource Group, Storage Account, DataFactory with Identity

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
        View Live: https://app.pulumi.com/shaht/azure-ts-datafactory/dev/previews/1b20f8da-f454-4570-87d1-8031167a3338

        Type                                     Name                      Plan       
    +   pulumi:pulumi:Stack                      azure-ts-datafactory-dev  create     
    +   ├─ azure-native:resources:ResourceGroup  demo-rg                   create     
    +   ├─ azure-native:datafactory:Factory      demo-factory              create     
    +   └─ azure-native:storage:StorageAccount   demosa                    create     
    
    Resources:
        + 4 to create

    Do you want to perform this update? yes
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/azure-ts-datafactory/dev/updates/3

        Type                                     Name                      Status      
    +   pulumi:pulumi:Stack                      azure-ts-datafactory-dev  created     
    +   ├─ azure-native:resources:ResourceGroup  demo-rg                   created     
    +   ├─ azure-native:datafactory:Factory      demo-factory              created     
    +   └─ azure-native:storage:StorageAccount   demosa                    created     
    
    Outputs:
        datafactory_name   : "demo-factory3566c2a6"
        resource_group_name: "demo-rgcccd3c8f"
        storage_group_name : "demosa7d75f042"

    Resources:
        + 4 created

    Duration: 26s
    ```

1. Check the Outputs
   ```bash
   pulumi stack output
   ```
   Returns:
   ```bash
    Current stack outputs (3):
    OUTPUT               VALUE
    datafactory_name     demo-factory3566c2a6
    resource_group_name  demo-rgcccd3c8f
    storage_group_name   demosa7d75f042
   ```

1. Perform a refresh. There should be *NO* changes.
   ```bash
   pulumi up --refresh --diff
   ```

   Results
   ```bash
   View Live: https://app.pulumi.com/shaht/azure-ts-datafactory/dev/previews/3814f576-fa4c-4608-9359-f9bcc8758a2e

    ~ pulumi:pulumi:Stack: (refresh)
        [urn=urn:pulumi:dev::azure-ts-datafactory::pulumi:pulumi:Stack::azure-ts-datafactory-dev]
    pulumi:pulumi:Stack: (same)
        [urn=urn:pulumi:dev::azure-ts-datafactory::pulumi:pulumi:Stack::azure-ts-datafactory-dev]
    Resources:              
        4 unchanged
    ```

1. Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```