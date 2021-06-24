"""An Azure RM Python Pulumi program"""

import pulumi
from pulumi_azure_native import storage
from pulumi_azure_native import resources
from pulumi_azure_native import databricks
from pulumi import get_stack, get_project, Output

# Creating Tags
# stackname for tags
stackName = get_stack()
# projectname for tags
projectName = get_project()
basetags = {"cost-center": projectName, "stack":stackName, "env":"databricks","team":"engineering", "pulumi_cli":"yes", "console_azure":"no"}

# Create an Azure Resource Group
resourcegroup = resources.ResourceGroup('databricks-resource_group',
tags = basetags)

# Figure out the subscriptionId
subscriptionId = resourcegroup.id.apply(lambda id: id.split("/")[2])

# This cannot be created via resource group. This only gets created during databricks creation.
databricks_managed_resource_group = "databricks-managed-rg"

# Creating the managed_resource_group_id string.  
mymanaged_resource_group_id = Output.concat("/subscriptions/",subscriptionId,"/resourceGroups/",databricks_managed_resource_group)

# Databricks workspace
workspace = databricks.Workspace('databricks-workspace',
    resource_group_name=resourcegroup.name,
    location = resourcegroup.location,
    parameters=databricks.WorkspaceCustomParametersArgs(
        prepare_encryption=databricks.WorkspaceCustomBooleanParameterArgs(
            value=True,
        ),
    ),
    managed_resource_group_id=mymanaged_resource_group_id,
    tags = basetags,
)

# Exporting outputs
pulumi.export("resourcegroup_name", resourcegroup.name)
pulumi.export("databricks_managed_resource_group", databricks_managed_resource_group)
pulumi.export("databricks_workspace_name", workspace.name)
pulumi.export("databricks_workspace_status", workspace.provisioning_state)
pulumi.export("databricks_workspace_url", workspace.workspace_url)