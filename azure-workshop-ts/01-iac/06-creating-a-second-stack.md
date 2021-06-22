# Creating a Second Stack

It is easy to create multiple instances of the same project. This is called a stack. This is handy for multiple development or test environments, staging versus production, and scaling a given infrastructure across many regions.

## Step 1 &mdash; Create and Configure a New Stack

Create a new stack:

```bash
pulumi stack init prod
```

Next, configure its required variable:

```bash
pulumi config set container htmlprod
```

Next, configure the region.  We can use the same region or even a **different region**
```bash
pulumi config set azure-native:location eastus
```

If you are ever curious to see the list of stacks for your current project, run this command:

```bash
pulumi stack ls
```

It will print all stacks for this project that are available to you:

```bash
NAME   LAST UPDATE     RESOURCE COUNT  URL
dev    48 minutes ago  5               https://app.pulumi.com/shaht/iac-workshop/dev
prod*  n/a             n/a             https://app.pulumi.com/shaht/iac-workshop/prod
```

Note that the `*` means the stack we have currently selected.  You can switch stacks via [pulumi stack select](https://www.pulumi.com/docs/reference/cli/pulumi_stack_select/).  Since we have never deployed the stack, 
you will see **n/a** showup.
## Step 2 &mdash; Deploy the New Stack

Now deploy all of the changes:

```bash
pulumi up
```

This will create an entirely new set of resources from scratch, unrelated to the existing `dev` stack's resources.
This is created in a different Azure region.

```
Previewing update (prod)

View Live: https://app.pulumi.com/myuser/iac-workshop/prod/previews/3013316a-4628-486b-9ce0-189d6b64b8e1

     Type                                     Name               Plan       
 +   pulumi:pulumi:Stack                      iac-workshop-prod  create     
 +   ├─ azure-native:resources:ResourceGroup  myresourcegroup    create     
 +   ├─ azure-native:storage:StorageAccount   storageaccount     create     
 +   └─ azure-native:storage:BlobContainer    mycontainer        create     
 
Resources:
    + 4 to create

Do you want to perform this update? yes
Updating (prod)

View Live: https://app.pulumi.com/myuser/iac-workshop/prod/updates/1

     Type                                     Name               Status      
 +   pulumi:pulumi:Stack                      iac-workshop-prod  created     
 +   ├─ azure-native:resources:ResourceGroup  myresourcegroup    created     
 +   ├─ azure-native:storage:StorageAccount   storageaccount     created     
 +   └─ azure-native:storage:BlobContainer    mycontainer        created     
 
Outputs:
    blobcontainer : "htmlprod"
    resourcegroup : "myresourcegroup3c76c8d2"
    storageaccount: "storageaccount356a1219"

Resources:
    + 4 created

Duration: 27s
```

A new set of resources has been created for the `prod` stack.
```bash
pulumi stack output
```

Output
```
Current stack is prod:
    Owner: myuser
    Last updated: 26 minutes ago (2021-06-22 15:01:27.679572 -0400 EDT)
    Pulumi version: v3.5.1
Current stack resources (5):
    TYPE                                         NAME
    pulumi:pulumi:Stack                          iac-workshop-prod
    ├─ azure-native:resources:ResourceGroup      myresourcegroup
    ├─ azure-native:storage:StorageAccount       storageaccount
    ├─ azure-native:storage:BlobContainer        mycontainer
    └─ pulumi:providers:azure-native             default_1_13_0

Current stack outputs (3):
    OUTPUT          VALUE
    blobcontainer   htmlprod
    resourcegroup   myresourcegroup3c76c8d2
    storageaccount  storageaccount356a1219

More information at: https://app.pulumi.com/myuser/iac-workshop/prod
```

Let's check out the storage
```bash
az storage container list --account-name $(pulumi stack output storageaccount) -o table
```

Output
```
Name      Lease Status    Last Modified
--------  --------------  -------------------------
htmlprod  unlocked        2021-06-22T19:01:27+00:00
```
## Next Steps

* [Destroying Your Infrastructure](./07-destroying-your-infrastructure.md)