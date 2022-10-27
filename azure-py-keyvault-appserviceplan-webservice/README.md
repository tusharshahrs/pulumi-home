# Azure Key Vault with AppServicePlan and WebApp in Python

This example deploys a resource group, appserviceplan, webapp, calls authorization.get_client_config(), works around the following issue [keyvault VaultPropertiesResponseArgs no attribute](https://github.com/pulumi/pulumi-azure-native/issues/2057).

## Deploying the App

1. Initialize a new stack called `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).
   ```bash
   pulumi stack init dev
   ```

1. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step):
    ```bash
    az login
    ```

1. Create a Python virtualenv, activate it, and install dependencies:

    This installs the dependent packages for our Pulumi program.

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip3 install -r requirements.txt
    ```

1. Set the config values via [pulumi config set](https://www.pulumi.com/docs/reference/cli/pulumi_config_set/).

   Here are Azure regions [see this infographic](https://azure.microsoft.com/en-us/global-infrastructure/regions/) for a list of available regions)

   ```bash
   pulumi config set azure-native:location eastus2
   ```

1. Run `pulumi up` to preview and deploy changes: You must select `y` to continue
  
    ```bash
    pulumi up
    ```

    Results
    ```bash
        View Live: https://app.pulumi.com/shaht/azure-py-keyvault-appserviceplan-webservice/dev/updates/7

        Type                                          Name                                             Status            
    +   pulumi:pulumi:Stack                           azure-py-keyvault-appserviceplan-webservice-dev  created (38s)     
    +   ├─ azure-native:resources:ResourceGroup       demo-rg                                          created (1s)      
    +   ├─ azure-native:keyvault:Vault                demo-keyvault                                    created (33s)     
    +   ├─ azure-native:web/v20210201:AppServicePlan  demo-app_service_plan                            created (6s)      
    +   └─ azure-native:web/v20210201:WebApp          demo-webapp                                      created (19s)     
    
    Outputs:
        app_service_plan_1_name: "demo-app_service_planb9e864d1"
        resource_group_name    : "demo-rge267bf6d"
        subscription_id        : [secret]
        tenant_id              : [secret]
        vault_1_name           : "demo-keyvault887a32f5"
        web_app_1_name         : "demo-webapp27f4c939"

    Resources:
        + 5 created

    Duration: 40s
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (6):
    OUTPUT                   VALUE
    app_service_plan_1_name  demo-app_service_planb9e864d1
    resource_group_name      demo-rge267bf6d
    subscription_id          [secret]
    tenant_id                [secret]
    vault_1_name             demo-keyvault887a32f5
    web_app_1_name           demo-webapp27f4c939
   ```

   If you need to see the values for the subscription id or the tenant id, you will have to do the following
   ```bash
   pulumi stack output --show-secrets
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```