# Provisioning Infrastructure

Now that you have a project configured to use Azure, you'll create some basic infrastructure in it. We will start with a Resource Group.

## Step 1 &mdash; Declare a New Resource Group and Export it

Add the following to your `index.ts` file. Programs can export variables which will be shown in the CLI and recorded for each deployment:

```ts
import * as resources from "@pulumi/azure-native/resources";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("myresourcegroup");

// Export the Azure Resource Group
export const resourcegroup = resourceGroup.name;
```

> :white_check_mark: After this change, your `index.ts` should [look like this](./code/03/index.ts).

## Step 2 &mdash; Preview Your Changes

Now preview your changes:

```bash
pulumi up
```

This command evaluates your program, determines the resource updates to make, and shows you an outline of these changes:

```
Previewing update (dev)

View Live: https://app.pulumi.com/myuser/iac-workshop/dev/previews/d56eb674-e62c-4045-9e55-35305d4b21cb

     Type                                     Name              Plan       
 +   pulumi:pulumi:Stack                      iac-workshop-dev  create     
 +   └─ azure-native:resources:ResourceGroup  myresourcegroup   create     
 
Resources:
    + 2 to create

Do you want to perform this update?  [Use arrows to move, enter to select, type to filter]
  yes
> no
  details
```

This is a summary view. Select `details` to view the full set of properties:

```
+ pulumi:pulumi:Stack: (create)
    [urn=urn:pulumi:dev::iac-workshop::pulumi:pulumi:Stack::iac-workshop-dev]
    + azure-native:resources:ResourceGroup: (create)
        [urn=urn:pulumi:dev::iac-workshop::azure-native:resources:ResourceGroup::myresourcegroup]
        [provider=urn:pulumi:dev::iac-workshop::pulumi:providers:azure-native::default_1_13_0::04da6b54-80e4-46f7-96ec-b56ff0331ba9]
        location            : "eastus2"
        resourceGroupName   : "myresourcegroupe8469946"

Do you want to perform this update?
 yes
> no
  details
```

The stack resource is a synthetic resource that all resources your program creates are parented to.

## Step 3 &mdash; Deploy Your Changes

Now that we've seen the full set of changes, let's deploy them. Select `yes`:

```
Updating (dev)

View Live: https://app.pulumi.com/myuser/iac-workshop/dev/updates/1

     Type                                     Name              Status      
 +   pulumi:pulumi:Stack                      iac-workshop-dev  created     
 +   └─ azure-native:resources:ResourceGroup  myresourcegroup   created     
 
Outputs:
    resourcegroup: "myresourcegroup01e531dc"

Resources:
    + 2 created

Duration: 5s
```

Now your resource group has been created in your Azure account. Feel free to click the Permalink URL and explore; this will take you to the [Pulumi Console](https://www.pulumi.com/docs/intro/console/), which records your deployment history.

## Step 4 &mdash; View your Stack Outputs

We created a resource group and to see what it is we can show a stack's output properties via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)

```bash
pulumi stack output
```

will display

```
Current stack outputs (1):
    OUTPUT           VALUE
    resourcegroup  myresourcegroup01e531dc
```

Note that Pulumi appends a suffix to the physical name of the resource group, e.g. `myresourcegroup01e531dc`. The difference between logical and physical names is due to "auto-naming" which Pulumi does to ensure side-by-side projects and zero-downtime upgrades work seamlessly. It can be disabled if you wish; [read more about auto-naming here](https://www.pulumi.com/docs/intro/concepts/programming-model/#autonaming).


## Next Steps

* [Updating Your Infrastructure](./04-updating-your-infrastructure.md)