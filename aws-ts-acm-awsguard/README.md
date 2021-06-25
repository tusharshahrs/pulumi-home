# Deploying AWS ACM with AWSGuard in Typescript

Creating a tls private key, a self signed certificate, and then an ACM certificate.  Also,
creating a [AWSGuard](https://www.pulumi.com/docs/guides/crossguard/awsguard/) policy for
ACM certificate expiration days.
## Deployment

1. Create a new stack
    ```bash
    pulumi stack init dev
    ```
1. Install dependencies
    ```bash
    npm install
    ```

1. Install the dependencies inside the policy pack
    ```bash
    cd acmcertificateexpiration
    npm install
    cd ..
    ```

1. Configure the location to deploy the resources to. The default region is us-east-1. We are deploying to us-east-2(Ohio)

    ```bash
    pulumi config set aws:region us-east-2
    ```

1. Run `pulumi up` to preview and select `yes` to deploy changes:
   ```bash
   pulumi up
   ```

   Results
   ```bash
   Updating (dev)

    View Live: https://app.pulumi.com/myuser/aws-ts-acm-awsguard/dev/updates/1

        Type                         Name                        Status      
    +   pulumi:pulumi:Stack          aws-ts-acm-awsguard-dev     created     
    +   ├─ tls:index:PrivateKey      demo-examplePrivateKey      created     
    +   ├─ tls:index:SelfSignedCert  demo-exampleSelfSignedCert  created     
    +   └─ aws:acm:Certificate       demo-cert                   created     
    
    Outputs:
        cert_domainName      : "demoexample.acme.com"
        cert_id              : "arn:aws:acm:us-east-1:052848974346:certificate/30840e8d-2a46-4387-a368-2597395e1333"
        cert_status          : "ISSUED"
        cert_validationmethod: "NONE"

    Resources:
        + 4 created

    Duration: 5s
   ```

1. Validate the certification expiration.  This is run from the same place that the Pulumi.yaml resides

   ```bash
   pulumi preview --policy-pack acmcertificateexpiration
   ```