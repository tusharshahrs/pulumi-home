# Making Your Stack Configurable

Right now, the container's name is hard-coded. Next, you'll make the name configurable.

## Step 1 &mdash; Adding a Config Variable

Instead of hard-coding the `"files"` container, we will use configuration to make it easy to change the name without editing the program.

Create a file `config.ts` and add this to it.  The `config.ts` will be in the same folder as the `index.ts` file:

```ts
import { Config } from "@pulumi/pulumi";

const config = new Config();
export const containerName = config.require("container");
```

> :white_check_mark: After this change, your `config.ts` should [look like this](./code/05/config.ts).

## Step 2 &mdash; Populating the Container Based on Config

Add this line to your `index.ts` file after the top import statements:

```ts
import { containerName } from "./config";
```

And replace the hard-coded `"files"` parameter with this imported `containerName` variable:

```typescript
// Create an Azure blob container
const mycontainer = new storage.BlobContainer("mycontainer", {
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name,
    containerName: containerName,
});
```

> :white_check_mark: After this change, your `index.ts` should [look like this](./code/05/index.ts).

## Step 3 &mdash; Deploying the Changes

Now, deploy your changes. To do so, first configure your stack. If you don't, you'll get an error:

```bash
pulumi up
```

This results in an error like the following:

```
Previewing update (dev)

View Live: https://app.pulumi.com/myuser/iac-workshop/dev/previews/f44c8f88-e84b-451b-b4a9-f5b5ae3179c6

     Type                 Name              Plan     Info
     pulumi:pulumi:Stack  iac-workshop-dev           1 error
 
Diagnostics:
  pulumi:pulumi:Stack (iac-workshop-dev):
    error: Missing required configuration variable 'iac-workshop:container'
        please set a value using the command `pulumi config set iac-workshop:container <value>`
```

We need to pass in a name for the `iac-workshop:container` variable:

```bash
pulumi config set container html
```

To make things interesting, I set the name to `html` which is different from the previously hard-coded value `files`.

Run `pulumi up` again. This detects that the container has changed and will perform a simple update:

```
Previewing update (dev)

View Live: https://app.pulumi.com/myuser/iac-workshop/dev/previews/6c32df8e-1aa6-4102-b4ab-88b0e9af53cf

     Type                                   Name              Plan        Info
     pulumi:pulumi:Stack                    iac-workshop-dev              
 +-  └─ azure-native:storage:BlobContainer  mycontainer       replace     [diff: ~containerName]
 
Outputs:
  ~ blobcontainer : "files" => output<string>

Resources:
    +-1 to replace
    3 unchanged
```

And you will see the contents added above when you run
```bash
az storage container list --account-name $(pulumi stack output storageaccount) -o table
```

The output will be
```
Name    Lease Status    Last Modified
------  --------------  -------------------------
html    unlocked        2021-06-22T18:10:12+00:00
```

## Next Steps

* [Creating a Second Stack](./06-creating-a-second-stack.md)