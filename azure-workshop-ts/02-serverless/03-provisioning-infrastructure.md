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

```bash
Updating (dev)

View Live: https://app.pulumi.com/myuser/azure-serverlessfunction-workshop/dev/updates/1

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

```bash
Updating (dev)

View Live: https://app.pulumi.com/myuser/azure-serverlessfunction-workshop/dev/updates/2

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

```bash
Updating (dev)

View Live: https://app.pulumi.com/myuser/azure-serverlessfunction-workshop/dev/updates/3

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

## Step 4 &mdash; Retrieve Storage Account Keys and Build Connection String

We need to pass a Storage Account connection string to the settings of our future Function App. As this information is sensitive, Azure doesn't return it by default in the outputs of the Storage Account resource.

We need to make a separate invocation to the listStorageAccountKeys function to retrieve storage account keys. This invocation can only be run after the storage account is created. Therefore, we must place it inside an [apply](https://www.pulumi.com/docs/intro/concepts/inputs-outputs/#apply) call that depends on a storage account. 
We will also be using [all](https://www.pulumi.com/docs/intro/concepts/inputs-outputs/#all) since we need to use an `apply` over many resources.

Add this line to the `index.ts` right after creating the export of the consumption plan

```ts
// List of storage account keys 
const storageAccountKeys = pulumi.all([resourceGroup.name, storageAccount.name]).apply(([resourceGroupName, accountName]) =>
    storage.listStorageAccountKeys({ resourceGroupName, accountName }));
```

Extract the primary storage key of the storage account.
```ts
// Export the primary key of the Storage Account
export const primaryStorageKey = pulumi.secret(storageAccountKeys.keys[0].value);
```

The connection keys are sensitive data so we want to protect them as secrets.
Pulumi allows you to [programmatically create secrets](https://www.pulumi.com/docs/intro/concepts/secrets/#programmatically-creating-secrets).


We need to build the storage connection by calling [interpolate](https://www.pulumi.com/docs/intro/concepts/inputs-outputs/#outputs-and-strings).
```ts
// Build a storage connection string out of it
const storageConnectionString = pulumi.interpolate`DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${primaryStorageKey}`;
```

> :white_check_mark: After these changes, your `index.ts` should [look like this](./code/03/step4.ts).

Deploy the changes:

```bash
pulumi up
```
This will give you a preview and selecting `yes` will apply the changes:

```bash
Updating (dev)

View Live: https://app.pulumi.com/myuser/azure-serverlessfunction-workshop/dev/updates/4

     Type                 Name                                   Status     
     pulumi:pulumi:Stack  azure-serverlessfunction-workshop-dev             
 
Outputs:
    consumptionplan  : "consumption-plan3faf9113"
  + primaryStorageKey: "[secret]"
    resourcegroup    : "resourcegroup_functionsfa4409ed"
    storageaccount   : "storageaccount42a93abe"

Resources:
    4 unchanged

Duration: 4s
```

Notice that no resources are created.  This is expected as we were adding outputs. The primaryStorageKey is marked as **secret**.  To view it via the cli, run:  [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/) ```--show-secrets```

## Step 5 &mdash; Create a Function App

And then add these lines to `index.ts` right after creating the storageconnectionstring `export`
```ts
// Create the Function App
const app = new web.WebApp("functionapp", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    serverFarmId: plan.id,
    kind: "functionapp",
    siteConfig: {
        appSettings: [
            { name: "AzureWebJobsStorage", value: storageConnectionString },            
            { name: "FUNCTIONS_EXTENSION_VERSION", value: "~3" },            
            { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
            { name: "WEBSITE_NODE_DEFAULT_VERSION", value: "~14" },
            { name: "WEBSITE_RUN_FROM_PACKAGE", value: "https://github.com/tusharshahrs/demo/raw/main/content/lab/pulumi/azure-native/typescript/app.zip" },
        ]    
    },
});
```

The applications settings configure the app to run on Node.js v14 runtime and deploy the specified zip file(*(**typescript**) to the Function App. The app will download the specified file, extract the code from it, discover the functions, and run them.
We’ve prepared this zip file for you to get started faster, you can find its code [here](https://github.com/tusharshahrs/demo/tree/main/content/lab/pulumi/azure-native/typescript). The code contains a single HTTP-triggered Azure Function in the zip file.

> :white_check_mark: After these changes, your `index.ts` should [look like this](./code/03/step5.ts).

## Step 6 &mdash; Export the Function App endpoint

Finally, declare a stack output called endpoint to export the URL of the Azure Function using the defaultHostName. Now, if you inspect the type of the app.defaultHostname, you will see that it's `pulumi.Output<string>` not just `string`. That’s because Pulumi runs your program before it creates any infrastructure, and it wouldn’t be able to put an actual string into the variable. 
You can think of `Output<T>` as similar to `Promise<T>`, although they are not the same thing. A quick aside here, for those not familiar with what <T> is. <T> is a mechanism for denoting that the value is known at some point in the future.
It comes from [Generic Programming](https://en.wikipedia.org/wiki/Generic_programming) and is really useful in situations like this, when we (ie, us running our Pulumi programs) are waiting for the value to be returned from our cloud providers API.  
You want to export the full endpoint of your Function App. Add this to the end of your code after the functionapp called `app`

```ts
//Export the functionapp endpoint and create the url for it.
export const endpoint = pulumi.interpolate`https://${app.defaultHostName}/api/hello`;
```

> :white_check_mark: After these changes, your `index.ts` should [look like this](./code/03/step6.ts).

## Step 7 &mdash; Provision the Function App

Deploy the program to stand up your Azure Function App:

```bash
pulumi up
```

Results
```bash
Updating (dev)

View Live: https://app.pulumi.com/myuser/azure-serverlessfunction-workshop/dev/updates/5

     Type                        Name                                   Status      
     pulumi:pulumi:Stack         azure-serverlessfunction-workshop-dev              
 +   └─ azure-native:web:WebApp  functionapp                            created     
 
Outputs:
    consumptionplan  : "consumption-plan3faf9113"
  + endpoint         : "https://functionapp3aa367f4.azurewebsites.net/api/hello"
    primaryStorageKey: "[secret]"
    resourcegroup    : "resourcegroup_functionsfa4409ed"
    storageaccount   : "storageaccount42a93abe"

Resources:
    + 1 created
    4 unchanged

Duration: 47s
```

You can now view the stack output via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/):

```bash
pulumi stack output endpoint
```

You will get something similar to the following:

```bash
https://functionapp3aa367f4.azurewebsites.net/api/hello
```

You can now open the resulting endpoint in the browser or curl it:

```bash
curl $(pulumi stack output endpoint)
```

And you'll see a the following message:
**You've successfully deployed a Function App!**

## Step 8 &mdash; Destroy Everything

```bash
pulumi destroy
```
This will give you a preview and selecting `yes` will apply the changes:

```bash
Do you want to perform this destroy? yes
Destroying (dev)

View Live: https://app.pulumi.com/myuser/azure-serverlessfunction-workshop/dev/updates/6

     Type                                     Name                                   Status       
     pulumi:pulumi:Stack                      azure-serverlessfunction-workshop-dev               
 -   ├─ azure-native:web:WebApp               functionapp                            deleted      
 -   ├─ azure-native:web:AppServicePlan       consumption-plan                       deleted      
 -   ├─ azure-native:storage:StorageAccount   storageaccount                         deleted      
 -   └─ azure-native:resources:ResourceGroup  resourcegroup_functions                deleted

Outputs:
  - consumptionplan  : "consumption-plan3faf9113"
  - endpoint         : "https://functionapp3aa367f4.azurewebsites.net/api/hello"
  - primaryStorageKey: "[secret]"
  - resourcegroup    : "resourcegroup_functionsfa4409ed"
  - storageaccount   : "storageaccount42a93abe"

Resources:
    - 5 deleted

Duration: 58s
```

Remove the stack
```bash
pulumi stack rm
```
This will permanently remove the 'dev' stack!
Please confirm that this is what you'd like to do by typing ("dev"):

You must enter the stack name:  **dev**

Congratulations! :tada: You have completed the second lab.