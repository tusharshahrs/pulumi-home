"""An Azure Python Pulumi program"""

import pulumi
from pulumi_azure import core
from pulumi_azure.operationalinsights import AnalyticsWorkspace
from pulumi_azure.appinsights import Insights
from pulumi import Output, ResourceOptions

# Create an Azure Resource Group with auto-naming
resource_group = core.ResourceGroup('resource_group')
pulumi.export("resource_group_name", resource_group.name)

# Creating an analyticsworkspace with autonaming
myworkspace = AnalyticsWorkspace('workspace',
        #workspace_name="workspace_number_1", # Uncomment this line if you want to set the name of the workspace.  We would recommend using auto-naming, and not set the name. 
        resource_group_name=resource_group.name,
        opts=ResourceOptions(parent=resource_group)       
        )

pulumi.export("workspace_id", Output.secret(myworkspace.id))
pulumi.export("workspace_name", myworkspace.name)

myinsights = Insights('insights',
        #name="insights_number_1", # Uncomment this line if you want to set the name of insights.  We would recommend using auto-naming, and not set the name.
        resource_group_name=resource_group.name,
        workspace_id=myworkspace.id,  # See https://www.pulumi.com/docs/reference/pkg/azure/appinsights/insights/
        application_type="web",
        opts=ResourceOptions(parent=resource_group)       
        )

pulumi.export("workspace_id", myworkspace.id)
pulumi.export("workspace_name", myworkspace.name)
pulumi.export("insight_name", myinsights.name)


import pulumi_azure_native as azure_native

native_resource_group = azure_native.resources.ResourceGroup("native-rg")
pulumi.export("azure_native_resource_group_name",native_resource_group.name)

native_workspace = azure_native.operationalinsights.Workspace("native-workspace",
    resource_group_name=native_resource_group.name,
    tags={
        "tag1": "val1",
    },
    opts=ResourceOptions(parent=native_resource_group)       

)

pulumi.export("azure_native_workspace_name",native_workspace.name)


insights_classic_and_native = Insights('insightsmixed',
        resource_group_name=native_resource_group.name,
        workspace_id=native_workspace.id,  # See https://www.pulumi.com/docs/reference/pkg/azure/appinsights/insights/
        application_type="web",
        opts=ResourceOptions(parent=native_resource_group)  
        )

pulumi.export("insights_mixed",insights_classic_and_native.name)
