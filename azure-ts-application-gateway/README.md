# Azure Application Gateway with Resource Groups, Vnet, Subnets, and Public Ips, and 

This example deploys a resource group, vnet, 3 public subnets, 3 private subnets, 2 public ip address, and tries to deploy a application gateway. When deploying the application gateway, we are running into SKU issues.  Standard_v1 is retired as of April 2023: We announced the deprecation of Application Gateway V1 SKU (Standard and WAF) on April 28, 2023 as per [Microsoft](https://learn.microsoft.com/en-us/azure/application-gateway/migrate-v1-v2). Therefore the program will fail to come up due to SKU issues. We declared a bunch of names and did not us auto-naming across the board because the azure resource is circular, you have to know the name and use it before it is created.
## Deploying the App

1. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step)

   ```bash
   az login
   ```

1. Create a new stack

   ```bash
   pulumi stack init dev
   ```

1. Install dependencies

   ```bash
   npm install
   ```

1. Configure the location via the config. The Azure region to deploy to is pre-set to **WestUS** - but you can modify the region you would like to deploy to.

   ```bash
   pulumi config set azure-native:location eastus2
   ```

1. Run `pulumi up` to preview and deploy changes: You must select `y` to continue
  
    ```bash
    pulumi up
    ```

    Results
    ```bash
        View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/azure-ts-application-gateway/dev/previews/baecccc2-2c5d-40b6-a1f8-961286a414b4

        Type                                        Name                              Plan       
    +   pulumi:pulumi:Stack                         azure-ts-application-gateway-dev  create     
    +   ├─ azure-native:resources:ResourceGroup     shaht-rg                          create     
    +   ├─ azure-native:network:PublicIPAddress     shaht-publicIp                    create     
    +   ├─ azure-native:storage:StorageAccount      shahtsa                           create     
    +   ├─ azure-native:network:PublicIPAddress     shaht-publicIp2                   create     
    +   ├─ azure-native:network:VirtualNetwork      shaht-vnet                        create     
    +   ├─ azure-native:network:Subnet              shaht-publicSubnet3               create     
    +   ├─ azure-native:network:Subnet              shaht-publicSubnet1               create     
    +   ├─ azure-native:network:Subnet              shaht-privateSubnet3              create     
    +   ├─ azure-native:network:Subnet              shaht-publicSubnet2               create     
    +   ├─ azure-native:network:Subnet              shaht-privateSubnet2              create     
    +   ├─ azure-native:network:Subnet              shaht-privateSubnet1              create     
    +   └─ azure-native:network:ApplicationGateway  shaht-applicationgateway          create     


Current stack outputs (18):
    OUTPUT                               VALUE
    appGatewayBackendPoolName            shaht-appGw-be-address-pool
    appGatewayCorsRewriteRuleSetName     shaht-appGw-Cors-RewriteRule
    appGatewayFrontendConfigurationName  shahtappGwPublicFrontendIp
    appGatewayFrontendPortHttpName       shaht-apigw-httpPort
    appGatewayFrontendPortHttpsName      shaht-apigw-httpsPort
    appGatewayHttpListenerName           shaht-appGw-http-port-listener
    appGatewayHttpSettings443Name        shaht-appGw-be-443
    appGatewayHttpSettings80Name         shaht-appGw-be-80
    appGatewayHttpsListenerName          shaht-appGw-https-port-listener
    appGatewayWildcardCertificateName    shaht-appGw-WildcardCert
    mysubscriptionid                     32b9cb2e-69be-4040-80a6-02cd6b2cc5ec
    primaryStorageKey                    [secret]
    privateSubnetNames                   ["shaht-privateSubnet1","shaht-privateSubnet2","shaht-privateSubnet3"]
    publicIpName                         shaht-publicIp42421671
    publicSubnetNames                    ["shaht-publicSubnet1","shaht-publicSubnet2","shaht-publicSubnet3"]
    resourceGroupName                    shaht-rg5b5c93b0
    storageAccountName                   shahtsa9385d4a3
    vnetName                             shaht-vnet3a37caf3
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (18):
    OUTPUT                               VALUE
    appGatewayBackendPoolName            shaht-appGw-be-address-pool
    appGatewayCorsRewriteRuleSetName     shaht-appGw-Cors-RewriteRule
    appGatewayFrontendConfigurationName  shahtappGwPublicFrontendIp
    appGatewayFrontendPortHttpName       shaht-apigw-httpPort
    appGatewayFrontendPortHttpsName      shaht-apigw-httpsPort
    appGatewayHttpListenerName           shaht-appGw-http-port-listener
    appGatewayHttpSettings443Name        shaht-appGw-be-443
    appGatewayHttpSettings80Name         shaht-appGw-be-80
    appGatewayHttpsListenerName          shaht-appGw-https-port-listener
    appGatewayWildcardCertificateName    shaht-appGw-WildcardCert
    mysubscriptionid                     32b9cb2e-69be-4040-80a6-02cd6b2cc5ec
    primaryStorageKey                    [secret]
    privateSubnetNames                   ["shaht-privateSubnet1","shaht-privateSubnet2","shaht-privateSubnet3"]
    publicIpName                         shaht-publicIp42421671
    publicSubnetNames                    ["shaht-publicSubnet1","shaht-publicSubnet2","shaht-publicSubnet3"]
    resourceGroupName                    shaht-rg5b5c93b0
    storageAccountName                   shahtsa9385d4a3
    vnetName                             shaht-vnet3a37caf3

   ```

   If you need to see the value in `primaryStorageKey`, you will have to do the following
   ```bash
   pulumi stack output primaryStorageKey --show-secrets
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```