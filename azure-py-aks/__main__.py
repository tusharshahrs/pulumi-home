
import pulumi
from pulumi import ResourceOptions, Output
from pulumi_azure_native import resources, containerservice, network
from pulumi_azure_native.network import virtual_network
import pulumi_azuread as azuread
import pulumi_random as random
import pulumi_tls as tls
import base64

config = pulumi.Config()
name="shahtshaht"

# Create new resource group
resource_group = resources.ResourceGroup(f'{name}-aks')

# Create an AD service principal
ad_app = azuread.Application(f'{name}-azuread-application', display_name=f'{name}-azuread-application')
ad_sp = azuread.ServicePrincipal(f'{name}-ad-serviceprincipal', application_id=ad_app.application_id)

# Generate random password
password = random.RandomPassword(f'{name}-password', length=20, special=True)

# Create the Service Principal Password
ad_sp_password = azuread.ServicePrincipalPassword(f'{name}-serviceprincipalpassword',
                                                  service_principal_id=ad_sp.id,
                                                  value=password.result,
                                                  end_date="2029-01-01T00:00:00Z")

# Generate an SSH key
ssh_key = tls.PrivateKey(f'{name}-ssh-key', algorithm="RSA", rsa_bits=4096)

# Create cluster
managed_cluster_name = config.get("managedClusterName")
if managed_cluster_name is None:
    managed_cluster_name = f'{name}-azure-aks'

# Create network. Skipping due to ip block conflict

mynetwork = network.VirtualNetwork(f'{name}-vnet', 
            resource_group_name=resource_group.name,
            location=resource_group.location,
            address_space=network.AddressSpaceArgs(
                address_prefixes=["10.0.0.0/22"],
            ),
            #opts=ResourceOptions(ignore_changes=["subnet1", "subnet2"])
)

# Create subnet1. Skipping due to ip block conflict
subnet1 = network.Subnet(f'{name}-subnet-1',
            resource_group_name = resource_group.name,
            virtual_network_name = mynetwork.name,
            #address_prefix="10.0.0.80/28",
            address_prefix="10.0.2.0/24",
            opts=ResourceOptions(parent=mynetwork)
)

# Create subnet2. Skipping due to ip block conflict
subnet2 = network.Subnet(f'{name}-subnet-2',
            resource_group_name = resource_group.name,
            virtual_network_name = mynetwork.name,
            #address_prefix="10.0.0.112/28",
            address_prefix="10.0.3.0/24",
            opts=ResourceOptions(parent=mynetwork)
)

my_count = 3
my_max_pods = 10
my_disk_size_in_gb = 30
my_kubernetes_version = "1.24.3"


managed_cluster = containerservice.ManagedCluster(
    managed_cluster_name,
    resource_group_name=resource_group.name,
    auto_scaler_profile=containerservice.ManagedClusterPropertiesAutoScalerProfileArgs(
        balance_similar_node_groups="true",
        expander="priority",
        max_node_provision_time="15m",
        new_pod_scale_up_delay="60s",
        scale_down_delay_after_add="15m",
        scan_interval="20s",
        skip_nodes_with_system_pods="false",
    ),
    agent_pool_profiles=[containerservice.ManagedClusterAgentPoolProfileArgs(
        count= my_count,
        max_pods=my_max_pods,
        mode="System",
        name="agentpool",
        node_labels={},
        os_disk_size_gb=my_disk_size_in_gb,
        os_type="Linux",
        type="VirtualMachineScaleSets",
        vm_size="Standard_E2s_v3",
        #"vm_size": "Standard_DS2_v2",
        #vnet_subnet_id=subnet2.id, # Skipping due to ip block conflict
    )],
    
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
    opts=ResourceOptions(depends_on=[ad_sp,ad_sp_password,ssh_key,subnet1,subnet2]),

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


pulumi.export("resource_group_name", resource_group.name)
pulumi.export("ad_app_name", ad_app.id)
pulumi.export("ad_sp_display_name", ad_sp.display_name)
pulumi.export("vnet_name", mynetwork.name)
pulumi.export("vnet_subnet1", subnet1.name)
pulumi.export("vnet_subnet2", subnet2.name)
pulumi.export("managed_cluster_name", managed_cluster.name)
pulumi.export("kubeconfig", Output.secret(kubeconfig))