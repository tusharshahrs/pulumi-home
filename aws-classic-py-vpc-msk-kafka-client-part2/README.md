# AWS ec2 for msk cluster instance boostrap servers.

AWS ec2, keypair, sshkey created in python.  Used to ssh into server to connect via the boot strap servers.

## Deployment

1. WARNING! WARNING! BEFORE doing ANYTHING here, you HAVE to HAVE the MSK Cluster Up. That is in: **../aws-classic-py-vpc-msk-kafka-client**

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Create a Python virtualenv, activate it, and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip3 install -r requirements.txt
   ```

1. View the current config settings. This will be empty.

   ```bash
   pulumi config
   ```

   ```bash
   KEY                     VALUE
   ```

1. Populate the config.  Here are aws [endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html)

   ```bash
   pulumi config set aws:region us-east-2 # any valid aws region
   pulumi config set mystackpath  shaht/aws-classic-py-vpc-msk-kafka-client/dev
   ```
    Note: The stack reference is from aws-classic-py-vpc-msk-kafka-client


1. Launch

   ```bash
   pulumi up -y
   ```
 
   Results

   ```bash
    View Live: https://app.pulumi.com/shaht/aws-classic-py-vpc-msk-kafka-client-part2/dev/previews/80a546a0-ae48-4242-a33a-bc966eeaae01

        Type                     Name                                           Plan       
    +   pulumi:pulumi:Stack      aws-classic-py-vpc-msk-kafka-client-part2-dev  create     
    +   ├─ tls:index:PrivateKey  shahtushar-privatekey                          create     
    +   ├─ aws:ec2:KeyPair       shahtushar-keypair                             create     
    +   └─ aws:ec2:Instance      shahtushar-msk-instance                        create     
    
    Resources:
        + 4 to create

    Do you want to perform this update? yes
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-classic-py-vpc-msk-kafka-client-part2/dev/updates/10

        Type                     Name                                           Status      
    +   pulumi:pulumi:Stack      aws-classic-py-vpc-msk-kafka-client-part2-dev  created     
    +   ├─ tls:index:PrivateKey  shahtushar-privatekey                          created     
    +   ├─ aws:ec2:KeyPair       shahtushar-keypair                             created     
    +   └─ aws:ec2:Instance      shahtushar-msk-instance                        created     
    
    Outputs:
        keypair_name    : "shahtushar-keypair-d0f18de"
        msk_ec2_client  : "i-0c82ae7211eda5a5c"
        my_ami_id       : "ami-0d8f6eb4f641ef691"
        my_ami_name     : "amzn2-ami-hvm-2.0.20190618-x86_64-gp2"
        sshPrivateKey_id: "5b4478bc6c46b0e4aa7a3b1b429471f1926a9899"

    Resources:
        + 4 created

    Duration: 21s
   ```

1.  SSH into the ec2 severs, install pulumi, kafka, and then you have to connect to the brokers.

1.  You would set the config similar to this: https://github.com/tusharshahrs/pulumi-homelab/blob/master/kafka-topics-ts/Pulumi.dev.yaml

    *kafka:skipTlsVerify: "false"*
    *kafka:tlsEnabled: "true"*
    You would replace the brokers above with your brokers, not your zookeepers.

1. Then run `pulumi up` from the ec2 msk instance to validate that the brokers connected.  You can see the topics in the aws console on the msk cluster if it worked.

1. Make sure you run `pulumi destroy` from the ec2 server 1st before you destroy anything here.

1. Clean up this program
   ```bash
   pulumi destroy
   ```