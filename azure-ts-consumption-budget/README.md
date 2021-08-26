# Azure Consumption Budget and switching languages for report
Create an Azure Consumption Budget and switch the local language for report

## Deployment
1. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step)

    ```bash
    az login
    ```

1. Create a new stack

    ```bash
    pulumi stack init dev
    ```
1. Install dependencies
    ```bash
    npm install
    ```
1. Configure the location to deploy the resources to. The Azure region to deploy to is pre-set to **WestUS** - but you can modify the region you would like to deploy to.

    ```bash
    pulumi config set azure-native:location eastus2
    ```
1. Note: That the **startDate** MUST be the **CURRENT** month, and the end date is in the **FUTURE**.  
    This is referencing the *timePeriod* input in the `index.ts`

1. Create that stack via `pulumi up`
    ```bash
    pulumi up -y
    ```

    Results
    ```bash
    Previewing update (dev)

    View Live: https://app.pulumi.com/myuser/azure-ts-consumption-budget/dev/previews/f0bd923e-d646-446a-ac1e-a15ee333eca6

        Type                                     Name                             Plan       
    +   pulumi:pulumi:Stack                      azure-ts-consumption-budget-dev  create     
    +   ├─ azure-native:resources:ResourceGroup  demo-rg                          create     
    +   └─ azure-native:consumption:Budget       demo-budget-                     create     
    
    Resources:
        + 3 to create

    Updating (dev)

    View Live: https://app.pulumi.com/myuser/azure-ts-consumption-budget/dev/updates/31

        Type                                     Name                             Status      
    +   pulumi:pulumi:Stack                      azure-ts-consumption-budget-dev  created     
    +   ├─ azure-native:resources:ResourceGroup  demo-rg                          created     
    +   └─ azure-native:consumption:Budget       demo-budget-                     created     
    
    Outputs:
        budget_amount       : 100.65
        budget_name         : "demo-budget-2b27d968"
        myresourcegroup_name: "demo-rgaa7db927"

    Resources:
        + 3 created

    Duration: 23s
    ```


1. View the outputs created via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)
   ```bash
   pulumi stack output
   ```
   Results
   ```bash
    OUTPUT                VALUE
    budget_amount         100.65
    budget_name           demo-budget-2b27d968
    myresourcegroup_name  demo-rgaa7db927
   ```


1. Clean up - Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```