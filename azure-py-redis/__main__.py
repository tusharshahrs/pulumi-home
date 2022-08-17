"""An Azure RM Python Pulumi program"""

import pulumi
from pulumi_azure_native import storage
from pulumi_azure_native import resources
from pulumi_azure_native import cache
from pulumi import export,Output

name = "demo"
# Create an Azure Resource Group
resource_group = resources.ResourceGroup(f'{name}-resourcegroup')
export("resource_group_name",resource_group.name)

# Create an Azure resource (Storage Account)
account = storage.StorageAccount(f'{name}sa',
    resource_group_name=resource_group.name,
    sku=storage.SkuArgs(
        name=storage.SkuName.STANDARD_LRS,
    ),
    kind=storage.Kind.STORAGE_V2)

export("storage_account",account.name)

# Creates a redis cache
redis = cache.Redis(f'{name}-redis',
    enable_non_ssl_port=True,
    minimum_tls_version="1.2",
    replicas_per_master=2,
    resource_group_name=resource_group.name,
    shard_count=2,
    sku=cache.SkuArgs(
        capacity=1,
        family="P",
        name="Premium",
    ),
    )

export("redis_cache_name",redis.name)

# Get the primary key of the Storage Account
primary_key = pulumi.Output.all(resource_group.name, account.name) \
    .apply(lambda args: storage.list_storage_account_keys(
        resource_group_name=args[0],
        account_name=args[1]
    )).apply(lambda accountKeys: accountKeys.keys[0].value)

# Export the primary storage account key
pulumi.export("primary_storage_key", Output.secret(primary_key))

# Get the primary key of the Redis Cache
redis_primary_key = pulumi.Output.all(resource_group.name,redis.name)\
    .apply(lambda args: cache.list_redis_keys(
        resource_group_name=args[0],
        name=args[1]
    )).apply(lambda redis_accesskeys: redis_accesskeys.primary_key)

# Get the secondary key of the Redis Cache
redis_secondary_key = pulumi.Output.all(resource_group.name,redis.name)\
    .apply(lambda args: cache.list_redis_keys(
        resource_group_name=args[0],
        name=args[1]
    )).apply(lambda redis_accesskeys: redis_accesskeys.secondary_key)

# Export the primary key of the redis cache
pulumi.export("redis_access_key_primary", Output.secret(redis_primary_key))

# Export the secondary key of the redis cache
pulumi.export("redis_access_key_secondary", Output.secret(redis_secondary_key))