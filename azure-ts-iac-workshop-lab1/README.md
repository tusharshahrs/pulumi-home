
# Azure Workshop TypeScript  - Lab 1
Azure Infrastructure as Code Workshop Lab 1 code in TypeScript. This example creates a
resource group, storage account, and blobcontainer calling [azure-native](https://www.pulumi.com/docs/reference/pkg/azure-native/) resources.

## Note
  This example can stand alone.  
  This example also is a part of the following [Azure Native Workshop in TypeScript Lab 1]
  (./azure-workshop-ts#lab-1--modern-infrastructure-as-code)
  

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

    View Live: https://app.pulumi.com/myuser/azure-ts-iac-workshop-lab1/dev/updates/1

        Type                                     Name                            Status      
    +   pulumi:pulumi:Stack                      azure-ts-iac-workshop-lab1-dev  created     
    +   ├─ azure-native:resources:ResourceGroup  myresourcegroup                 created     
    +   ├─ azure-native:storage:StorageAccount   storageaccount                  created     
    +   └─ azure-native:storage:BlobContainer    mycontainer                     created     
    
    Outputs:
        blobcontainer : "files"
        resourcegroup : "myresourcegroupb6e8e220"
        storageaccount: "storageaccounta9a84abd"

    Resources:
        + 4 created

    Duration: 28s
    ```
1. Check the Outputs
   ```bash
   pulumi stack output resourcegroup
   ```
   Returns:

   ```bash
   Current stack outputs (3):
    OUTPUT          VALUE
    blobcontainer   files
    resourcegroup   myresourcegroupb6e8e220
    storageaccount  storageaccounta9a84abd
   ```

1. Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```