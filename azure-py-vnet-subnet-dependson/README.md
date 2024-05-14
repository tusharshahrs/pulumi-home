# Azure Vnet with Multiple Subnets in Python
* Built using the following resources
  * [azure-native](https://www.pulumi.com/docs/reference/pkg/azure-nextgen/) API
  * [resource groups](https://www.pulumi.com/docs/reference/pkg/azure-native/resources/resourcegroup/)
  * [virtual network](https://www.pulumi.com/docs/reference/pkg/azure-native/network/virtualnetwork/)
  * [subnet](https://www.pulumi.com/docs/reference/pkg/azure-native/network/subnet/)
  Hard Coded the azure vnet and auto calculated the public and private subnets

## Prerequisites

* [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
* [Configure Pulumi to Use Azure](https://www.pulumi.com/docs/intro/cloud-providers/azure/setup/) If your Azure CLI is configured, no further changes are required.

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

1. Set the config values via [pulumi config set](https://www.pulumi.com/docs/reference/cli/pulumi_config_set/).

   Here are Azure regions [see this infographic](https://azure.microsoft.com/en-us/global-infrastructure/regions/) for a list of available regions)

   ```bash
   pulumi config set azure-native:location eastus2
   pulumi config set mynames demo
   ```
1. Run `pulumi up` to preview and deploy changes: You must select `y` to continue
  
    ```bash
    pulumi up
    ```
    Results
    ```bash
    Previewing update (dev)

Previewing update (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/azure-py-vnet-subnet-dependson/dev/previews/745ced0d-07de-4153-a05c-2e6f938ec2bd

        Type                                       Name                                Plan       
    +   pulumi:pulumi:Stack                        azure-py-vnet-subnet-dependson-dev  create     
    +   └─ azure-native:resources:ResourceGroup    shaht-rg                            create     
    +      ├─ azure-native:storage:StorageAccount  shahtsa                             create     
    +      └─ azure-native:network:VirtualNetwork  shaht-vnet                          create     
    +         ├─ azure-native:network:Subnet       shaht-publicSubnet-1                create     
    +         │  └─ azure-native:network:Subnet    shaht-privateSubnet-1               create     
    +         ├─ azure-native:network:Subnet       shaht-publicSubnet-2                create     
    +         │  └─ azure-native:network:Subnet    shaht-privateSubnet-2               create     
    +         └─ azure-native:network:Subnet       shaht-publicSubnet-3                create     
    +            └─ azure-native:network:Subnet    shaht-privateSubnet-3               create     

    Outputs:
        primary_storage_key : output<string>
        private_subnets     : [
            [0]: "10.0.3.0/24"
            [1]: "10.0.4.0/24"
            [2]: "10.0.5.0/24"
        ]
        public_subnets      : [
            [0]: "10.0.0.0/24"
            [1]: "10.0.1.0/24"
            [2]: "10.0.2.0/24"
        ]
        resource_group_name : output<string>
        storage_account_name: output<string>
        virtual_network_name: output<string>

    Resources:
        + 10 to create

    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/azure-py-vnet-subnet-dependson/dev/updates/32

        Type                                       Name                                Status              
    +   pulumi:pulumi:Stack                        azure-py-vnet-subnet-dependson-dev  created (29s)       
    +   └─ azure-native:resources:ResourceGroup    shaht-rg                            created (0.81s)     
    +      ├─ azure-native:storage:StorageAccount  shahtsa                             created (21s)       
    +      └─ azure-native:network:VirtualNetwork  shaht-vnet                          created (4s)        
    +         ├─ azure-native:network:Subnet       shaht-publicSubnet-3                created (4s)        
    +         │  └─ azure-native:network:Subnet    shaht-privateSubnet-3               created (4s)        
    +         ├─ azure-native:network:Subnet       shaht-publicSubnet-1                created (3s)        
    +         │  └─ azure-native:network:Subnet    shaht-privateSubnet-1               created (3s)        
    +         └─ azure-native:network:Subnet       shaht-publicSubnet-2                created (4s)        
    +            └─ azure-native:network:Subnet    shaht-privateSubnet-2               created (4s)        

    Outputs:
        primary_storage_key : [secret]
        private_subnets     : [
            [0]: "10.0.3.0/24"
            [1]: "10.0.4.0/24"
            [2]: "10.0.5.0/24"
        ]
        public_subnets      : [
            [0]: "10.0.0.0/24"
            [1]: "10.0.1.0/24"
            [2]: "10.0.2.0/24"
        ]
        resource_group_name : "shaht-rga0f3c7d2"
        storage_account_name: "shahtsa709c1fc6"
        virtual_network_name: "shaht-vneted0277d3"

    Resources:
        + 10 created

    Duration: 33s
    ```

1. View the outputs created via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)
   ```bash
   pulumi stack output
   ```
   Results

    ```bash
    Current stack outputs (6):
    OUTPUT                VALUE
    primary_storage_key   [secret]
    private_subnets       ["10.0.3.0/24","10.0.4.0/24","10.0.5.0/24"]
    public_subnets        ["10.0.0.0/24","10.0.1.0/24","10.0.2.0/24"]
    resource_group_name   shaht-rga0f3c7d2
    storage_account_name  shahtsa709c1fc6
    virtual_network_name  shaht-vneted0277d3
    ```


1. Destroy the network and subnet. Make sure all your `OTHER` stacks that depend on this network have their resources all deleted `BEFORE` you clean up any networking resources.
    ```bash
    pulumi destroy -y
    ```

1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```