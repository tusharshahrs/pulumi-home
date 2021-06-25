# Azure Resource Group returning subscription id in python

Create an Azure resource group and return the Azure **subscriptionId**

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

    View Live: https://app.pulumi.com/myuser/azure-py-subscriptionid-from-resourcegroup/dev/previews/9fb89f31-af2b-464a-962a-66de142e402d

        Type                                     Name                                            Plan       
    +   pulumi:pulumi:Stack                      azure-py-subscriptionid-from-resourcegroup-dev  create     
    +   └─ azure-native:resources:ResourceGroup  resourcegroup                                   create     
    
    Resources:
        + 2 to create
    ```bash
1. Select **yes** and the resources are created along with outputs
   ```
   Updating (dev)

    View Live: https://app.pulumi.com/myuser/azure-py-subscriptionid-from-resourcegroup/dev/updates/8

        Type                                     Name                                            Status      
    +   pulumi:pulumi:Stack                      azure-py-subscriptionid-from-resourcegroup-dev  created     
    +   └─ azure-native:resources:ResourceGroup  resourcegroup                                   created     
    
    Outputs:
        resource_group_id  : "[secret]"
        resource_group_name: "resourcegroupa786c7f4"
        subscription_id    : "[secret]"

    Resources:
        + 2 created

    Duration: 5s
   ```
1. View the outputs created via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)
   ```bash
   pulumi stack output
   ```
   Results
   ```bash
   Current stack outputs (3):
    OUTPUT               VALUE
    resource_group_id    [secret]
    resource_group_name  resourcegroupa786c7f4
    subscription_id      [secret]
   ```

1. The outputs are secrets. To view them run the following
    ```bash
    pulumi stack output --show-secrets
    ```

    The subscription id will show up.