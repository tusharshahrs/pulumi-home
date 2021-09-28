import * as docker from "@pulumi/docker";
import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as web from "@pulumi/azure-native/web";

const name = "jenkins"

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`${name}-rg`);

// Create an azure app service plan
const plan = new web.AppServicePlan(`${name}-appserviceplan`, {
    resourceGroupName: resourceGroup.name,
    kind: "Linux",
    reserved: true,
    sku: {
        name: "B1",
        tier: "Basic",
    },
});

//
// Scenario 1: deploying an image from Docker Hub.
// https://hub.docker.com/r/jenkins/jenkins
const imageInDockerHub = "jenkins/jenkins:lts-jdk11";

// Create the webapp
const jenkinswebapp = new web.WebApp(`${name}-webapp`, {
    resourceGroupName: resourceGroup.name,
    serverFarmId: plan.id,
    siteConfig: {
        appSettings: [{
            name: "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
            value: "false",
        }],
        alwaysOn: true,
        linuxFxVersion: `DOCKER|${imageInDockerHub}`,
    },
    httpsOnly: true,
});

// Jenkins Endpoint.  You will have to wait at least 2 minutes before it is live
export const jenkinsEndpoint = pulumi.interpolate`https://${jenkinswebapp.defaultHostName}`