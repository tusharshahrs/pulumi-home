# Azure Key Vault with AppServicePlan and WebApp in Python

This example deploys a resource group, and a storage account, and has a workaround for the following issue [storage account NetworkRuleSetResponseArgs has no attribute](https://github.com/pulumi/pulumi-azure-native/issues/2061).

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
        View Live: https://app.pulumi.com/shaht/azure-py-storage-account-networkrulesetresponseargs/dev/previews/c5d344d9-8b00-418f-9708-501359137da7

        Type                                     Name                                                  
    +   pulumi:pulumi:Stack                      azure-py-storage-account-networkrulesetresponseargs-de
    +   ├─ azure-native:resources:ResourceGroup  resource_group                                    
    +   └─ azure-native:storage:StorageAccount   sa                                                
    
    Outputs:
        primary_storage_key: output<string>

    Resources:
        + 3 to create

    Updating (dev)

    View Live: https://app.pulumi.com/shaht/azure-py-storage-account-networkrulesetresponseargs/dev/updates/1

        Type                                     Name                                                  
    +   pulumi:pulumi:Stack                      azure-py-storage-account-networkrulesetresponseargs-de
    +   ├─ azure-native:resources:ResourceGroup  resource_group                                    
    +   └─ azure-native:storage:StorageAccount   sa                                                
    
    Outputs:
        primary_storage_key: [secret]

    Resources:
        + 3 created

    Duration: 31s
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (1):
    OUTPUT               VALUE
    primary_storage_key  [secret]
   ```

   If you need to see the values for the primary key of the storage account, you will have to do the following
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