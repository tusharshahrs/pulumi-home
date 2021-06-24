"""An Azure RM Python Pulumi program"""

import pulumi
from pulumi_azure_native import resources

# Create an Azure Resource Group
resource_group = resources.ResourceGroup('resourcegroup')

subscriptionId = pulumi.Output.secret(resource_group.id.apply(lambda id: id.split("/")[2]))
pulumi.export("resource_group_name", resource_group.name)
pulumi.export("resource_group_id", pulumi.Output.secret(resource_group.id))
pulumi.export("subscription_id", subscriptionId)
