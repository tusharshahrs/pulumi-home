# Azure Datalakegen2

Azure resource group & storage account created in azure-native.  Datalakegen2filesystem and Datalake2path created using classic.  We can only 
have the *datalakegen2path* resource have the aces at creation, we are not able to add a user to it afterwards.  We get the following 403 error message
```bash
        * updating urn:pulumi:dev::azure-ts-datalakegen2::azure:storage/dataLakeGen2Path:DataLakeGen2Path::demo-datalakegen2path: 1 error occurred:
        * setting access control for Path "enreched" in File System "demo-dlakegen2fse6c92ed" in Storage Account "demosa42762e87": datalakestore.Client#SetAccessControl: Failure responding to request: StatusCode=403 -- Original Error: autorest/azure: Service returned an error. Status=403 Code="AuthorizationPermissionMismatch" Message="This request is not authorized to perform this operation using this permission.\nRequestId:68e3a870-d01f-005b-56fb-a022ad000000\nTime:2021-09-03T19:38:49.9638407Z"
```
This seems to be releated to this [upstream](https://github.com/hashicorp/terraform-provider-azurerm/issues/6659).

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
1. Configure the location to deploy the resources to. The Azure region to deploy to is pre-set to **WestUS** - but you can modify the region you would like to deploy to.  The *objectid_azure_ad_user_1/2*  Specifies the Object ID of the Azure Active Directory User or Group that the entry relates to. Only valid for user or group entries. They are passed in as secrets because we did not want them hard coded in our code.

    ```bash
    pulumi config set azure-native:location eastus2
    pulumi config set objectid_azure_ad_user_1  objectid_azure_user1 --secret
    pulumi config set objectid_azure_ad_user_2  objectid_azure_user1 --secret
    ```

1. Create that stack via `pulumi up`
    ```bash
    pulumi up -y
    ```

    The Result will be
    ```bash
    View Live: https://app.pulumi.com/myuser/azure-ts-keyvault/dev/updates/5

        Type                                                  Name                       Status      
    +   pulumi:pulumi:Stack                                   azure-ts-keyvault-dev      created     
    +   ├─ azure-native:resources:ResourceGroup               demo-rg                    created     
    +   ├─ random:index:RandomString                          demo-roleName              created     
    +   ├─ azure-native:authorization:RoleDefinition          demo-custom-role           created     
    +   ├─ azure-native:managedidentity:UserAssignedIdentity  demo-userassignedidentity  created     
    +   ├─ azure-native:containerinstance:ContainerGroup      demo-containergroup        created     
    +   ├─ azure-native:keyvault:Vault                        demo-vault                 created     
    +   ├─ azure-native:keyvault:Secret                       demo-mysecret              created     
    +   └─ azure-native:keyvault:Key                          demo-mykey                 created     
    
    Outputs:
        container_name    : "demo-containergroupa38d56ef"
        resourcegroup_name: "demo-rg8ebacc35"
        useridentity_name : "demo-userassignedidentity5ea5a496"
        vault_key_name    : "demo-mykey"
        vault_name        : "demo-vault7db84b18"
        vault_secret_name : "demo-mysecret"

    Resources:
        + 9 created

    Duration: 2m19s
    ```


1. Check the Outputs
   ```bash
   pulumi stack output
   ```
   Returns:
   ```bash
   Current stack outputs (6):
    OUTPUT              VALUE
    container_name      demo-containergroupa38d56ef
    resourcegroup_name  demo-rg8ebacc35
    useridentity_name   demo-userassignedidentity5ea5a496
    vault_key_name      demo-mykey
    vault_name          demo-vault7db84b18
    vault_secret_name   demo-mysecret
   ```

1. Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```