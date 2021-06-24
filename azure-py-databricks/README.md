# Pulumi:  An Azure Databricks workspace with vnet peering.  The vnet peering will peer to an already created virtual network. This is built in Python.
* Built using [azure-native](https://www.pulumi.com/docs/reference/pkg/azure-native/) api
    * [resource groups](https://www.pulumi.com/docs/reference/pkg/azure-native/resources/resourcegroup/)
    * [databricks workspace](https://www.pulumi.com/docs/reference/pkg/azure-native/databricks/workspace/)
    * [virtual network peering](https://www.pulumi.com/docs/reference/pkg/azure-native/databricks/vnetpeering/) 

## Prerequisites

* [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
* [Configure Pulumi to Use Azure](https://www.pulumi.com/docs/intro/cloud-providers/azure/setup/) (if your Azure CLI is configured, no further changes are required)
* An azure virtual network that is **different** from the one that will be created in this(automatically a new vnet is created for databricks) stack MUST already exist.

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
   pulumi config set mynames demo
   pulumi config set virtual_network_cidr 10.0.0.0/23
   pulumi config set subnet_1_cidr 10.0.0.0/22
   pulumi config set subnet_2_cidr 10.0.2.0/23
   ```
