# Azure Native Resource Groups, Workspace and Azure Classic Insights
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
   ```

1. Run `pulumi up` to preview and deploy changes: You must select `y` to continue
  
    ```bash
    pulumi up
    ```

    Results
    ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/azure-py-insights/dev/updates/6

        Type                                              Name                                Status      
    +   pulumi:pulumi:Stack                               azure-py-insights-dev               created     
    +   └─ azure-native:resources:ResourceGroup           demo-rg                             created     
    +      ├─ azure-native:operationalinsights:Workspace  demo-operationalinsights-workspace  created     
    +      └─ azure:appinsights:Insights                  demo-Insights                       created     
    
    Outputs:
        insights_id                       : "demo-insightsff5813fa"
        operationalinsights_workspace_name: "demo-operationalinsights-workspace55e4a7fc"
        resource_group_name               : "demo-rgdbd5593e"

    Resources:
        + 4 created

    Duration: 1m35s
    ```

1. View the outputs created via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)
   ```bash
   pulumi stack output
   ```

   Results
    ```bash
    Current stack outputs (3):
    OUTPUT                              VALUE
    insights_id                         demo-insightsff5813fa
    operationalinsights_workspace_name  demo-operationalinsights-workspace55e4a7fc
    resource_group_name                 demo-rgdbd5593e
    ```

1. Clean Up
    ```bash
    pulumi destroy -y
    ```

1. Remove the stack.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev
   ```