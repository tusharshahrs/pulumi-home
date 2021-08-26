import * as pulumi from "@pulumi/pulumi";
import * as azure_native from "@pulumi/azure-native";
import * as resources from "@pulumi/azure-native/resources";

const my_name = "demo";

// Create an Azure Resource Group
const myresourcegroup = new resources.ResourceGroup(`${my_name}-rg`)

// Get the subscription id from the resource group
const subscriptionID = myresourcegroup.id.apply(myrg => myrg.split("/")[2]);


const budget = new azure_native.consumption.Budget(`${my_name}-budget-`, {
    amount: 100.65,
    category: "Cost",
    notifications: {
        Actual_GreaterThan_50_Percent: {
            contactEmails: [
                "johndoe@contoso.com",
                "janesmith@contoso.com",
            ],
            enabled: true,
            locale: "en-us",
            //locale: "de-de",
            operator: "GreaterThan",
            threshold: 50,
            thresholdType: "Actual",
        },
        Actual_GreaterThan_80_Percent: {
            contactEmails: [
                "johndoe@contoso.com",
                "janesmith@contoso.com",
            ],
            enabled: true,
            locale: "en-us",
            //locale: "de-de",
            operator: "GreaterThan",
            threshold: 80,
            thresholdType: "Actual",
        },
        Actual_GreaterThan_90_Percent: {
            contactEmails: [
                "johndoe@contoso.com",
                "janesmith@contoso.com",
            ],
            enabled: true,
            locale: "en-us",
            //locale: "de-de",
            operator: "GreaterThan",
            threshold: 90,
            thresholdType: "Actual",
        },
    },
    scope: pulumi.interpolate`subscriptions/${subscriptionID}`,
    timeGrain: "Monthly",
    timePeriod: {
        endDate: "2021-12-01T00:00:00Z",
        startDate: "2021-08-01T00:00:00Z",
    },
});

export const myresourcegroup_name = myresourcegroup.name;
export const budget_name = budget.name;
export const budget_amount = budget.amount;