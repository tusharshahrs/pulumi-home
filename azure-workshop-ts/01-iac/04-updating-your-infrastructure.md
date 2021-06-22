# Updating Your Infrastructure

We just saw how to create new infrastructure from scratch. Next, let's add an Azure Storage Account to the existing resource group.

This demonstrates how declarative infrastructure as code tools can be used not just for initial provisioning, but also subsequent changes to existing resources.

## Step 1 &mdash; Add a Storage Account

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

> :white_check_mark: After this change, your `index.ts` should [look like this](./code/04/step1/index.ts).

Deploy the changes:

```bash
pulumi up
```

This will give you a preview and selecting `yes` will apply the changes:

```
Updating (dev)

View Live: https://app.pulumi.com/myuser/iac-workshop/dev/updates/2

     Type                                    Name              Status      
     pulumi:pulumi:Stack                     iac-workshop-dev              
 +   └─ azure-native:storage:StorageAccount  storageaccount    created     
 
Outputs:
    resourcegroup: "myresourcegroup01e531dc"

Resources:
    + 1 created
    2 unchanged

Duration: 24s
```

A single resource is added and two existing resources are left unchanged. This is a key attribute of infrastructure as code &mdash; such tools determine the minimal set of changes necessary to update your infrastructure from one version to the next.

## Step 2 &mdash; Export Your New Storage Account Name

Programs can export variables which are shown in the CLI and recorded for each deployment. Export your account's name by adding this line to `index.ts` after the resource group export:

```ts
// Export the Storage Account
export const storageaccount = storageAccount.name;
```

> :white_check_mark: After this change, your `index.ts` should [look like this](./code/04/step2/index.ts).


Now deploy the changes:

```bash
pulumi up
```

Notice a new `Outputs` section is included in the output containing the storage account's name:

```
Updating (dev)

View Live: https://app.pulumi.com/myuser/iac-workshop/dev/updates/3

     Type                 Name              Status     
     pulumi:pulumi:Stack  iac-workshop-dev             
 
Outputs:
    resourcegroup : "myresourcegroup01e531dc"
  + storageaccount: "storageaccounta4315b55"

Resources:
    3 unchanged

Duration: 3s
```

## Step 3 &mdash; Inspect Your New Storage Account

Now run the `az` CLI to list the containers in this new account:

```bash
az storage container list --account-name $(pulumi stack output storageaccount)
```

The response will be **[]**
```
There are no credentials provided in your command and environment, we will query for account key for your storage account.
It is recommended to provide --connection-string, --account-key or --sas-token in your command as credentials.

You also can add `--auth-mode login` in your command to use Azure Active Directory (Azure AD) for authorization if your login account is assigned required RBAC roles.
For more information about RBAC roles in storage, visit https://docs.microsoft.com/en-us/azure/storage/common/storage-auth-aad-rbac-cli.

In addition, setting the corresponding environment variables can avoid inputting credentials in your command. Please use --help to get more information about environment variable usage.
[]
```

Note that the account is currently empty.

## Step 4 &mdash; Add a Container to Your Storage Account

Add these lines to the `index.ts` file after the storage account:

```ts
// Create an Azure blob container
const container = new storage.BlobContainer("mycontainer", {
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name,
    containerName: "files",
});
```

Add these lines ot the `index.ts` file after the export of the storage account

```ts
// Export the Blob Container
export const blobcontaine = container.name;
```
> :white_check_mark: After this change, your `index.ts` should [look like this](./code/04/step4/index.ts).

Deploy the changes:

```bash
pulumi up
```

This will give you a preview and selecting `yes` will apply the changes:

```
View Live: https://app.pulumi.com/myuser/iac-workshop/dev/updates/4

     Type                                   Name              Status      
     pulumi:pulumi:Stack                    iac-workshop-dev              
 +   └─ azure-native:storage:BlobContainer  mycontainer       created     
 
Outputs:
  + blobcontainer : "files"
    resourcegroup : "myresourcegroup01e531dc"
    storageaccount: "storageaccounta4315b55"

Resources:
    + 1 created
    3 unchanged

Duration: 5s
```

Finally, relist the contents of your account:

```bash
az storage container list --account-name $(pulumi stack output storageaccount) -o table
```

Output will be
```
Name    Lease Status    Last Modified
------  --------------  -------------------------
files   unlocked        2021-06-22T17:49:13+00:00
```

Notice that your `files` container has been added.

## Next Steps

* [Making Your Stack Configurable](./05-making-your-stack-configurable.md)