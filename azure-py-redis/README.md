# Azure Resource Group, Storage Account, and Redis Cache in Python

Deploys Azure Resource Group, Storage Account, and Redis cache in Python. Retrieves the primary and secondary Redis cache keys. _Note:_
We call the [listrediskeys](https://www.pulumi.com/registry/packages/azure-native/api-docs/cache/listrediskeys/) function

## Deployment

1. Initialize a new stack called `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step):

   ```bash
   az login
   ```

1. Create a Python virtualenv, activate it, and install dependencies:

   This installs the dependent packages for our Pulumi program.

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip3 install -r requirements.txt
   ```

1. Set the config values via [pulumi config set](https://www.pulumi.com/docs/reference/cli/pulumi_config_set/).

   Here are Azure regions [see this infographic](https://azure.microsoft.com/en-us/global-infrastructure/regions/) for a list of available regions)

   ```bash
   pulumi config set azure-native:location eastus2
   ```

1. Run `pulumi up` to preview and deploy changes: You must select `y` to continue

   ```bash
   pulumi up
   ```

   Results

   ```bash
   Previewing update (dev)

   Updating (dev2)

    View Live: https://app.pulumi.com/myuser/azure-py-redis/dev2/updates/1

        Type                                     Name                 Status
    +   pulumi:pulumi:Stack                      azure-py-redis-dev2  created
    +   ├─ azure-native:resources:ResourceGroup  demo-resourcegroup   created
    +   ├─ azure-native:cache:Redis              demo-redis           created
    +   └─ azure-native:storage:StorageAccount   demosa               created

    Outputs:
        primary_storage_key: [secret]
        redis_cache_name   : "demo-redisd8d2245a"
        redis_primary_key  : [secret]
        redis_secondary_key: [secret]
        resource_group_name: "demo-resourcegroup7dca8dae"
        storage_account    : "demosa1429cda7"

    Resources:
        + 4 created

    Duration: 15m32s
   ```

1. View the outputs created via [pulumi stack output](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)

   ```bash
   pulumi stack output
   ```

   Results

   ```bash
   Current stack outputs (6):
    OUTPUT               VALUE
    primary_storage_key  [secret]
    redis_cache_name     demo-redisd8d2245a
    redis_primary_key    [secret]
    redis_secondary_key  [secret]
    resource_group_name  demo-resourcegroup7dca8dae
    storage_account      demosa1429cda7
   ```

   If you need to see the values that are secret, you will have to do the following

   ```bash
   pulumi stack output --show-secrets
   ```

1. Clean up.

   ```bash
   pulumi destroy -y
   ```

1. Remove the stack. This will remove the _Pulumi.dev.yaml_ file also
   ```bash
   pulumi stack rm dev
   ```
