"""An Azure RM Python Pulumi program"""

import pulumi
from pulumi_azure_native import storage
from pulumi_azure_native import resources
from pulumi import Output

name = "demo"
# Create an Azure Resource Group
resource_group = resources.ResourceGroup(f'{name}-resource_group')

# Create an Azure resource (Storage Account)
account = storage.StorageAccount(f'{name}sa',
    resource_group_name=resource_group.name,
    sku=storage.SkuArgs(
        name=storage.SkuName.STANDARD_LRS,
    ),
    kind=storage.Kind.STORAGE_V2)

# Export the primary key of the Storage Account
primary_key = pulumi.Output.all(resource_group.name, account.name) \
    .apply(lambda args: storage.list_storage_account_keys(
        resource_group_name=args[0],
        account_name=args[1]
    )).apply(lambda accountKeys: accountKeys.keys[0].value)

pulumi.export("resource_group_name", resource_group.name)
pulumi.export("storage_account_name", account.name)
pulumi.export("storage_account_id", Output.secret(account.id))
pulumi.export("primary_storage_key", Output.secret(primary_key))
