
# Azure Key Vault in TypeScript

Azure keyvault created in TypeScript.

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