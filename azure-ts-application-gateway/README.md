# Azure Application Gateway with Resource Groups, Vnet, Subnets, and Public Ips 

This example deploys a resource group, vnet, 3 public subnets, one public ip address, and deploy an application gateway. Standard_v1 is retired as of April 2023: We announced the deprecation of Application Gateway V1 SKU (Standard and WAF) on April 28, 2023 as per [Microsoft](https://learn.microsoft.com/en-us/azure/application-gateway/migrate-v1-v2). We declared a bunch of names and did not use auto-naming across the board because you have to know the name and use it before it is created.
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
      ❯ pulumi up -y
      Previewing update (dev)

      View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/azure-ts-application-gateway/dev/previews/e3b47487-ef09-4fd8-a509-f781eaffc040

         Type                                        Name                              Plan       
      +   pulumi:pulumi:Stack                         azure-ts-application-gateway-dev  create     
      +   ├─ azure-native:resources:ResourceGroup     shaht-rg                          create     
      +   ├─ azure-native:storage:StorageAccount      shahtsa                           create     
      +   ├─ azure-native:network:VirtualNetwork      shaht-vnet                        create     
      +   ├─ azure-native:network:PublicIPAddress     shaht-publicIp                    create     
      +   ├─ azure-native:network:Subnet              shaht-publicSubnet2               create     
      +   ├─ azure-native:network:Subnet              shaht-publicSubnet1               create     
      +   ├─ azure-native:network:Subnet              shaht-publicSubnet3               create     
      +   └─ azure-native:network:ApplicationGateway  shaht-applicationgateway          create     


      Outputs:
         appGatewayBackendPoolName          : "shaht-appGw-be-address-pool"
         appGatewayCorsRewriteRuleSetName   : "shaht-appGw-Cors-RewriteRule"
         appGatewayFrontendConfigurationName: "shahtappGwPublicFrontendIp"
         appGatewayFrontendPortHttpName     : "shaht-apigw-httpPort"
         appGatewayFrontendPortHttpsName    : "shaht-apigw-httpsPort"
         appGatewayHttpListenerName         : "shaht-appGw-http-port-listener"
         appGatewayHttpSettings443Name      : "shaht-appGw-be-443"
         appGatewayHttpSettings80Name       : "shaht-appGw-be-80"
         appGatewayHttpsListenerName        : "shaht-appGw-https-port-listener"
         appGatewayWildcardCertificateName  : "shaht-appGw-WildcardCert"
         applicationGatewayName             : output<string>
         mysubscriptionid                   : output<string>
         primaryStorageKey                  : output<string>
         publicIpAddress                    : output<string>
         publicIpName                       : output<string>
         publicSubnetNames                  : [
            [0]: output<string>
            [1]: output<string>
            [2]: output<string>
         ]
         resourceGroupName                  : output<string>
         storageAccountName                 : output<string>
         vnetName                           : output<string>

      Resources:
         + 9 to create

      Updating (dev)

      View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/azure-ts-application-gateway/dev/updates/41

         Type                                        Name                              Status              
      +   pulumi:pulumi:Stack                         azure-ts-application-gateway-dev  created (309s)      
      +   ├─ azure-native:resources:ResourceGroup     shaht-rg                          created (0.73s)     
      +   ├─ azure-native:network:VirtualNetwork      shaht-vnet                        created (4s)        
      +   ├─ azure-native:storage:StorageAccount      shahtsa                           created (21s)       
      +   ├─ azure-native:network:PublicIPAddress     shaht-publicIp                    created (2s)        
      +   ├─ azure-native:network:Subnet              shaht-publicSubnet1               created (3s)        
      +   ├─ azure-native:network:Subnet              shaht-publicSubnet2               created (4s)        
      +   ├─ azure-native:network:Subnet              shaht-publicSubnet3               created (4s)        
      +   └─ azure-native:network:ApplicationGateway  shaht-applicationgateway          created (294s)      


      Outputs:
         appGatewayBackendPoolName          : "shaht-appGw-be-address-pool"
         appGatewayCorsRewriteRuleSetName   : "shaht-appGw-Cors-RewriteRule"
         appGatewayFrontendConfigurationName: "shahtappGwPublicFrontendIp"
         appGatewayFrontendPortHttpName     : "shaht-apigw-httpPort"
         appGatewayFrontendPortHttpsName    : "shaht-apigw-httpsPort"
         appGatewayHttpListenerName         : "shaht-appGw-http-port-listener"
         appGatewayHttpSettings443Name      : "shaht-appGw-be-443"
         appGatewayHttpSettings80Name       : "shaht-appGw-be-80"
         appGatewayHttpsListenerName        : "shaht-appGw-https-port-listener"
         appGatewayWildcardCertificateName  : "shaht-appGw-WildcardCert"
         applicationGatewayName             : "shaht-applicationgateway"
         mysubscriptionid                   : "32b9cb2e-69be-4040-80a6-02cd6b2cc5ec"
         primaryStorageKey                  : [secret]
         publicIpAddress                    : "172.177.251.245"
         publicIpName                       : "shaht-publicIp24cb7b59"
         publicSubnetNames                  : [
            [0]: "shaht-publicSubnet1"
            [1]: "shaht-publicSubnet2"
            [2]: "shaht-publicSubnet3"
         ]
         resourceGroupName                  : "shaht-rg6debd300"
         storageAccountName                 : "shahtsa743d5d79"
         vnetName                           : "shaht-vnet59d31549"

      Resources:
         + 9 created

      Duration: 5m11s
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   pulumi stack output
   Current stack outputs (19):
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
    applicationGatewayName               shaht-applicationgateway
    mysubscriptionid                     32b9cb2e-69be-4040-80a6-02cd6b2cc5ec
    primaryStorageKey                    [secret]
    publicIpAddress                      172.177.251.245
    publicIpName                         shaht-publicIp24cb7b59
    publicSubnetNames                    ["shaht-publicSubnet1","shaht-publicSubnet2","shaht-publicSubnet3"]
    resourceGroupName                    shaht-rg6debd300
    storageAccountName                   shahtsa743d5d79
    vnetName                             shaht-vnet59d31549

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