# Azure Function Deploying a Serverless Jenkins in TypeScript

Deploying an Azure Function Apps that loads a jenkins docker image

## Prerequisites

- [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
- [Configure Azure credentials](https://www.pulumi.com/docs/intro/cloud-providers/azure/setup/)

## Deployment

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

1. Configure the location to deploy the resources to. The Azure region to deploy to is pre-set to **WestUS** - but you can modify the region you would like to deploy to.

    ```bash
    pulumi config set azure-native:location eastus2
    ```
1. Create that stack via `pulumi up`
    ```bash
    pulumi up -y
    ```

    The Result will be
    ```bash
    View Live: https://app.pulumi.com/shaht/azure-ts-jenkins/dev/updates/1

        Type                                     Name                    Status      
    +   pulumi:pulumi:Stack                      azure-ts-jenkins-dev    created     
    +   ├─ azure-native:resources:ResourceGroup  jenkins-rg              created     
    +   ├─ azure-native:web:AppServicePlan       jenkins-appserviceplan  created     
    +   └─ azure-native:web:WebApp               jenkins-webapp          created     
    
    Outputs:
        jenkinsEndpoint: "https://jenkins-webapp971ad904.azurewebsites.net"

    Resources:
        + 4 created

    Duration: 32s
    ```


1. Check the Outputs
   ```bash
   pulumi stack output
   ```
   Returns:
   ```bash
    Current stack outputs (1):
        OUTPUT           VALUE
        jenkinsEndpoint  https://jenkins-webapp971ad904.azurewebsites.net
   ```

1. Load the URL in a browser. Wait about 60 seconds for jenkins to warm up the 1st time. Wait about another 60-90 seconds for the jenkins app to create the login page

   ```Unlock Jenkins To ensure Jenkins is securely set up by the administrator, a password has been written to the log (not sure where to find it?) and this file on the server:```

1. Destroy the Stack
   ```bash
   pulumi destoy -y
   ```
1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```