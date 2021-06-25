# Pulumi:  A VirtualNetwork with two subnets on Azure-NextGen built in Python.
* Built using the following resources
  * [azure-native](https://www.pulumi.com/docs/reference/pkg/azure-nextgen/) api
  * [resource groups](https://www.pulumi.com/docs/reference/pkg/azure-native/resources/resourcegroup/)
  * [virtual network](https://www.pulumi.com/docs/reference/pkg/azure-native/network/virtualnetwork/) 
  * [subnet](https://www.pulumi.com/docs/reference/pkg/azure-native/network/subnet/)

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
   pulumi config set mynames demo
   pulumi config set virtual_network_cidr 10.0.0.0/23
   pulumi config set subnet_1_cidr 10.0.0.0/22
   pulumi config set subnet_2_cidr 10.0.2.0/23
   ```
1. Run `pulumi up` to preview and deploy changes: You must select `y` to continue
  
    ```bash
    pulumi up
    ```
    Results
    ```
    Previewing update (dev)

    View Live: https://app.pulumi.com/myuser/azure-py-vnet/dev/previews/e31a02c1-c98e-4147-a0df-ebdd14e7f473

        Type                                     Name                                  Plan       
    +   pulumi:pulumi:Stack                      azure-py-vnet-dev                     create     
    +   ├─ azure-native:resources:ResourceGroup  peering-to-databricks-resource_group  create     
    +   ├─ azure-native:network:VirtualNetwork   peering-to-databricks-vnet            create     
    +   ├─ azure-native:network:Subnet           peering-to-databricks-subnet1         create     
    +   └─ azure-native:network:Subnet           peering-to-databricks-subnet2         create     
    
    Resources:
        + 5 to create

    Do you want to perform this update?  [Use arrows to move, enter to select, type to filter]
    yes
    > no
    details
    ```
1. Select **yes** and the resources are created along with outputs
    ```
    Updating (dev)

    View Live: https://app.pulumi.com/myuser/azure-py-vnet/dev/updates/9

        Type                                     Name                                  Status      
    +   pulumi:pulumi:Stack                      azure-py-vnet-dev                     created     
    +   ├─ azure-native:resources:ResourceGroup  peering-to-databricks-resource_group  created     
    +   ├─ azure-native:network:VirtualNetwork   peering-to-databricks-vnet            created     
    +   ├─ azure-native:network:Subnet           peering-to-databricks-subnet2         created     
    +   └─ azure-native:network:Subnet           peering-to-databricks-subnet1         created     
    
    Outputs:
        resourcegroup_name     : "peering-to-databricks-resource_group07399224"
        vnet_cidr_block        : {
            address_prefixes: [
                [0]: "10.0.0.0/22"
            ]
        }
        vnet_name              : "peering-to-databricks-vnet3ba0db3a"
        vnet_subnet1_cidr_block: "10.0.0.0/23"
        vnet_subnet1_cidr_name : "peering-to-databricks-subnet1"
        vnet_subnet2_cidr_block: "10.0.2.0/23"
        vnet_subnet2_cidr_name : "peering-to-databricks-subnet2"

    Resources:
        + 5 created

    Duration: 17s
    ```

1. View the outputs created via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)
   ```bash
   pulumi stack output
   ```
   Results

    ```
    Current stack outputs (7):
        OUTPUT                   VALUE
        resourcegroup_name       peering-to-databricks-resource_group07399224
        vnet_cidr_block          {"address_prefixes":["10.0.0.0/22"]}
        vnet_name                peering-to-databricks-vnet3ba0db3a
        vnet_subnet1_cidr_block  10.0.0.0/23
        vnet_subnet1_cidr_name   peering-to-databricks-subnet1
        vnet_subnet2_cidr_block  10.0.2.0/23
        vnet_subnet2_cidr_name   peering-to-databricks-subnet2
    ```

1. Grab the [StackReference](https://www.pulumi.com/docs/intro/concepts/organizing-stacks-projects/#inter-stack-dependencies) for this stack. The StackReference constructor takes as input a string of the form **<organization>/<project>/<stack>**, and lets you access the outputs of that stack.
   Since we are building a vnet with subnets, we want to use it in another stack.
   ```bash
   pulumi stack output
   ```

   Results
   ```
    Current stack is dev:
        Owner: myuser
        Last updated: 3 minutes ago (2021-06-24 08:45:03.946094 -0400 EDT)
        Pulumi version: v3.5.1
    Current stack resources (6):
        TYPE                                         NAME
        pulumi:pulumi:Stack                          azure-py-vnet-dev
        ├─ azure-native:resources:ResourceGroup      peering-to-databricks-resource_group
        ├─ azure-native:network:VirtualNetwork       peering-to-databricks-vnet
        ├─ azure-native:network:Subnet               peering-to-databricks-subnet2
        ├─ azure-native:network:Subnet               peering-to-databricks-subnet1
        └─ pulumi:providers:azure-native             default_1_14_0

    Current stack outputs (7):
        OUTPUT                   VALUE
        resourcegroup_name       peering-to-databricks-resource_group07399224
        vnet_cidr_block          {"address_prefixes":["10.0.0.0/22"]}
        vnet_name                peering-to-databricks-vnet3ba0db3a
        vnet_subnet1_cidr_block  10.0.0.0/23
        vnet_subnet1_cidr_name   peering-to-databricks-subnet1
        vnet_subnet2_cidr_block  10.0.2.0/23
        vnet_subnet2_cidr_name   peering-to-databricks-subnet2

    More information at: https://app.pulumi.com/myuser/azure-py-vnet/dev
   ```

   What we want is this:  **myuser/azure-py-vnet/dev**

1. Destroy the network and subnet. Make sure all your `OTHER` stacks that depend on this network have their resources all deleted `BEFORE` you clean up any networking resources.
    ```bash
    pulumi destroy -y
    ```

1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```