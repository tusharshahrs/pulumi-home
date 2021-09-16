package main

import (
	"fmt"
	"strings"

	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/resources"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Create an Azure Resource Group
		resourceGroup, err := resources.NewResourceGroup(ctx, "resourcegroup", nil)
		if err != nil {
			return err
		}

		// Hard Coded Outputs
		//mysubids2 := "/subscriptions/32b9cb2e-32b9cb2e-132b9cb-2132b9c-32132b9/resourceGroups/resourcegroup7a9ca0b0"
		//splits_subscription := strings.Split(mysubids2, "/")
		//subidonly := splits_subscription[2]
		//ctx.Export("hard_coded_subscription", pulumi.Sprintf("%s", subidonly))

		// Outputs
		// You need to have your func accept a pulumi.ID instead of a string (and then convert it inside the func.)
		// [sdk/go] Can Apply/ApplyT/ApplyString be more strongly typed? https://github.com/pulumi/pulumi/issues/6355
		subscriptionId := resourceGroup.ID().ApplyT(func(subscriptionid_inside_resourcegroup pulumi.ID) string {
			subscriptionid_inside_resourcegroup_converted_to_string := fmt.Sprintf("%s", subscriptionid_inside_resourcegroup)
			splits_subscriptionid_from_resource_group := strings.Split(subscriptionid_inside_resourcegroup_converted_to_string, "/")
			subscription_id_only := splits_subscriptionid_from_resource_group[2]
			return subscription_id_only
		}).(pulumi.StringOutput)

		ctx.Export("resource_group_name", resourceGroup.Name)
		ctx.Export("subscription_id", pulumi.ToSecret(pulumi.Sprintf("%s", subscriptionId)))
		return nil
	})
}
