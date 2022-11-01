# Azure Kubernetes Service (AKS) Cluster using the native Azure Provider and DiagnosticSetting in GO

This example deploys an AKS cluster, creates an Azure Active AD application, creates a Service Principal and sets credentials to manage access to the cluster. We also turn on DiagnosticSettings on the AKS cluster in Go.

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


1. Run `pulumi up` to preview and deploy changes: You must select `y` to continue
   **REPLACE**
    ```bash
    pulumi up
    ```

    Results
    ```bash
    View Live: https://app.pulumi.com/myuser/azure-go-aks-diagnosticsetting/dev/updates/14

     Type                                             Name                                Status      Info
    +   pulumi:pulumi:Stack                              azure-go-aks-diagnosticsetting-dev  created     
    +   ├─ azure-native:resources:ResourceGroup          diag-rg                             created     
    +   ├─ tls:index:PrivateKey                          diag-privatekey                     created     
    +   ├─ azuread:index:Application                     diag-Application                    created     
    +   ├─ random:index:RandomPassword                   diag-password                       created     
    +   ├─ azure-native:storage:StorageAccount           diagsa                              created     
    +   ├─ azuread:index:ServicePrincipal                diag-ServicePrincipal               created     
    +   ├─ azuread:index:ServicePrincipalPassword        diag-aksSpPassword                  created     1 warning
    +   ├─ azure-native:containerservice:ManagedCluster  diag-go-aks                         created     
    +   └─ azure-native:insights:DiagnosticSetting       diag-diagnosticSetting              created     
    
    Diagnostics:
    azuread:index:ServicePrincipalPassword (diag-aksSpPassword):
        warning: urn:pulumi:dev::azure-go-aks-diagnosticsetting::azuread:index/servicePrincipalPassword:ServicePrincipalPassword::diag-aksSpPassword verification warning: Deprecated Attribute
    
    Outputs:
        azure_ad_application     : "diag-azuread-apps"
        azure_ad_serviceprincipal: "52aa3171-1446-4350-8b4f-89701bef4e35"
        diagnostic_setting_id    : "[secret]"
        diagnostic_setting_name  : "diag-diagnosticSetting106490e7"
        kubeconfig               : "[secret]"
        managedcluster_name      : "diag-go-aks15ebfe96"
        primarystoragekey        : "[secret]"
        resourcegroup_name       : "diag-rgbbcfc404"
        sshKey                   : "abcdefghijklmnopeqrstuklmnveklmnewxyzklmn"
        storageaccount_name      : "diagsa0022fd6d"

    Resources:
        + 10 created

    Duration: 5m50s
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (9):
    OUTPUT                     VALUE
    azure_ad_application       diag-azuread-apps
    azure_ad_serviceprincipal  52aa3171-1446-4350-8b4f-89701bef4e35
    diagnostic_setting_id      [secret]
    diagnostic_setting_name    diag-diagnosticSetting106490e7
    kubeconfig                 [secret]
    managedcluster_name        diag-go-aks15ebfe96
    primarystoragekey          [secret]
    resourcegroup_name         diag-rgbbcfc404
    sshKey                     abcdefghijklmnopeqrstuklmnveklmnewxyzklmn
    storageaccount_name        diagsa0022fd6d
   ```

   If you need to see the values that are `secret`, you will have to do the following
   ```bash
   pulumi stack output --show-secrets
   ```

1. You can save this kubeconfig to a file and use `kubectl` via command line:

    ```bash
    pulumi stack output kubeconfig --show-secrets > kubeconfig
    ```

    Once you have this file in hand, you can interact with your new cluster as usual via `kubectl`:

    ```bash
    export KUBECONFIG=$PWD/kubeconfig 
    kubectl version
    kubectl get nodes
    ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y