# AWS 2 VPCs with VPCPeeringConnection and PeeringConnectionOptions with Providers
  Deploying 2 vpcs in different regions via providers and then connecting them via[vpcpeeringconnection](https://www.pulumi.com/registry/packages/aws/api-docs/ec2/peeringconnectionoptions/#cross-account-usage) cross account. All same aws account, but will work on cross account.
# Special Instructions for cross account
  Uncomment `requesterPeeringConnectionOptions` & `accepterPeeringConnectionOptions` blocks at the bottom when working cross account.

## Deploying

 1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).
      ```bash
      pulumi stack init dev
      ```

 1. Now, install dependencies.

   ```bash
   npm install
   ```

 1. View the current config settings. This will be empty.
   ```bash
   pulumi config
   ```
   
   ```bash
   KEY                     VALUE
   ```
 1. Populate the config

   ```bash
   pulumi config set aws:region us-east-1 # do not pick us-east-2 or us-west-2 since we are using them as providers
   ```

1. View the current config settings
   ```bash
   pulumi config
   ```

   ```bash
   KEY                     VALUE
   aws:region              us-east-1
   ```

1. Launch
   ```bash
   pulumi up
   ```

1. Expected output

   ```bash
    View Live: https://app.pulumi.com/shaht/aws-classic-ts-vpc-peeringconnectionoption-providers/dev/updates/71

        Type                             Name                                                      Status       
    +   pulumi:pulumi:Stack                      aws-classic-ts-vpc-peeringconnectionoption-providers-dev  creating     
    +   pulumi:pulumi:Stack                      aws-classic-ts-vpc-peeringconnectionoption-providers-dev  created     
    +   ├─ pulumi:providers:aws                  demo-awsoregonoprovider                                   created    
    +   ├─ aws:ec2:Vpc                           demo-mainVpc                                              created    
    +   ├─ aws:ec2:Vpc                           demo-peerVpc                                              created    
    +   ├─ aws:ec2:VpcPeeringConnection          demo-peerVpcPeeringConnection                             created    
    +   └─ aws:ec2:VpcPeeringConnectionAccepter  demo-peerVpcPeeringConnectionAccepter                     created    
    
    Outputs:
        mainvpc_name                           : "vpc-071e10c4183524c8e"
        ohio_provider_region                   : "us-east-2"
        oregon_provider_region                 : "us-west-2"
        peerOwnerAccountId                     : [secret]
        peerVpcPeeringConnectionAccepter_status: "active"
        peerVpcPeeringConnection_acceptstatus  : "pending-acceptance"
        peerVpcPeeringConnection_id            : "pcx-015ba8ad978dfcd4a"
        peervpc_name                           : "vpc-0cbda59e191fc8393"

    Resources:
        + 7 created

    Duration: 24s
    ```

1. Check the  [stack outputs](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)

   ```bash
   pulumi stack output
   ```

   ```bash
    Current stack outputs (8):
    OUTPUT                                   VALUE
    mainvpc_name                             vpc-071e10c4183524c8e
    ohio_provider_region                     us-east-2
    oregon_provider_region                   us-west-2
    peerOwnerAccountId                       [secret]
    peerVpcPeeringConnectionAccepter_status  active
    peerVpcPeeringConnection_acceptstatus    pending-acceptance
    peerVpcPeeringConnection_id              pcx-015ba8ad978dfcd4a
    peervpc_name                             vpc-0cbda59e191fc8393
   ```

1. Clean up.  
   ```bash
   pulumi destroy -y
   ```

1. Remove.   This will remove the Pulumi.dev.yaml file also
   ```bash
   pulumi stack rm dev -y
   ```