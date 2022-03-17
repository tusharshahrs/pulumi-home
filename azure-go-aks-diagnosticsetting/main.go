package main

import (
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/resources"
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/storage"
	"github.com/pulumi/pulumi-azuread/sdk/v4/go/azuread"
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

		current, err := azuread.GetClientConfig(ctx, nil, nil)
		if err != nil {
			return err
		}
		adApplication, err := azuread.NewApplication(ctx, "diagApplication", &azuread.ApplicationArgs{
			DisplayName: pulumi.String("diag-azuread-apps"),
			Owners: pulumi.StringArray{
				pulumi.String(current.ObjectId),
			},
		})
		if err != nil {
			return err
		}

		adServicePrincipal, err := azuread.NewServicePrincipal(ctx, "diagServicePrincipal", &azuread.ServicePrincipalArgs{
			ApplicationId:             adApplication.ApplicationId,
			AppRoleAssignmentRequired: pulumi.Bool(false),
		})
		if err != nil {
			return err
		}

		// Outputs
		ctx.Export("resourcegroup_name", resourceGroup.Name)
		ctx.Export("storageaccount_name", storageAccount.Name)
		ctx.Export("primarystoragekey", pulumi.ToSecret(primaryStorageKey))
		ctx.Export("azure_ad_application", adApplication.DisplayName)
		ctx.Export("azure_ad_serviceprincipal", adServicePrincipal.DisplayName)
		return nil
	})
}
