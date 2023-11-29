**Zero Downtime with Downtime mixed in**

    1. Create a new directory and cd into it.  This way we know it is empty. We are not going to use the same one as last time so you can see the difference in the code.

    ```bash
    mkdir azure-ts-rg-sg-downtimemix
    cd azure-ts-rg-sg-downtimemix
    ```

    1. Call pulumi new to initiate a stack
    ```bash
    pulumi new aws-typescript
    ```
    My stack name is:  `shahtdev`

    Name the stack with your lastname_dev such that it is: `yourlastnamedev`

    Location:  Last time we used eastus2, so we will do the same this time.  Set it to:  `eastus2`.

* Azure Configurations 

    1. If you need to view this, you can see that it is set in the `Pulumi.yourlastnamedev.yaml`.  Let's say we entered the wrong information, we can easily change that via `pulumi config`

    ```bash
    pulumi config set azure-native:location uswest2
    ```
    
    The `Pulumi.yourlastnamedev.yaml` will be autoupdated.

    Now we are going to set this back to what it was at the start

    ```bash
    pulumi config set azure-native:location eastus2
    ```

    1. Let's check what you current azure subscription is set to:
    ```bash
    az subscription list
    ```

    1.  Set your current azure subscription.  Note this is what I am doing. Make sure you have access to the sandbox account(Verify this on call).
    ```
    az account set --subscription
    ```
    So to make sure you set the subscription, we have to do that via `pulumi config set`
    
    ```bash
    pulumi config set azure-native:subscripitionId UPDATED_SUBSCRIPTION_ID
    ```

    1. Now `Pulumi.lastnamedev.yaml` has the azure-native subscriptions set. ( Note, you must have this set for this to work)

    1. Check which stack we are on via:  
        ```bash
        pulumi stack ls
        ```

        The active stack will have a `*`

    1.  Log into the Azure Portal with your non-team account and go to
        Privileged Identity Management 
        Microsoft Entra Roles
        Azure Resources 
        PIM:  https://portal.azure.com/#view/Microsoft_Azure_PIMCommon/ActivationMenuBlade/~/azurerbac
        ( Let's talk about PIM before training or during training)

        Search for `azure learning environment`
        Role called:  `Contributor` Scroll to the right and click on the `Activate`
        Set the Duration to some hours
        Reason:  Demoing sandbox for Pulumi

    * Pulumi Resource Group

    Comment everything out and then replace it with the following:

    ```typescript
    // Create an Azure Resource Group.  We have to add the tags for the resource group to come up.
    const mygroup = new resources.ResourceGroup("myRG", {
        tags: {
            env: 'dev',
            app: 'app101',
            servicetier: 'blue',
            owneremail: 'test@yahoo.com',
        },

    });
    
    
    // Creates an output
    export const resourceGroupName = myresourceGroup.name;
    ```
    
        
   1. Rename the `mygoup` to `myresourcegroup`.  Note, we will have to update the output before the .name What do we expect to happen?
      Answer: Nothing, resources are not created or deleted when we change the name of the variable on the left.

    ```typescript
    // Create an Azure Resource Group.  We have to add the tags for the resource group to come up.
    const myresourceGroup = new resources.ResourceGroup("myRG", {  // We renamed this myresourcegroup
        tags: {
            env: 'dev',
            app: 'app101',
            servicetier: 'blue',
            owneremail: 'test@yahoo.com',
        },

    });
    // Creates an output
    export const resourceGroupName = myresourceGroup.name;  // Make sure to update the output
    ```


   1. Let's add a storage account:

   ```typescript
    // Create an Azure resource (Storage Account)
    const mystorageAccount = new storage.StorageAccount("sa", {
        resourceGroupName: myresourcegroup.name,
        sku: {
            name: storage.SkuName.Standard_LRS,
        },
        kind: storage.Kind.StorageV2,
    });

    // Creates an output
    export const storageAccountName = mystorageAccount.name;
   ```

   1.  What happens when we run pulumi up.  Let's check the diff.  Lets look at the `diff` in details.  What color is it?  Green
       Green goes 1st.  Remember that since it is create.

   1. Rename the resource group from: `myRG` to `myRGrename`
      Notice, that when we do this, it will do a create-replace.

   ```typescript
    const myresourceGroup = new resources.ResourceGroup("myRG", {  // We renamed myRG to myRGrename
        tags: {
            env: 'dev',
            app: 'app101',
            servicetier: 'blue',
            owneremail: 'test@yahoo.com',
        },
    });
    ```

  1.  Now check out the preview.  It will show:  Remember:  CRUD - Create, replaced, and then Delete.
      create
      replace  [diff: ~resourceGroupName]
      delete
   
  1. Next we are going to change the resource group name to:  Shows CRUD
     `resourceGroupName: "shahtestresourcegroup",` # We are hard coding the resource group here on purpose.
    This will show 2 resources updated.

  1. Rename the `resourceGroupName: "shahtestresourcegroup",` to:
    `resourceGroupName: "shahtrg",`  # Hard coded resource group renamed
    Note, when you run pulumi up, the preview will show:
    replace     [diff: ~accountName,resourceGroupName]
    replace     [diff: ~resourceGroupName]
    
    Check the details:
     Delete Happens 1st - This is different than anything we have been doing so far.
     Then it says it will `replace`` it
     Then it has `create-replace``