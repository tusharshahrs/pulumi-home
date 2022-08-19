# Deploying Azure ResourceGroup, DatalakeStore with Synapse Workspace and Syapse BigDataPool in TypeScript

Deploys Azure [DatalakeStore](https://www.pulumi.com/registry/packages/azure-native/api-docs/datalakestore/) with [Synapse Workspace](https://www.pulumi.com/registry/packages/azure-native/api-docs/synapse/workspace/) with
[Synapse BigDataPool](https://www.pulumi.com/registry/packages/azure-native/api-docs/synapse/)

## Note

The Synapse BigDataPool and Workspace both point to the `v20210601preview` because we need to set the `minExecutors: int_number` & `maxExecutors: int_number`

```typescript
import * as synapse from "@pulumi/azure-native/synapse/v20210601preview";
```

## Special Note
  To use `libraryrequirements:` you would set the input [customLibraries](https://www.pulumi.com/registry/packages/azure-native/api-docs/synapse/bigdatapool/#customlibraries_nodejs) that has a field called [LibraryInfo](https://www.pulumi.com/registry/packages/azure-native/api-docs/synapse/bigdatapool/#libraryinfo) which has a property called `containerName` that says: `Storage blob container name`. This is where the requirements.txt file and any libraries that are needed for the big data pool would be uploaded. We have an example that uploads everything in wwwroot to the blob storage called [azure-ts-appservice](https://github.com/pulumi/examples/tree/master/azure-ts-appservice)


## Deployment

1. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step)

   ```bash
   az login
   ```

1. Create a new stack

   ```bash
   pulumi stack init dev
   ```

1. Install dependencies

   ```bash
   npm install
   ```

1. Configure the location via the config. The Azure region to deploy to is pre-set to **WestUS** - but you can modify the region you would like to deploy to.

   ```bash
   pulumi config set azure-native:location eastus2
   ```

1. Create that stack via `pulumi up`

   ```bash
   pulumi up -y
   ```

   The Result will be

   ```bash
   Updating (dev)

    View Live: https://app.pulumi.com/shaht/azure-ts-synapse-bigdatapool/dev/updates/40

        Type                                                           Name                              Status
    +   pulumi:pulumi:Stack                                            azure-ts-synapse-bigdatapool-dev  created
    +   └─ azure-native:resources:ResourceGroup                        demo-rg                           created
    +      └─ azure-native:datalakestore:Account                       demodatalakest                    created
    +         └─ azure-native:synapse/v20210601preview:Workspace       demo-workspace                    created
    +            └─ azure-native:synapse/v20210601preview:BigDataPool  demobdp1                          created

    Outputs:
        big_data_pool_name    : "demobdp1"
        datalake_storage_name : "demodatalakest27044ee8"
        resource_group_name   : "demo-rge0419e95"
        synapse_workspace_name: "demo-workspace91d04406"

    Resources:
        + 5 created

    Duration: 9m1s
   ```

1. Check the Outputs

   ```bash
   pulumi stack output
   ```

   Returns:

   ```bash
    Current stack outputs (4):
    OUTPUT                  VALUE
    big_data_pool_name      demobdp1
    datalake_storage_name   demodatalakest27044ee8
    resource_group_name     demo-rge0419e95
    synapse_workspace_name  demo-workspace91d04406
   ```

1. Destroy the Stack

   ```bash
   pulumi destroy -y
   ```

1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```
