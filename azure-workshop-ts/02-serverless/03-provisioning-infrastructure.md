# Provisioning Infrastructure

Now that you have a project configured to use Azure, you'll create some basic infrastructure in it. We will start with a Resource Group.

## Step 1 &mdash; Declare a New Resource Group and Export it

Add the following to your `index.ts` file. Programs can export variables which will be shown in the CLI and recorded for each deployment:

```ts
import * as resources from "@pulumi/azure-native/resources";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("resourcegroup_functions");

// Export the Azure Resource Group
export const resourcegroup = resourceGroup.name;
```

> :white_check_mark: After this change, your `index.ts` should [look like this](./code/03/step1.ts).

Deploy the changes:

```bash
pulumi up
```

This will give you a preview and selecting `yes` will apply the changes:

```
Updating (dev)

View Live: https://app.pulumi.com/shaht/azure-serverlessfunction-workshop/dev/updates/1

     Type                                     Name                                   Status      
 +   pulumi:pulumi:Stack                      azure-serverlessfunction-workshop-dev  created     
 +   └─ azure-native:resources:ResourceGroup  resourcegroup_functions                created     
 
Outputs:
    resourcegroup: "resourcegroup_functionsfa4409ed"

Resources:
    + 2 created

Duration: 6s
```
## Step 2 &mdash; Add a Storage Account

Add this line to the `index.ts` right after the `import resources` at the top

```ts
import * as storage from "@pulumi/azure-native/storage";
```

And then add these lines to `index.ts` right after creating the resource group:

```ts
// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount("storageaccount", {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
});
```

Add this line after the resource group export
```ts
// Export the Storage Account
export const storageaccount = storageAccount.name;
```

> :white_check_mark: After these changes, your `index.ts` should [look like this](./code/03/step2.ts).

Deploy the changes:

```bash
pulumi up
```
This will give you a preview and selecting `yes` will apply the changes:

```
Updating (dev)

View Live: https://app.pulumi.com/shaht/azure-serverlessfunction-workshop/dev/updates/2

     Type                                    Name                                   Status      
     pulumi:pulumi:Stack                     azure-serverlessfunction-workshop-dev              
 +   └─ azure-native:storage:StorageAccount  storageaccount                         created     
 
Outputs:
    resourcegroup : "resourcegroup_functionsfa4409ed"
  + storageaccount: "storageaccount42a93abe"

Resources:
    + 1 created
    2 unchanged

Duration: 23s
```

## Step 3 &mdash; Define a Consumption Plan
There are several options to deploy Azure Functions. The serverless pay-per-execution hosting plan is called _Consumption Plan_.

There’s no resource named Consumption Plan, however. The resource name is inherited from Azure App Service: Consumption is one kind of an [App Service Plan](https://www.pulumi.com/docs/reference/pkg/azure-native/web/appserviceplan/). It’s the SKU property of the resource that defines the type of hosting plan.

Here is a snippet that defines a Consumption Plan:

Add this line to the `index.ts` right after the `import storage` at the top

```ts
import * as web from "@pulumi/azure-native/web";
```

Add this line to the `index.ts` right after creating the storage resources
```ts
// Create a consumption plan
const plan = new web.AppServicePlan("consumption-plan", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    kind: "functionapp",
    sku: {
        name: "Y1",
        tier: "Dynamic",
    },
});
```

And then add these lines to `index.ts` right after the storage account export:

```ts
// Export the Consumption Plan
export const consumptionplan = plan.name;
```

Note the specific way that the property `sku` is configured. If you ever want to deploy to another type of a service plan, you would need to change these values accordingly.

> :white_check_mark: After these changes, your `index.ts` should [look like this](./code/03/step3.ts).

Deploy the changes:

```bash
pulumi up
```
This will give you a preview and selecting `yes` will apply the changes:

```
Updating (dev)

View Live: https://app.pulumi.com/shaht/azure-serverlessfunction-workshop/dev/updates/3

     Type                                Name                                   Status      
     pulumi:pulumi:Stack                 azure-serverlessfunction-workshop-dev              
 +   └─ azure-native:web:AppServicePlan  consumption-plan                       created     
 
Outputs:
  + consumptionplan: "consumption-plan3faf9113"
    resourcegroup  : "resourcegroup_functionsfa4409ed"
    storageaccount : "storageaccount42a93abe"

Resources:
    + 1 created
    3 unchanged

Duration: 9s
```    
