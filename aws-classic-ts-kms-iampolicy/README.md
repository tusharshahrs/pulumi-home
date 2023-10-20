# AWS IAM KMS Policy ARN As Stack Output for StackReference
AWS IAM KMS Policy ARN As Stack Output for StackReference in TypeScript

## Running the App

1. Create a new stack

    ```bash
    pulumi stack init dev
    ```

1. Restore npm dependencies

    ```bash
    npm install
    ```
1. Set the AWS region location to use
    ```bash
    pulumi config set aws:region us-east-2
    ```

1. Run **pulumi up** to preview and deploy changes via selecting **y**
    ```bash
    pulumi up
    View in Browser (Ctrl+O): https://app.pulumi.com/team-ce/aws-classic-ts-kms-iampolicy/shahtdev/updates/7

        Type                 Name                                   Status              
    +   pulumi:pulumi:Stack  aws-classic-ts-kms-iampolicy-shahtdev  created (3s)        
    +   └─ aws:iam:Policy    shaht-kmsFullAccess                    created (0.52s)     


    Outputs:
        KmsPolicyArn: "arn:aws:iam::052848974346:policy/shaht-kmsFullAccess-3f8b1a5"

    Resources:
        + 2 created

    Duration: 5s
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    pulumi stack output
    Current stack outputs (1):
        OUTPUT        VALUE
        KmsPolicyArn  arn:aws:iam::052848974346:policy/shaht-kmsFullAccess-3f8b1a5
   ```


1. Run **pulumi stack** since we need the part appended to the pulumi console URL.
    ```bash
    pulumi stack ls
    ```

    Results
    ```
    NAME               LAST UPDATE    RESOURCE COUNT  URL
    team-ce/shahtdev*  3 minutes ago  3               https://app.pulumi.com/team-ce/aws-classic-ts-kms-iampolicy/shahtdev
    ```
    
    We will need this: `team-ce/aws-classic-ts-kms-iampolicy/shahtdev`  which corresponds to `org/project/stack`

1. Destroy the stack
    ```bash
    pulumi stack destroy -y
    ```

1. Remove the stack.  This will remove the *Pulumi.dev.yaml* file
   ```bash
   pulumi stack rm
   ```