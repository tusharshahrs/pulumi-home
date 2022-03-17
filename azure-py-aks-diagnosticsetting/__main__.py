
from re import I
import pulumi
from pulumi import ResourceOptions, Output
from pulumi_azure_native import resources, containerservice, network, insights, storage
from pulumi_azure_native.network import virtual_network
import pulumi_azuread as azuread
import pulumi_random as random
import pulumi_tls as tls
import base64

config = pulumi.Config()
name="demodiag"


# Create new resource group
resource_group = resources.ResourceGroup(f'{name}-rg')

# Create an Azure resource (Storage Account)
account = storage.StorageAccount(f'{name}sa',
    resource_group_name=resource_group.name,
    sku=storage.SkuArgs(
        name=storage.SkuName.STANDARD_LRS,
    ),
    kind=storage.Kind.STORAGE_V2)

# Export the primary key of the Storage Account
primary_key = pulumi.Output.all(resource_group.name, account.name) \
    .apply(lambda args: storage.list_storage_account_keys(
        resource_group_name=args[0],
        account_name=args[1]
    )).apply(lambda accountKeys: accountKeys.keys[0].value)


# Create an AD service principal
ad_app = azuread.Application(f'{name}-azuread-apps', display_name=f'{name}-azuread-apps')
ad_sp = azuread.ServicePrincipal(f'{name}-ad-serviceprincipal', application_id=ad_app.application_id)

# Generate random password
password = random.RandomPassword(f'{name}-randompassword', length=20, special=True)

# Create the Service Principal Password
ad_sp_password = azuread.ServicePrincipalPassword(f'{name}-serviceprincipalpassword',
                                                  service_principal_id=ad_sp.id,
                                                  value=password.result,
                                                  end_date="2024-01-01T00:00:00Z",
                                                  opts=ResourceOptions(depends_on=[ad_app,ad_sp,account]))

# Generate an SSH key
ssh_key = tls.PrivateKey(f'{name}-ssh-key', algorithm="RSA", rsa_bits=4096)


# Create cluster
managed_cluster_name = config.get("managedClusterName")
if managed_cluster_name is None:
    managed_cluster_name = f'{name}-azure-aks'

my_count = 3
my_max_pods =10
my_disk_size_in_gb = 30
# command line: az aks get-versions --location eastus2 --output table
my_kubernetes_version = "1.22.6"

managed_cluster = containerservice.ManagedCluster(
    managed_cluster_name,
    resource_group_name=resource_group.name,
        agent_pool_profiles=[{
        "count": my_count,
        "max_pods": my_max_pods,
        "mode": "System",
        "name": "agentpool",
        "node_labels": {},
        "os_disk_size_gb": my_disk_size_in_gb,
        "os_type": "Linux",
        "type": "VirtualMachineScaleSets",
        "vm_size": "Standard_E2_v4",
        #"vm_size": "Standard_DS2_v2",
    }],
        linux_profile={
        "admin_username": "testuser",
        "ssh": {
            "public_keys": [{
                "key_data": ssh_key.public_key_openssh,
            }],
        },
    },
    enable_rbac=True,
    dns_prefix=resource_group.name,

    kubernetes_version=my_kubernetes_version,
    service_principal_profile={
        "client_id": ad_app.application_id,
        "secret": ad_sp_password.value
    },
    network_profile=containerservice.ContainerServiceNetworkProfileArgs(
        network_plugin = "azure",
        network_mode= "transparent"),
    sku=containerservice.ManagedClusterSKUArgs(
        name="Basic",
        tier="Free",
    ),
    opts=ResourceOptions(depends_on=[ad_sp_password,account])
)

creds = pulumi.Output.all(resource_group.name, managed_cluster.name).apply(
    lambda args:
    containerservice.list_managed_cluster_user_credentials(
        resource_group_name=args[0],
        resource_name=args[1]))   

# Export kubeconfig
encoded = creds.kubeconfigs[0].value
kubeconfig = encoded.apply(
    lambda enc: base64.b64decode(enc).decode())


diagnostic_setting = insights.DiagnosticSetting(f'{name}-diagnostic-control-plane-log',
    logs=[insights.LogSettingsArgs(
        #category="WorkflowRuntime",
        category="kube-apiserver",
        enabled=True,
        retention_policy=insights.RetentionPolicyArgs(
            days=0,
            enabled=False,
        ),
    )],
    resource_uri=managed_cluster.id,
    storage_account_id=account.id,
    opts=ResourceOptions(depends_on=[managed_cluster])
)

pulumi.export("resource_group_name", resource_group.name)
pulumi.export("storage_account_name", account.name)
pulumi.export("storage_account_id", Output.secret(account.id))
pulumi.export("ad_app_name", ad_app.id)
pulumi.export("ad_sp_display_name", ad_sp.display_name)
pulumi.export("managed_cluster_name", managed_cluster.name)
pulumi.export("managed_cluster_uri", Output.secret(managed_cluster.id))
pulumi.export("kubeconfig", Output.secret(kubeconfig))
pulumi.export("diagnostic_setting_name", diagnostic_setting.name)
pulumi.export("diagnostic_setting_id", Output.secret(diagnostic_setting.id))