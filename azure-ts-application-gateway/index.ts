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
//const privateSubnets = [];

for (let i = 1; i <= 3; i++) {
    publicSubnets.push(new network.Subnet(`${name}-publicSubnet${i}`, {
        resourceGroupName: resourceGroup.name,
        virtualNetworkName: vnet.name,
        addressPrefix: `10.0.${i * 2}.0/24`,
    }, {dependsOn: [vnet]}));
   
    // Commented out prviate subnet creation because we don't need it for this demo and it's causing an error on creation where you have to run pulumi up twice in a row.
    /*
    privateSubnets.push(new network.Subnet(`${name}-privateSubnet${i}`, {
        resourceGroupName: resourceGroup.name,
        virtualNetworkName: vnet.name,
        addressPrefix: `10.0.${i * 2 + 1}.0/24`,
    }, {dependsOn: [vnet], publicSubnets}));
    */
}


export const publicSubnetNames = publicSubnets.map(sn => sn.name);
//export const privateSubnetNames = privateSubnets.map(sn => sn.name);

// Create public IP address
const publicIp = new network.PublicIPAddress(`${name}-publicIp`, {
    resourceGroupName: resourceGroup.name,
    publicIPAddressVersion: "IPv4",
    //publicIPAllocationMethod: "Dynamic", // Allocation method Dynamic is not allowed for SKU Standard_v2 when public IP is used by Application Gateway
    publicIPAllocationMethod: "Static",
    sku: {name: "Standard", tier: "Regional"}, // required to avoid the following error later on:SKU Standard_v2 can only reference public ip with Standard SKU
    tags: {"Name": `${name}-publicIp`, "owner": "shaht"},
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
    },
});

export const applicationGatewayName = myapplicationgateway.name;