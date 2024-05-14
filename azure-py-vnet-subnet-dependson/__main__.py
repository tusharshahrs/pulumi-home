"""An Azure RM Python Pulumi program"""

import pulumi
from pulumi_azure_native import storage
from pulumi_azure_native import resources
from pulumi_azure_native import network
from pulumi import Output, export, ResourceOptions

name = "shaht"

# Create an Azure Resource Group
resource_group = resources.ResourceGroup(f"{name}-rg")
export("resource_group_name", resource_group.name)


# Create an Azure resource (Storage Account)
account = storage.StorageAccount(
    f"{name}sa",
    resource_group_name=resource_group.name,
    sku=storage.SkuArgs(
        name=storage.SkuName.STANDARD_LRS,
    ),
    kind=storage.Kind.STORAGE_V2,
    opts=ResourceOptions(parent=resource_group),
)

export("storage_account_name", account.name)

# Export the primary key of the Storage Account
primary_key = (
    pulumi.Output.all(resource_group.name, account.name)
    .apply(
        lambda args: storage.list_storage_account_keys(
            resource_group_name=args[0], account_name=args[1]
        )
    )
    .apply(lambda accountKeys: accountKeys.keys[0].value)
)

pulumi.export("primary_storage_key", pulumi.Output.secret(primary_key))


# Create an Azure VNET
virtual_network = network.VirtualNetwork(f"{name}-vnet",
    address_space={
        "addressPrefixes": ["10.0.0.0/21"],
    },
    resource_group_name=resource_group.name,
    opts=ResourceOptions(parent=resource_group),
    )

export("virtual_network_name", virtual_network.name)

"""
https://www.davidc.net/sites/default/subnets/subnets.html
VNET: 10.0.0.0 Mask Bits: 21
Subnet address	Range of addresses	Useable IPs	Hosts	Divide	Join
10.0.0.0/24	10.0.0.0 - 10.0.0.255	10.0.0.1 - 10.0.0.254	254	Divide   			
10.0.1.0/24	10.0.1.0 - 10.0.1.255	10.0.1.1 - 10.0.1.254	254	Divide	
10.0.2.0/24	10.0.2.0 - 10.0.2.255	10.0.2.1 - 10.0.2.254	254	Divide		
10.0.3.0/24	10.0.3.0 - 10.0.3.255	10.0.3.1 - 10.0.3.254	254	Divide	
10.0.4.0/24	10.0.4.0 - 10.0.4.255	10.0.4.1 - 10.0.4.254	254	Divide			
10.0.5.0/24	10.0.5.0 - 10.0.5.255	10.0.5.1 - 10.0.5.254	254	Divide	
10.0.6.0/24	10.0.6.0 - 10.0.6.255	10.0.6.1 - 10.0.6.254	254	Divide		
10.0.7.0/24	10.0.7.0 - 10.0.7.255	10.0.7.1 - 10.0.7.254	254	Divide	
"""


public_subnets = []
public_subnets_ip = []
private_subnets = []
private_subnets_ip = []

# For loop to create 3 public and 3 private subnets
for i in range(3):
    # Create a public subnet
    mysubnet = network.Subnet(f'{name}-publicSubnet-{i+1}',
        address_prefix=f"10.0.{i}.0/24",
        resource_group_name=resource_group.name,
        virtual_network_name=virtual_network.name,
        opts=ResourceOptions(parent=virtual_network)
        )
    public_subnets.append(mysubnet)
    public_subnets_ip.append(mysubnet.address_prefix)

    
    # Create a private subnet
    mysubnetp = network.Subnet(f'{name}-privateSubnet-{i+1}',
        address_prefix=f"10.0.{i+3}.0/24",
        resource_group_name=resource_group.name,
        virtual_network_name=virtual_network.name,
        opts=ResourceOptions(parent=mysubnet, depends_on=[mysubnet])
        )

    private_subnets.append(mysubnetp)
    private_subnets_ip.append(mysubnetp.address_prefix)
    
export("public_subnets", public_subnets_ip )
export("private_subnets", private_subnets_ip )
