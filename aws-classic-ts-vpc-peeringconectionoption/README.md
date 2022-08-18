# AWS 2 VPCs with VPCPeeringConnection and PeeringConnectionOptions

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

   Here are aws [endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html). *Note* If you pick something besides *us-east-2*, you need to edit the *index.ts* file and update the 3 availability zones
   ```bash
   pulumi config set aws:region us-east-2 # any valid aws region endpoint
   ```

1. View the current config settings
   ```bash
   pulumi config
   ```

   ```bash
   KEY                     VALUE
   aws:region              us-east-2
   ```

1. Launch
   ```bash
   pulumi up
   ```

1. Expected output

   ```bash
   View Live: https://app.pulumi.com/shaht/aws-classic-ts-vpc-peeringconectionoption/dev/updates/8

     Type                                 Name                                           Status      
    +   pulumi:pulumi:Stack                  aws-classic-ts-vpc-peeringconectionoption-dev  created     
    +   ├─ aws:ec2:Vpc                       demo-secondVpc                                 created     
    +   ├─ aws:ec2:Vpc                       demo-firstVpc                                  created     
    +   ├─ aws:ec2:VpcPeeringConnection      demo-VpcPeeringConnection                      created     
    +   └─ aws:ec2:PeeringConnectionOptions  demo-fooPeeringConnectionOptions               created     
    
    Outputs:
        firstvpc_name                          : "vpc-044d3be373c3d4a7a"
        myvpcPeeringConnectionOptions_accepter : {
            allowClassicLinkToRemoteVpc: false
            allowRemoteVpcDnsResolution: true
            allowVpcToRemoteClassicLink: false
        }
        myvpcPeeringConnectionOptions_id       : "pcx-05b872c2a807d19b1"
        myvpcPeeringConnectionOptions_requester: {
            allowClassicLinkToRemoteVpc: false
            allowRemoteVpcDnsResolution: true
            allowVpcToRemoteClassicLink: false
        }
        secondvpc_name                         : "vpc-0b6017655b0bfefeb"
        vpcpeeringconnection_acceptstatus      : "active"
        vpcpeeringconnection_id                : "pcx-05b872c2a807d19b1"

    Resources:
        + 5 created

    Duration: 19s
    ```

1. Check the  [stack outputs](https://www.pulumi.com/docs/reference/cli/pulumi_stack_output/)

   ```bash
   pulumi stack output
   ```

   ```bash
    Current stack outputs (7):
    OUTPUT                                   VALUE
    firstvpc_name                            vpc-044d3be373c3d4a7a
    myvpcPeeringConnectionOptions_accepter   {"allowClassicLinkToRemoteVpc":false,"allowRemoteVpcDnsResolution":true,"allowVpcToRemoteClassicLink":false}
    myvpcPeeringConnectionOptions_id         pcx-05b872c2a807d19b1
    myvpcPeeringConnectionOptions_requester  {"allowClassicLinkToRemoteVpc":false,"allowRemoteVpcDnsResolution":true,"allowVpcToRemoteClassicLink":false}
    secondvpc_name                           vpc-0b6017655b0bfefeb
    vpcpeeringconnection_acceptstatus        active
    vpcpeeringconnection_id                  pcx-05b872c2a807d19b1
   ```

1. Clean up.  
   ```bash
   pulumi destroy -y
   ```

1. Remove.   This will remove the Pulumi.dev.yaml file also
   ```bash
   pulumi stack rm dev -y
   ```