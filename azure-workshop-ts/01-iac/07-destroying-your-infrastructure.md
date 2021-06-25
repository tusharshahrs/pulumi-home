# Destroying Your Infrastructure

The final step is to destroy all of the resources from the two stacks created.

## Step 1 &mdash;  Destroy Resources

First, destroy the resources in your current stack:

```bash
pulumi destroy
```

This will show you a preview, much like the `pulumi up` command does:

```bash
Previewing destroy (prod)

View Live: https://app.pulumi.com/shaht/iac-workshop/prod/previews/2853f6ba-ad92-44c6-9efc-d8919b6bc7ee

     Type                                     Name               Plan       
 -   pulumi:pulumi:Stack                      iac-workshop-prod  delete     
 -   ├─ azure-native:storage:BlobContainer    mycontainer        delete     
 -   ├─ azure-native:storage:StorageAccount   storageaccount     delete     
 -   └─ azure-native:resources:ResourceGroup  myresourcegroup    delete     
 
Outputs:
  - blobcontainer : "htmlprod"
  - resourcegroup : "myresourcegroup3c76c8d2"
  - storageaccount: "storageaccount356a1219"

Resources:
    - 4 to delete

Do you want to perform this destroy?  [Use arrows to move, enter to select, type to filter]
  yes
> no
  details
```

To proceed, select `yes`.

```bash
Destroying (prod)

View Live: https://app.pulumi.com/shaht/iac-workshop/prod/updates/2

     Type                                     Name               Status      
 -   pulumi:pulumi:Stack                      iac-workshop-prod  deleted     
 -   ├─ azure-native:storage:BlobContainer    mycontainer        deleted     
 -   ├─ azure-native:storage:StorageAccount   storageaccount     deleted     
 -   └─ azure-native:resources:ResourceGroup  myresourcegroup    deleted     
 
Outputs:
  - blobcontainer : "htmlprod"
  - resourcegroup : "myresourcegroup3c76c8d2"
  - storageaccount: "storageaccount356a1219"

Resources:
    - 4 deleted

Duration: 53s
```

## Step 2 &mdash;  Remove the Stack

The Azure resources for this stack have been destroyed. Per the message printed at the end, however, the stack itself is still known to Pulumi. This means all past history is still available and you can perform subsequent updates on this stack.

Now, fully remove the stack and all history:

```bash
pulumi stack rm
```

This is irreversible and so asks to confirm that this is your intent:

```bash
This will permanently remove the 'prod' stack!
Please confirm that this is what you'd like to do by typing ("prod"):
```

Type the name of the stack and hit enter. The stack is now gone.

## Step 3 &mdash;  Select Another Stack, Rinse and Repeat

After destroying `prod`, you still have the `dev` stack. To destroy it too, first select it:

```bash
pulumi stack select dev
```

Now, go back and repeat steps 1 and 2.

## Step 4 &mdash;  Verify That Stacks are Gone

Verify that all of this projec'ts stacks are now gone

```bash
pulumi stack ls
```

## Next Steps

Congratulations! :tada: You have completed the first lab.

Now that you're more familiar with infrastructure as code concepts and how the tool works, you can feel free to explore the more advanced collection of labs. These labs will teach you how to provision serverless workloads.

Lab 2 deploys an Azure Function App with HTTP-triggered serverless functions.

[Get Started with Lab 2](../02-serverless/README.md)