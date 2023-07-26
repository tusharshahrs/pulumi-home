# Google Classic with ServiceAccount and PrivateKey and PublicKey in TypeScript

A Google classic stack with a serviceacccount and private key and public key in typescript. The outputs are all secrets.  We do base64 decoding via an [apply](https://www.pulumi.com/docs/concepts/inputs-outputs/#apply)

## Prerequisites

Before trying to deploy this example, please make sure you have performed all of the following tasks:
- [Downloaded & installed the Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Signed up for Google Cloud](https://cloud.google.com/free/)
- [Connect Pulumi to your Google Cloud Account](https://www.pulumi.com/docs/intro/cloud-providers/gcp/setup/)

## Running the Example

1. Create a new stack, which is an isolated deployment target for this example.
    ```bash
    pulumi stack init dev
    ```

1. Install dependencies
    ```bash
    npm install
    ```

1. Set the required configuration variables for this program such as **project**, **region**, & **subnet cidr blocks**.

    ```bash
    pulumi config set gcp:region us-central1 # replace with your gcp region
    pulumi config set gcp:project pulumi-ce-team # using classic so also have to set this
    ```
1. Create that stack via `pulumi up`
    ```bash
    pulumi up -y
    ```

    The Result will be

    ```bash
    Previewing update (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/team-ce/gcp-classic-ts-serviceaccount-key/dev/previews/c6a0d192-7a0a-46d7-b175-ea30259071da

        Type                           Name                                   Plan       
    +   pulumi:pulumi:Stack            gcp-classic-ts-serviceaccount-key-dev  create     
    +   ├─ gcp:serviceAccount:Account  demo-serviceaccount                    create     
    +   └─ gcp:serviceAccount:Key      demo-Key                               create     


    Outputs:
        myaccountName     : output<string>
        mykeyName         : output<string>
        mykeyPrivateKey   : output<string>
        mykeyPublicKey    : output<string>
        privateKey_decoded: output<string>

    Resources:
        + 3 to create

    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/team-ce/gcp-classic-ts-serviceaccount-key/dev/updates/13

        Type                           Name                                   Status              
    +   pulumi:pulumi:Stack            gcp-classic-ts-serviceaccount-key-dev  created (3s)        
    +   ├─ gcp:serviceAccount:Account  demo-serviceaccount                    created (1s)        
    +   └─ gcp:serviceAccount:Key      demo-Key                               created (0.63s)     


    Outputs:
        myaccountName     : [secret]
        mykeyName         : [secret]
        mykeyPrivateKey   : [secret]
        mykeyPublicKey    : [secret]
        privateKey_decoded: [secret]

    Resources:
        + 3 created

    Duration: 6s
    ```

1. Check the Outputs
   ```bash
   pulumi stack output
   ```

   Returns:
   ```bash
    Current stack outputs (5):
    OUTPUT              VALUE
    myaccountName       [secret]
    mykeyName           [secret]
    mykeyPrivateKey     [secret]
    mykeyPublicKey      [secret]
    privateKey_decoded  [secret]
   ```

1. To see the secret values, you run the following.
   ```bash
   pulumi stack output --show-secrets privateKey_decoded
   ```
 
1. Destroy the Stack
   ```bash
   pulumi destroy -y
   ```

1. Remove the stack
   ```bash
   pulumi stack rm dev
   ```