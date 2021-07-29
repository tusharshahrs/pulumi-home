package main

import (
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/insights"
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/operationalinsights"
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/resources"
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/sql"
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/storage"
	"github.com/pulumi/pulumi-random/sdk/v4/go/random"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Create an Azure Resource Group
		resourceGroup, err := resources.NewResourceGroup(ctx, "loganalytics-rg", nil)
		if err != nil {
			return err
		}

		// Create an Azure resource (Storage Account)
		storageAccount, err := storage.NewStorageAccount(ctx, "loganalyticssa", &storage.StorageAccountArgs{
			ResourceGroupName: resourceGroup.Name,
			Sku: &storage.SkuArgs{
				Name: storage.SkuName_Standard_LRS,
			},
			Kind: storage.KindStorageV2,
		})
		if err != nil {
			return err
		}

		// Export the primary key of the Storage Account
		//ctx.Export("primaryStorageKey", pulumi.All(resourceGroup.Name, storageAccount.Name).ApplyT(
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

		if err != nil {
			return err
		}

		// create sql admin user
		username := "pulumiadmin"

		// Create random password for sql admin
		sqlpassword, err := random.NewRandomPassword(ctx, "loginpassword", &random.RandomPasswordArgs{
			Length:     pulumi.Int(14),
			MinLower:   pulumi.Int(4),
			MinUpper:   pulumi.Int(4),
			MinNumeric: pulumi.Int(4),
			Number:     pulumi.Bool(true),
			Special:    pulumi.Bool(false),
		})
		if err != nil {
			return err
		}

		// create an Azure sql server
		sqlServer, err := sql.NewServer(ctx, "sqlserver", &sql.ServerArgs{
			AdministratorLogin:         pulumi.String(username),
			AdministratorLoginPassword: sqlpassword.Result,
			ResourceGroupName:          resourceGroup.Name,
			Version:                    pulumi.String("12.0"),
		})
		if err != nil {
			return err
		}

		// randon naming not working?
		// create an Azure sql server database
		database, err := sql.NewDatabase(ctx, "sqldatabase", &sql.DatabaseArgs{
			ResourceGroupName: resourceGroup.Name,
			ServerName:        sqlServer.Name,
			Sku: &sql.SkuArgs{
				Name: pulumi.String("S0"),
			},
		})
		if err != nil {
			return err
		}

		// Create Azure log analytics workspace // https://www.pulumi.com/docs/reference/pkg/azure-native/operationalinsights/workspace/
		workspace, err := operationalinsights.NewWorkspace(ctx, "loganalytics-workspace", &operationalinsights.WorkspaceArgs{
			ResourceGroupName: resourceGroup.Name,
			RetentionInDays:   pulumi.Int(0),
			Sku: &operationalinsights.WorkspaceSkuArgs{
				Name: pulumi.String("PerGB2018"),
			},
		})
		if err != nil {
			return err
		}

		// Enable extended database blob auditing policy
		extendedserverblobauditing, err := sql.NewExtendedServerBlobAuditingPolicy(ctx, "extendedServerBlobAuditingPolicy", &sql.ExtendedServerBlobAuditingPolicyArgs{
			AuditActionsAndGroups: pulumi.StringArray{
				pulumi.String("SUCCESSFUL_DATABASE_AUTHENTICATION_GROUP"),
				pulumi.String("FAILED_DATABASE_AUTHENTICATION_GROUP"),
				pulumi.String("BATCH_COMPLETED_GROUP"),
			},
			IsAzureMonitorTargetEnabled: pulumi.Bool(true),
			IsStorageSecondaryKeyInUse:  pulumi.Bool(true),
			ResourceGroupName:           resourceGroup.Name,
			RetentionDays:               pulumi.Int(0),
			ServerName:                  sqlServer.Name,
			State:                       "Enabled",
		})
		if err != nil {
			return err
		}

		extendeddatabaseblobauditing, err := sql.NewExtendedDatabaseBlobAuditingPolicy(ctx, "extendedDatabaseBlobAuditingPolicy", &sql.ExtendedDatabaseBlobAuditingPolicyArgs{
			DatabaseName:                database.Name,
			IsAzureMonitorTargetEnabled: pulumi.Bool(true),
			IsStorageSecondaryKeyInUse:  pulumi.Bool(false),
			RetentionDays:               pulumi.Int(0),
			ResourceGroupName:           resourceGroup.Name,
			ServerName:                  sqlServer.Name,
			State:                       "Enabled",
		})
		if err != nil {
			return err
		}

		diagnosticSetting, err := insights.NewDiagnosticSetting(ctx, "diagnosticSetting", &insights.DiagnosticSettingArgs{
			LogAnalyticsDestinationType: pulumi.String("Dedicated"),
			Logs: insights.LogSettingsArray{
				&insights.LogSettingsArgs{
					Category: pulumi.String("SQLSecurityAuditEvents"),
					Enabled:  pulumi.Bool(true),
					RetentionPolicy: &insights.RetentionPolicyArgs{
						Days:    pulumi.Int(0),
						Enabled: pulumi.Bool(false),
					},
				},
			},
			Metrics: insights.MetricSettingsArray{
				&insights.MetricSettingsArgs{
					Category: pulumi.String("AllMetrics"),
					Enabled:  pulumi.Bool(true),
					RetentionPolicy: &insights.RetentionPolicyArgs{
						Days:    pulumi.Int(0),
						Enabled: pulumi.Bool(false),
					},
				},
			},
			ResourceUri: database.ID(),
			WorkspaceId: workspace.ID(),
		})
		if err != nil {
			return err
		}

		// Outputs
		ctx.Export("resourcegroup_name", resourceGroup.Name)
		ctx.Export("storageaccount_name", storageAccount.Name)
		ctx.Export("sqladmin_user", pulumi.String(username))
		ctx.Export("sqladmin_password", sqlpassword.Result)
		ctx.Export("primarystoragekey", pulumi.ToSecret(primaryStorageKey))
		ctx.Export("sqlserver_name", sqlServer.Name)
		ctx.Export("sqlserver_database_name", database.Name)
		ctx.Export("loganalytic_sworkspace_name", workspace.Name)
		ctx.Export("extendedserverblobauditing_name", extendedserverblobauditing.Name)
		ctx.Export("extendeddatabaseblobauditing_name", extendeddatabaseblobauditing.Name)
		ctx.Export("diagnosticSetting", diagnosticSetting.Name)
		return nil
	})

}
