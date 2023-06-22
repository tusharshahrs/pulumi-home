import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as network from "@pulumi/azure-native/network";

const name = "shaht"
// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(`${name}-rg`, 
    {
        tags: {"Name": `${name}-rg`, "owner": "shaht"},
    });

export const resourceGroupName = resourceGroup.name;
// Create an Azure resource (Storage Account)

const storageAccount = new storage.StorageAccount(`${name}sa`, {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
    tags: {"Name": `${name}sa`, "owner": "shaht"},
});

export const storageAccountName = storageAccount.name;
// Export the primary key of the Storage Account
const storageAccountKeys = storage.listStorageAccountKeysOutput({
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name
});

export const primaryStorageKey = pulumi.secret(storageAccountKeys.keys[0].value);

// Create VNet
const vnet = new network.VirtualNetwork(`${name}-vnet`, {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
    },
    tags: {"Name": `${name}-vnet`, "owner": "shaht"},
});

export const vnetName = vnet.name;
// Create subnets
const publicSubnets = [];
const privateSubnets = [];

for (let i = 1; i <= 3; i++) {
    publicSubnets.push(new network.Subnet(`${name}-publicSubnet${i}`, {
        resourceGroupName: resourceGroup.name,
        virtualNetworkName: vnet.name,
        addressPrefix: `10.0.${i * 2}.0/24`,
    }, {dependsOn: [vnet]}));

    privateSubnets.push(new network.Subnet(`${name}-privateSubnet${i}`, {
        resourceGroupName: resourceGroup.name,
        virtualNetworkName: vnet.name,
        addressPrefix: `10.0.${i * 2 + 1}.0/24`,
    }, {dependsOn: [vnet]}));
}

export const publicSubnetNames = publicSubnets.map(sn => sn.name);
export const privateSubnetNames = privateSubnets.map(sn => sn.name);

// Create public IP address
const publicIp = new network.PublicIPAddress(`${name}-publicIp`, {
    resourceGroupName: resourceGroup.name,
    publicIPAddressVersion: "IPv4",
    publicIPAllocationMethod: "Dynamic",
    //publicIPAllocationMethod: "Static",
    tags: {"Name": `${name}-publicIp`, "owner": "shaht"},
});

// Create public IP address
const publicIp2 = new network.PublicIPAddress(`${name}-publicIp2`, {
    resourceGroupName: resourceGroup.name,
    publicIPAddressVersion: "IPv4",
    publicIPAllocationMethod: "Dynamic",
    //publicIPAllocationMethod: "Static",
    tags: {"Name": `${name}-publicIp2`, "owner": "shaht"},
});

export const publicIpName = publicIp.name;
export const publicIpAddress = publicIp.ipAddress;

export const appGatewayBackendPoolName = `${name}-appGw-be-address-pool`;
export const appGatewayFrontendConfigurationName = `${name}appGwPublicFrontendIp`;
export const appGatewayFrontendPortHttpName = `${name}-apigw-httpPort`;
export const appGatewayFrontendPortHttpsName = `${name}-apigw-httpsPort`;
export const appGatewayHttpListenerName = `${name}-appGw-http-port-listener`;
export const appGatewayHttpsListenerName = `${name}-appGw-https-port-listener`;
export const appGatewayHttpSettings80Name = `${name}-appGw-be-80`;
export const appGatewayHttpSettings443Name = `${name}-appGw-be-443`;
export const appGatewayWildcardCertificateName = `${name}-appGw-WildcardCert`;
export const appGatewayCorsRewriteRuleSetName = `${name}-appGw-Cors-RewriteRule`;
export const mysubscriptionid = resourceGroup.id.apply(myrg => myrg.split("/")[2]);

// The sku is preventing this from coming up.
const myapplicationgateway = new network.ApplicationGateway(`${name}-applicationgateway`, {
    resourceGroupName: resourceGroup.name,
    applicationGatewayName: `${name}-applicationgateway`,  // No auto-naming for this resource since we need to know its name in an input.
    gatewayIPConfigurations: [{
        name: "appGatewayIpConfig",
        subnet: {
            id: publicSubnets[0].id,
        },
    }],
    enableHttp2: false,
    frontendIPConfigurations: [{
        name: appGatewayFrontendConfigurationName,
        publicIPAddress: {
            id: publicIp.id,
        },
    }],
    frontendPorts: [{
        // Don't have a SSL cert to use so commented out
        //name: appGatewayFrontendPortHttpsName,
        //port: 443,
        name: appGatewayFrontendPortHttpName,
        port: 80,
        
    }
    ],
    backendAddressPools: [{
        name: appGatewayBackendPoolName,
    }],
    backendHttpSettingsCollection: [{
        name: appGatewayHttpSettings80Name,
        port: 80,
        protocol: "Http",
        requestTimeout: 30,
        cookieBasedAffinity: "Disabled",
    }],
    
    // No SSL cert to use so commented out
    //sslCertificates: [{
    //    name: appGatewayWildcardCertificateName,
    //    //data: WildcardCert,
    //    password: "changeit"
    //}],
    
    httpListeners: [{
        name: appGatewayHttpListenerName,
        //protocol: "Https", // Don't have a ssl cert
        protocol: "Http",
        requireServerNameIndication: false,
        frontendIPConfiguration: {
            id: pulumi.interpolate`/subscriptions/${mysubscriptionid}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/applicationGateways/${name}-applicationgateway/frontendIPConfigurations/${appGatewayFrontendConfigurationName}`,
        },
        frontendPort: {
              id: pulumi.interpolate`/subscriptions/${mysubscriptionid}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/applicationGateways/${name}-applicationgateway/frontendPorts/${appGatewayFrontendPortHttpName}`
        },
        //sslCertificate: {
        //    id: pulumi.interpolate`/subscriptions/${mysubscriptionid}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/applicationGateways/${name}-applicationgateway/sslCertificates/${appGatewayWildcardCertificateName}`
        //},
    }],
    requestRoutingRules: [{
        backendAddressPool: {
            id: pulumi.interpolate`/subscriptions/${mysubscriptionid}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/applicationGateways/${name}-applicationgateway/backendAddressPools/${appGatewayBackendPoolName}`,
        },
        backendHttpSettings: {
            id: pulumi.interpolate`/subscriptions/${mysubscriptionid}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/applicationGateways/${name}-applicationgateway/backendHttpSettingsCollection/${appGatewayHttpSettings80Name}`,
        },
        httpListener: {
            id: pulumi.interpolate`/subscriptions/${mysubscriptionid}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/applicationGateways/${name}-applicationgateway/httpListeners/${appGatewayHttpListenerName}`,
        },
        rewriteRuleSet: {
            id: pulumi.interpolate`/subscriptions/${mysubscriptionid}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/applicationGateways/${name}-applicationgateway/rewriteRuleSets/${appGatewayCorsRewriteRuleSetName}`
        },
        name: "httpRule",
        ruleType: "Basic",
    }],
    rewriteRuleSets: [{
        name: appGatewayCorsRewriteRuleSetName,
        rewriteRules: [{
            actionSet: {
                responseHeaderConfigurations: [{
                    headerName: "Access-Controll-Allow-Origin",
                    headerValue: "*"
                }],

            },
            name: "Set CORS header",
            ruleSequence: 101,
        }]
    }],    
    sku: {
        capacity: 2,
        name: "Standard_V2",
        tier: "Standard_V2",
        //name: "WAF_v2",
        //tier: "WAF_v2",
        //name:"Standard_v2",
        //tier:"Standard_v2",
        // Standard_v2 gives this error:  SKU Standard_v2 can only reference public ip with Standard SKU
        // https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/configure-public-ip-application-gateway dynamic ip requires sku standard 1
        // Standard_v1 is retired as of April 2023: We announced the deprecation of Application Gateway V1 SKU (Standard and WAF) on April 28, 2023.
        // https://learn.microsoft.com/en-us/azure/application-gateway/migrate-v1-v2   
    },
});

export const applicationGatewayName = myapplicationgateway.name;
