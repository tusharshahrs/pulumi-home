# Azure Kubernetes Service (AKS) Cluster using the native Azure Provider in TypeScript

This example deploys an AKS cluster, creates an Azure Active AD application, creates a Service Principal and sets credentials to manage access to the cluster.  Then toggle [enableAzureRBAC](https://github.com/pulumi/pulumi-azure-native/blob/master/CHANGELOG.md#1850-2022-11-07) in the cluster from `true` to `false` getting an `update` instead of `create-replace`

## Deploying the App

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

1. Configure the location via the config. The Azure region to deploy to is pre-set to **WestUS** - but you can modify the region you would like to deploy to.

   ```bash
   pulumi config set azure-native:location eastus2
   ```

1. Run `pulumi up` to preview and deploy changes: You must select `y` to continue
  
    ```bash
    pulumi up
    ```

    Results
    ```bash
      View Live: https://app.pulumi.com/shaht/azure-ts-aks-managed-profile/dev/updates/36

      Type                                             Name                              Status              
   +   pulumi:pulumi:Stack                              azure-ts-aks-managed-profile-dev  creating (37s)...   
   +   pulumi:pulumi:Stack                              azure-ts-aks-managed-profile-dev  created (312s)      
   +   │  └─ azuread:index:ServicePrincipal             demo11-ad-sp                      created (11s)       
   +   │     └─ azuread:index:ServicePrincipalPassword  demo11-ad-sp-password             created (10s)       
   +   ├─ azure-native:resources:ResourceGroup          demo11-rg                         created (0.61s)     
   +   ├─ tls:index:PrivateKey                          demo11-ssh-key                    created (1s)        
   +   ├─ azure-native:storage:StorageAccount           demo11sa                          created (19s)       
   +   └─ azure-native:containerservice:ManagedCluster  demo11-managedcluster             created (274s)      
   
   Outputs:
      adApp_name               : "4b3b435f-8710-42b7-80d1-d9d34d6056a2"
      adSpPassword_info        : "587346db-6d2e-4e18-90c0-cc8b6f5f9a0a/password/7311ed26-0651-efdc-4a6c-f1ed23d5e5ae"
      ad_sp_name               : "demo11-aad-application"
      managedcluster_aadprofile: {
         enableAzureRBAC: true
         managed        : true
         tenantID       : "123123-1234-1234-1234-123123123"
      }
      managedcluster_name      : "demo11-managedcluster5648ea2f"
      primaryStorageKey        : [secret]

   Resources:
      + 8 created

   Duration: 5m14s
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (6):
    OUTPUT                     VALUE
    adApp_name                 4b3b435f-8710-42b7-80d1-d9d34d6056a2
    adSpPassword_info          587346db-6d2e-4e18-90c0-cc8b6f5f9a0a/password/7311ed26-0651-efdc-4a6c-f1ed23d5e5ae
    ad_sp_name                 demo11-aad-application
    managedcluster_aadprofile  {"enableAzureRBAC":true,"managed":true,"tenantID":"04b07795-8ddb-461a-bbee-02f9e1bf7b46"}
    managedcluster_name        demo11-managedcluster5648ea2f
    primaryStorageKey          [secret]

   ```

   If you need to see the value in `primaryStorageKey`, you will have to do the following
   ```bash
   pulumi stack output primaryStorageKey --show-secrets
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```