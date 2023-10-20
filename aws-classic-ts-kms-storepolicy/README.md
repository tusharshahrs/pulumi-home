# AWS KMS Store Policy via StackReferences in a APPLY

We are passing in the stack reference from:  `aws-classic-ts-kms-iampolicy` and passing it in as a `APPLY`.

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
    pulumi config set configKmsKeyCmk  team-ce/aws-classic-ts-kms-iampolicy/shahtdev
    ```

1. Run **pulumi up** to preview and deploy changes via selecting **y**
    ```bash
    pulumi up
    View in Browser (Ctrl+O): https://app.pulumi.com/team-ce/aws-classic-ts-kms-storepolicy/shahtdev/previews/f9360268-e9d9-49f6-8a99-c0f1c519bc6c

        Type                 Name                                     Plan       
    +   pulumi:pulumi:Stack  aws-classic-ts-kms-storepolicy-shahtdev  create     
    +   ├─ aws:iam:Policy    parameterStorePolicy-shaht               create     
    +   └─ aws:iam:Policy    parameterStorePolicy2-shaht              create     


    Outputs:
        parameterStorePolicy2info: output<string>
        parameterStorePolicyArn  : output<string>
        stackKmsKeyCmk           : "arn:aws:iam::052848974346:policy/shaht-kmsFullAccess-3f8b1a5"
        stackKmsKeyCmkinfo2      : {
            value: "arn:aws:iam::052848974346:policy/shaht-kmsFullAccess-3f8b1a5"
        }

    Resources:
        + 3 to create

    Updating (team-ce/shahtdev)

    View in Browser (Ctrl+O): https://app.pulumi.com/team-ce/aws-classic-ts-kms-storepolicy/shahtdev/updates/35

        Type                 Name                                     Status              
    +   pulumi:pulumi:Stack  aws-classic-ts-kms-storepolicy-shahtdev  created (4s)        
    +   ├─ aws:iam:Policy    parameterStorePolicy-shaht               created (0.51s)     
    +   └─ aws:iam:Policy    parameterStorePolicy2-shaht              created (0.51s)     


    Outputs:
        parameterStorePolicy2info: "arn:aws:iam::052848974346:policy/parameterStorePolicy2-shaht-636ef8e"
        parameterStorePolicyArn  : "arn:aws:iam::052848974346:policy/parameterStorePolicy-shaht-e12218c"
        stackKmsKeyCmk           : "arn:aws:iam::052848974346:policy/shaht-kmsFullAccess-3f8b1a5"
        stackKmsKeyCmkinfo2      : {
            value: "arn:aws:iam::052848974346:policy/shaht-kmsFullAccess-3f8b1a5"
        }

    Resources:
        + 3 created

    Duration: 6s
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    pulumi stack output
    Current stack outputs (4):
    OUTPUT                     VALUE
    parameterStorePolicy2info  arn:aws:iam::052848974346:policy/parameterStorePolicy2-shaht-636ef8e
    parameterStorePolicyArn    arn:aws:iam::052848974346:policy/parameterStorePolicy-shaht-e12218c
    stackKmsKeyCmk             arn:aws:iam::052848974346:policy/shaht-kmsFullAccess-3f8b1a5
    stackKmsKeyCmkinfo2        {"value":"arn:aws:iam::052848974346:policy/shaht-kmsFullAccess-3f8b1a5"}
   ```

1. Note:  There are two different ways ( pick whatever works for you) that we passed in the value as an `APPLY`
    - 1st resource we called:  `policy: stackKmsKeyCmk.apply(mykmskeyinfo => JSON.stringify`
    - 2nd resource we called:  `policy: pulumi.jsonStringify(` & `"Resource":pulumi.interpolate${stackKmsKeyCmk},`
    - Do to formatting issue, the 2nd resource is missing a "`" after the word *interpolate*

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