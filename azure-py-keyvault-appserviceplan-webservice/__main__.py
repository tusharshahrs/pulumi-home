"""An Azure RM Python Pulumi program"""

import pulumi
from pulumi_azure_native import resources,keyvault, authorization
from pulumi import export, Output
from pulumi_azure_native.web.v20210201 import AppServicePlan, SkuDescriptionArgs, WebApp
from pulumi_azure import keyvault as keyvault_classic
import pulumi_azure as azure 

name = "demo"

# Create an Azure Resource Group
resource_group = resources.ResourceGroup(f'{name}-rg')
export('resource_group_name', resource_group.name)

config = authorization.get_client_config()
export('tenant_id', Output.secret(config.tenant_id))
export('subscription_id', Output.secret(config.subscription_id))


app_service_plan_1 = AppServicePlan(f'{name}-app_service_plan',
    resource_group_name=resource_group.name,
    sku=SkuDescriptionArgs(
        name="S1",
        tier="Standard",
    ),
    opts=pulumi.ResourceOptions(depends_on=[resource_group])
    )

export('app_service_plan_1_name', app_service_plan_1.name)

web_app_1 = WebApp(f'{name}-webapp',
    client_affinity_enabled=False,
    resource_group_name=resource_group.name,
    opts=pulumi.ResourceOptions(depends_on=[app_service_plan_1])
    )

export('web_app_1_name', web_app_1.name)

certificates_var = [
    "Get",
    "List",
    "Update",
    "Create",
    "Import",
    "Delete",
    "Recover",
    "Backup",
    "Restore",
    "ManageContacts",
    "ManageIssuers",
    "GetIssuers",
    "ListIssuers",
    "SetIssuers",
    "DeleteIssuers",
]
secrets_var = [
    "Get",
    "List",
    "Set",
    "Delete",
    "Recover",
    "Backup",
    "Restore",
]
keys_var = [
    "Get",
    "List",
    "Update",
    "Create",
    "Import",
    "Delete",
    "Recover",
    "Backup",
    "Restore",
    "UnwrapKey",
    "Verify",
    "Sign",
]


vault_1 = keyvault.Vault(f'{name}-keyvault',
    #properties=keyvault.VaultPropertiesResponseArgs(
    properties=keyvault.VaultPropertiesArgs(
        access_policies=[{
            "objectId": config.object_id,
            "permissions": keyvault.PermissionsArgs(
                certificates=certificates_var,
                keys=keys_var,
                secrets=secrets_var
            ),
            "tenantId": config.tenant_id,
        }],
        enabled_for_deployment=True,
        enabled_for_disk_encryption=True,
        enabled_for_template_deployment=True,
        sku=keyvault.SkuArgs(
            family="A",
            name=keyvault.SkuName.STANDARD,
        ),
        tenant_id=config.tenant_id,
    ),
    resource_group_name=resource_group.name,
    opts=pulumi.ResourceOptions(depends_on=[resource_group])
)

export('vault_1_name', vault_1.name)

keyvault_2_classic = keyvault_classic.KeyVault(f'{name}-keyvtclassic',
    resource_group_name=resource_group.name,
    sku_name="standard",
    enabled_for_disk_encryption=True,
    purge_protection_enabled=False,
    tenant_id=config.tenant_id,
    enabled_for_template_deployment=True,
    opts=pulumi.ResourceOptions(depends_on=[resource_group])

)
keyvault_2_ =keyvault_classic.AccessPolicy(f'{name}-keyvtclassic-accesspolicy',
        tenant_id=config.tenant_id,
        object_id=config.object_id,
        key_permissions=keys_var,
        secret_permissions=secrets_var,
        certificate_permissions=certificates_var,
        key_vault_id=keyvault_2_classic.id,
        opts=pulumi.ResourceOptions(depends_on=[resource_group,keyvault_2_classic])
)

export('vault_2_name', keyvault_2_classic.name)
