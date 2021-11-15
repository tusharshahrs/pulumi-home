# Configuring Azure

Now that you have a basic project, let's configure Azure support for it.

## Step 1 &mdash; Install the Azure Native Package

Run the following command to install the Azure Native package:

```bash
npm install @pulumi/azure-native
```

The package will be added to `node_modules/`, `package.json`, and `package-lock.json`.

## Step 2 &mdash; Configure an Azure Region

The Azure region to deploy to is pre-set to WestUS - but you can modify the region you would like to deploy to:

```bash
pulumi config set azure-native:location eastus2
```

[pulumi config set](https://www.pulumi.com/docs/reference/cli/pulumi_config_set/) allows us to pass in [configuration values](https://www.pulumi.com/docs/intro/concepts/config/#setting-and-getting-configuration-values) from the command line.
Feel free to choose any Azure region that supports the services used in these labs ([see this infographic](https://azure.microsoft.com/en-us/global-infrastructure/regions/) for current list of available regions).  A list of some of the regions:

```bash
centralus,eastasia,southeastasia,eastus,eastus2,westus,westus2,northcentralus,southcentralus,
westcentralus,northeurope,westeurope,japaneast,japanwest,brazilsouth,australiasoutheast,australiaeast,
westindia,southindia,centralindia,canadacentral,canadaeast,uksouth,ukwest,koreacentral,koreasouth,
francecentral,southafricanorth,uaenorth,australiacentral,switzerlandnorth,germanywestcentral,
norwayeast,jioindiawest,australiacentral2
```

The command updates and persists the value to the local `Pulumi.dev.yaml` file. You can view or edit this file at any time to effect the configuration of the current stack.

## Step 3 &mdash; Login to Azure

Simply login to the Azure CLI and Pulumi will automatically use your credentials:

```bash
az login
```

```bash
...
You have logged in. Now let us find all the subscriptions to which you have access...
...
```

The Azure CLI, and thus Pulumi, will use the Default Subscription by default, however it is possible to override the subscription, by simply setting your subscription ID to the ID output from `az account list`’s output:

```bash
az account list
```

Pick out the `<id>` from the list and run:

```bash
az account set --subscription=<id>
```

## Next Steps

* [Provisioning a Resource Group](./03-provisioning-infrastructure.md)