package main

import (
	"encoding/base64"

	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/containerservice"
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/insights"
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/resources"
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/storage"
	"github.com/pulumi/pulumi-azuread/sdk/v4/go/azuread"
	"github.com/pulumi/pulumi-random/sdk/v4/go/random"
	"github.com/pulumi/pulumi-tls/sdk/v4/go/tls"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Create an Azure Resource Group
		resourceGroup, err := resources.NewResourceGroup(ctx, "diag-rg", nil)
		if err != nil {
			return err
		}

		// Create an Azure resource (Storage Account)
		storageAccount, err := storage.NewStorageAccount(ctx, "diagsa", &storage.StorageAccountArgs{
			ResourceGroupName: resourceGroup.Name,
			Sku: &storage.SkuArgs{
				Name: pulumi.String("Standard_LRS"),
			},
			Kind: pulumi.String("StorageV2"),
		})
		if err != nil {
			return err
		}

		// Export the primary key of the Storage Account
		primaryStorageKey := pulumi.All(resourceGroup.Name, storageAccount.Name).ApplyT(
			func(args []interface{}) (string, error) {
				resourceGroupName := args[0].(string)
				accountName := args[1].(string)
				accountKeys, err := storage.ListStorageAccountKeys(ctx, &storage.ListStorageAccountKeysArgs{
					ResourceGroupName: resourceGroupName,
					AccountName:       accountName,
				})
				if err != nil {
					return "", err
				}

				return accountKeys.Keys[0].Value, nil
			})

		adApplication, err := azuread.NewApplication(ctx, "diag-Application", &azuread.ApplicationArgs{
			DisplayName: pulumi.String("diag-azuread-apps"),
		})
		if err != nil {
			return err
		}

		adServicePrincipal, err := azuread.NewServicePrincipal(ctx, "diag-ServicePrincipal", &azuread.ServicePrincipalArgs{
			ApplicationId: adApplication.ApplicationId,
		})
		if err != nil {
			return err
		}

		// Generate a random password.
		password, err := random.NewRandomPassword(ctx, "diag-password", &random.RandomPasswordArgs{
			Length:  pulumi.Int(20),
			Special: pulumi.Bool(true),
		})
		if err != nil {
			return err
		}

		// Create the Service Principal Password.
		adSpPassword, err := azuread.NewServicePrincipalPassword(ctx, "diag-aksSpPassword", &azuread.ServicePrincipalPasswordArgs{
			ServicePrincipalId: adServicePrincipal.ID(),
			Value:              password.Result,
			EndDate:            pulumi.String("2024-01-01T00:00:00Z"),
		}, pulumi.DependsOn([]pulumi.Resource{adApplication, adServicePrincipal, storageAccount}))
		if err != nil {
			return err
		}

		sshKey, err := tls.NewPrivateKey(ctx, "diag-privatekey", &tls.PrivateKeyArgs{
			Algorithm:  pulumi.String("RSA"),
			EcdsaCurve: pulumi.String("4096"),
		})
		if err != nil {
			return err
		}

		// Create the Azure Kubernetes Service cluster.
		cluster, err := containerservice.NewManagedCluster(ctx, "diag-go-aks", &containerservice.ManagedClusterArgs{
			ResourceGroupName: resourceGroup.Name,
			AgentPoolProfiles: containerservice.ManagedClusterAgentPoolProfileArray{
				&containerservice.ManagedClusterAgentPoolProfileArgs{
					Name:         pulumi.String("agentpool"),
					Mode:         pulumi.String("System"),
					OsDiskSizeGB: pulumi.Int(30),
					Count:        pulumi.Int(3),
					VmSize:       pulumi.String("Standard_E2_v4"),
					OsType:       pulumi.String("Linux"),
				},
			},
			LinuxProfile: &containerservice.ContainerServiceLinuxProfileArgs{
				AdminUsername: pulumi.String("testuser"),
				Ssh: containerservice.ContainerServiceSshConfigurationArgs{
					PublicKeys: containerservice.ContainerServiceSshPublicKeyArray{
						containerservice.ContainerServiceSshPublicKeyArgs{
							KeyData: sshKey.PublicKeyOpenssh,
						},
					},
				},
			},
			DnsPrefix: resourceGroup.Name,
			ServicePrincipalProfile: &containerservice.ManagedClusterServicePrincipalProfileArgs{
				ClientId: adApplication.ApplicationId,
				Secret:   adSpPassword.Value,
			},
			KubernetesVersion: pulumi.String("1.22.6"),
		}, pulumi.DependsOn([]pulumi.Resource{adSpPassword, storageAccount}))
		if err != nil {
			return err
		}

		diagnosticSetting, err := insights.NewDiagnosticSetting(ctx, "diag-diagnosticSetting", &insights.DiagnosticSettingArgs{
			Logs: insights.LogSettingsArray{
				&insights.LogSettingsArgs{
					Category: pulumi.String("kube-apiserver"),
					Enabled:  pulumi.Bool(true),
					RetentionPolicy: &insights.RetentionPolicyArgs{
						Days:    pulumi.Int(0),
						Enabled: pulumi.Bool(false),
					},
				},
			},
			ResourceUri:      cluster.ID(),
			StorageAccountId: storageAccount.ID(),
		}, pulumi.DependsOn([]pulumi.Resource{cluster}))

		if err != nil {
			return err
		}

		creds := containerservice.ListManagedClusterUserCredentialsOutput(ctx,
			containerservice.ListManagedClusterUserCredentialsOutputArgs{
				ResourceGroupName: resourceGroup.Name,
				ResourceName:      cluster.Name,
			})

		kubeconfig := creds.Kubeconfigs().Index(pulumi.Int(0)).Value().
			ApplyT(func(encoded string) string {
				kubeconfig, err := base64.StdEncoding.DecodeString(encoded)
				if err != nil {
					return ""
				}
				return string(kubeconfig)
			})

		// Outputs
		ctx.Export("resourcegroup_name", resourceGroup.Name)
		ctx.Export("storageaccount_name", storageAccount.Name)
		ctx.Export("primarystoragekey", pulumi.ToSecret(primaryStorageKey))
		ctx.Export("azure_ad_application", adApplication.DisplayName)
		ctx.Export("azure_ad_serviceprincipal", adServicePrincipal.ApplicationId)
		ctx.Export("sshKey", sshKey.ID())
		ctx.Export("managedcluster_name", cluster.Name)
		ctx.Export("kubeconfig", pulumi.ToSecret(kubeconfig))
		ctx.Export("diagnostic_setting_name", diagnosticSetting.Name)
		ctx.Export("diagnostic_setting_id", pulumi.ToSecret(diagnosticSetting.ID()))
		return nil
	})
}
