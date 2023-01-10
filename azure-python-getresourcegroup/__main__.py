"""An Azure RM Python Pulumi program"""

import pulumi
from pulumi_azure_native import resources, Provider
from pulumi import Config, InvokeOptions

config = Config()
mysubscription_id = config.get_secret("subscription_id")
mytenant_id = config.get_secret("tenant_id")
resourcegroup_1 = config.get("resource_group_1")
resourcegroup_2 = config.get("resource_group_2")


# Create an Azure Resource Group
myresource_group = resources.get_resource_group(resourcegroup_1)
pulumi.export("myresource_group_name", myresource_group.name)

name = "shahtazurenative"
az_provider = Provider(
    resource_name=f'{name}-Provider',
    subscription_id=mysubscription_id,
    tenant_id=mytenant_id,
  )

az_resource_group = resources.get_resource_group(
   resource_group_name= resourcegroup_2,
   opts=InvokeOptions(provider=az_provider),
 )

pulumi.export("az_resource_group_name", az_resource_group.name)
