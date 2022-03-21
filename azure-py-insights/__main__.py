"""An Azure RM Python Pulumi program"""

import pulumi
from pulumi_azure_native import resources, operationalinsights, insights
#from pulumi_azure_native import operationalinsights
from pulumi import ResourceOptions
import pulumi_azure as azure_classic


name = "demo"

# Create an Azure Resource Group
resource_group = resources.ResourceGroup(f'{name}-rg')

# Create a operationalinsights workspace
workspace = operationalinsights.Workspace(f'{name}-operationalinsights-workspace',
    resource_group_name=resource_group.name,
    tags={
        "tag1": "val1",
    },
    opts=ResourceOptions(parent=resource_group)       

)

# create insights using azure classic
insights = azure_classic.appinsights.Insights(f'{name}-Insights',
    resource_group_name=resource_group.name,
    application_type="web",
    workspace_id=workspace.id,
    opts=ResourceOptions(parent=resource_group))

pulumi.export("resource_group_name",resource_group.name)
pulumi.export("operationalinsights_workspace_name",workspace.name)
pulumi.export("insights_id", insights.name)