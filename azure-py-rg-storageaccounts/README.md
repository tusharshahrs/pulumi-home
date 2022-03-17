# Azure Resource Group and Storage Account

Deploys Azure Resource Group and Storage Account in Python

## Deployment

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

1. Set the confi values via [pulumi config set](https://www.pulumi.com/docs/reference/cli/pulumi_config_set/).

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
    Previewing update (dev)

   View Live: https://app.pulumi.com/myuser/azure-py-rg-storageaccounts/dev/updates/4

        Type                                     Name                             Status      
    +   pulumi:pulumi:Stack                      azure-py-rg-storageaccounts-dev  created     
    +   ├─ azure-native:resources:ResourceGroup  demo-resource_group              created     
    +   └─ azure-native:storage:StorageAccount   demosa                           created     
    
    Outputs:
        primary_storage_key : "[secret]"
        resource_group_name : "demo-resource_groupc02a8864"
        storage_account_id  : "[secret]"
        storage_account_name: "demosa0e5062ba"

    Resources:
        + 3 created

    Duration: 29s
    ```

1. View the outputs created via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)
   ```bash
   pulumi stack output
   ```
   Results

    ```bash
    Current stack outputs (4):
    OUTPUT                VALUE
    primary_storage_key   [secret]
    resource_group_name   demo-resource_groupc02a8864
    storage_account_id    [secret]
    storage_account_name  demosa0e5062ba
    ```

   If you need to see the values that are secret, you will have to do the following
   ```bash
   pulumi stack output --show-secrets
   ```

1. Clean up.
    ```bash
    pulumi destroy -y
    ```

1. Remove the stack. This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev
   ```