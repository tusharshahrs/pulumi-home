# Azure Native and Azure Classic Resource Groups, Workspace, and Insights
Deploys resource groups, workspace, and insights with azure classic.
Deploys resource group & workspace with azure-native and creates insights with azure classic.

## Deployment

1. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step)

    ```bash
    az login
    ```

1. Create a new stack:

    ```bash
    pulumi stack init dev
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
   pulumi config set azure:location eastus2
   ```

1. Run `pulumi up` to preview and deploy changes: You must select `y` to continue
  
    ```bash
    pulumi up
    ```

    Results
    ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/myuser/azure-classic-py-insights/dev/updates/11

        Type                                                Name                           Status      
    +   pulumi:pulumi:Stack                                 azure-classic-py-insights-dev  created     
    +   ├─ azure:core:ResourceGroup                         resource_group                 created     
    +   │  ├─ azure:operationalinsights:AnalyticsWorkspace  workspace                      created     
    +   │  └─ azure:appinsights:Insights                    insights                       created     
    +   └─ azure-native:resources:ResourceGroup             native-rg                      created     
    +      ├─ azure-native:operationalinsights:Workspace    native-workspace               created     
    +      └─ azure:appinsights:Insights                    insightsmixed                  created     
    
    Outputs:
        azure_native_resource_group_name: "native-rg45f3b003"
        azure_native_workspace_name     : "native-workspace2d6e3444"
        insight_name                    : "insightsfd750b60"
        insights_mixed                  : "insightsmixedc49b30ac"
        resource_group_name             : "resource_group7d05c29e"
        workspace_id                    : "[secret]"
        workspace_name                  : "workspace679fec6"

    Resources:
        + 7 created

    Duration: 2m4s

    ```

1. View the outputs created via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)
   ```bash
   pulumi stack output
   ```

   Results
    ```bash
    Current stack outputs (7):
    OUTPUT                            VALUE
    azure_native_resource_group_name  native-rg45f3b003
    azure_native_workspace_name       native-workspace2d6e3444
    insight_name                      insightsfd750b60
    insights_mixed                    insightsmixedc49b30ac
    resource_group_name               resource_group7d05c29e
    workspace_id                      [secret]
    workspace_name                    workspace679fec6
    ```

1. Destroy the network and subnet. Make sure all your `OTHER` stacks that depend on this network have their resources all deleted `BEFORE` you clean up any networking resources.
    ```bash
    pulumi destroy -y
    ```

1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```