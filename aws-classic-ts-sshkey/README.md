
# AWS SSHKEY and ACM CERT creation

AWS sshkey and acm cert creation in typescript

# Requirements

pulumi 3.0 & node 14.

## Running the App

1. Create a new stack

    ```bash
    pulumi stack init dev
    ```

1. Restore NPM dependencies

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
    Previewing update (dev)

    View Live: https://app.pulumi.com/myuser/aws-sshkey-ts/dev/previews/f244c0b0-2ba0-4b9a-9b25-c6b78f6d8c54

        Type                      Name                  Plan       
    +   pulumi:pulumi:Stack       aws-sshkey-ts-dev     create     
    +   ├─ tls:index:PrivateKey   demo-key-privatekey   create     
    +   └─ tls:index:CertRequest  demo-key-certrequest  create     
    
    Resources:
        + 3 to create

    Updating (dev)

    View Live: https://app.pulumi.com/myuser/aws-sshkey-ts/dev/updates/20

        Type                      Name                  Status      
    +   pulumi:pulumi:Stack       aws-sshkey-ts-dev     created     
    +   ├─ tls:index:PrivateKey   demo-key-privatekey   created     
    +   └─ tls:index:CertRequest  demo-key-certrequest  created     
    
    Outputs:
        certrequest_id                : "[secret]"
        certrequest_keyalgorithm      : "RSA"
        certrequest_pem               : "[secret]"
        certrequest_subjects          : [
            [0]: {
                commonName        : "democert"
                organization      : "demoorg"
            }
        ]
        sshkey_algorithm              : "RSA"
        sshkey_id                     : "[secret]"
        sshkey_privatekeypem          : "[secret]"
        sshkey_publickeyfingerprintmd5: "9a:2c:d6:e9:e2:c3:32:0c:c6:7f:e4:27:43:24:47:cc"
        sshkey_publickeyopenssh       : "[secret]"

    Resources:
        + 3 created

    Duration: 4s
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (9):
    OUTPUT                          VALUE
    certrequest_id                  [secret]
    certrequest_keyalgorithm        RSA
    certrequest_pem                 [secret]
    certrequest_subjects            [{"commonName":"democert","country":"","locality":"","organization":"pulumi","organizationalUnit":"","postalCode":"","province":"","serialNumber":"","streetAddresses":[]}]
    sshkey_algorithm                RSA
    sshkey_id                       [secret]
    sshkey_privatekeypem            [secret]
    sshkey_publickeyfingerprintmd5  c5:6a:11:1d:07:30:d9:b8:eb:cd:07:d4:18:02:d5:82
    sshkey_publickeyopenssh         [secret]
   ```

   If you need to see the value in **secret**, you will have to do the following
   ```bash
   pulumi stack output --show-secrets
   ```

1. Run **pulumi stack** since we need the part appended to the pulumi console url.
    ```bash
    pulumi stack
    More information at: https://app.pulumi.com/myuser/aws-sshkey-ts/dev
    ```
    We will need this: `myuser/aws-sshkey-ts/dev`

1. Destroy the stack
    ```bash
    pulumi stack destroy -y
    ```

1. Remove the stack.  This will remove the *Pulumi.dev.yaml* file
   ```bash
   pulumi stack rm
   ```