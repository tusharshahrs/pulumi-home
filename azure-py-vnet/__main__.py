"""An Azure RM Python Pulumi program"""

import pulumi
from pulumi_azure_native import resources
from pulumi_azure_native import network
from pulumi import export, Config, get_stack, get_project

config = Config()
network_cidr_block = config.get("virtual_network_cidr")
subnet_1_cidr_block = config.get("subnet_1_cidr")
subnet_2_cidr_block = config.get("subnet_2_cidr")
name = config.get("mynames")

projectName = get_project()
stackName = get_stack()

mytags = {"stack":stackName,"project":projectName,"env":"dev","launched_via":"pulumi", "team":"engineering","cli":"yes"}

# Create an Azure Resource Group
resourcegroup = resources.ResourceGroup(f"{name}-resource_group",
    tags=mytags,
)

# Create an Azure VNET
virtual_network = network.VirtualNetwork(f"{name}-vnet",
    address_space={
        "addressPrefixes": [network_cidr_block],
    },
    resource_group_name=resourcegroup.name,
    tags=mytags)

# Create subnet1
subnet1 = network.Subnet(f"{name}-subnet1",
    resource_group_name=resourcegroup.name,
    virtual_network_name=virtual_network.name,
    address_prefix=subnet_1_cidr_block,
    )

# Create subnet2
subnet2 = network.Subnet(f"{name}-subnet2",
    resource_group_name=resourcegroup.name,
    virtual_network_name=virtual_network.name,
    address_prefix=subnet_2_cidr_block,
    )

pulumi.export("resourcegroup_name", resourcegroup.name)
pulumi.export("vnet_name", virtual_network.name)
pulumi.export("vnet_cidr_block", virtual_network.address_space)
pulumi.export("vnet_subnet1_cidr_name", subnet1.name)
pulumi.export("vnet_subnet1_cidr_block", subnet1.address_prefix)
pulumi.export("vnet_subnet2_cidr_name", subnet2.name)
pulumi.export("vnet_subnet2_cidr_block", subnet2.address_prefix)