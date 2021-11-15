# An Azure Databricks workspace in python
  An Azure Databricks workspace in python.
  
* Built using the following resources
  * [azure-native](https://www.pulumi.com/docs/reference/pkg/azure-native/) API
  * [resource groups](https://www.pulumi.com/docs/reference/pkg/azure-native/resources/resourcegroup/)
  * [databricks workspace](https://www.pulumi.com/docs/reference/pkg/azure-native/databricks/workspace/)

## Prerequisites

* [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
* [Configure Pulumi to Use Azure](https://www.pulumi.com/docs/intro/cloud-providers/azure/setup/) (if your Azure CLI is configured, no further changes are required)

## Deployment
1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).
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
1. Run `pulumi up` to preview and deploy changes.
  
    ```bash
    pulumi up
    ```
    Results
    ```bash
    Previewing update (dev)

    View Live: https://app.pulumi.com/myuser/azure-py-databricks/dev/previews/81f53e84-a81b-4946-97a6-321e9c4b14d2

        Type                                     Name                       Plan       
    +   pulumi:pulumi:Stack                      azure-py-databricks-dev    create     
    +   ├─ azure-native:resources:ResourceGroup  databricks-resource_group  create     
    +   └─ azure-native:databricks:Workspace     databricks-workspace       create     
    
    Resources:
        + 3 to create

    Do you want to perform this update?  [Use arrows to move, enter to select, type to filter]
    yes
    > no
    details
    ```

1. You must select `y` to continue deployment
    Results
    ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/myuser/azure-py-databricks/dev/updates/22

        Type                                     Name                       Status      
    +   pulumi:pulumi:Stack                      azure-py-databricks-dev    created     
    +   ├─ azure-native:resources:ResourceGroup  databricks-resource_group  created     
    +   └─ azure-native:databricks:Workspace     databricks-workspace       created     
    
    Outputs:
        databricks_managed_resource_group: "databricks-managed-rg"
        databricks_workspace_name        : "databricks-workspace8de1ba45"
        databricks_workspace_status      : "Succeeded"
        databricks_workspace_url         : "adb-4827658342681700.0.azuredatabricks.net"
        resourcegroup_name               : "databricks-resource_groupe00496f8"

    Resources:
        + 3 created

    Duration: 2m24s
    ```

1. Check out the outputs via pulumi stack output
   ```bash
   pulumi stack output
   ```
   Results
   ```bash
   Current stack outputs (5):
    OUTPUT                             VALUE
    databricks_managed_resource_group  databricks-managed-rg
    databricks_workspace_name          databricks-workspace8de1ba45
    databricks_workspace_status        Succeeded
    databricks_workspace_url           adb-4827658342681700.0.azuredatabricks.net
    resourcegroup_name                 databricks-resource_groupe00496f8
   ```

1. Clean up and destroy stack
   ```bash
   pulumi destroy -y
   ```