
# AWS VPC in python with awsx package and MSK cluster in python

AWS VPC, igw, nat gateway, public and private subnets in python. MSK cluster.

## Deployment

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
   pulumi config set vpc_cidr_block 10.0.0.0/22
   pulumi config set number_of_availability_zones 3
   pulumi config set number_of_nat_gateways 1 # optional
   ```

1. Launch.  MSK takes a while to come, it takes a while like eks does.

   ```bash
   pulumi up -y
   ```

1. Outputs

```bash
pulumi stack output
```

  Results
```bash
    Outputs:
    availabililty_zones          : 3
    bootstrap_brokers_tls        : "b-1.shahtmskkafkacluster13.9572ox.c6.kafka.us-east-2.amazonaws.com:9094,b-2.shahtmskkafkacluster13.9572ox.c6.kafka.us-east-2.amazonaws.com:9094,b-3.shahtmskkafkacluster13.9572ox.c6.kafka.us-east-2.amazonaws.com:9094"
    cloudwatch_log_group_name    : "shaht-kms-cloudwatch-loggroup-e991096"
    firehoserole_iam_role        : "shaht-firehoserole-28cad01"
    kafka_subnets1               : "subnet-0ba6d65de3ac2d55e"
    kafka_subnets2               : "subnet-07dcd0e44c39bf899"
    kafka_subnets3               : "subnet-05cbb0d11fd758f41"
    kms_key_id                   : "28872d4c-51a9-4d70-8f07-930ad6f26075"
    msk_cluster_arn              : "arn:aws:kafka:us-east-2:052848974346:cluster/shaht-msk-kafka-cluster-1331e9a/9428f84b-ad0e-4ff8-acf2-e5ef5702608d-6"
    msk_cluster_name             : "shaht-msk-kafka-cluster-1331e9a"
    myfirehosedeliverysystem_name: "shaht-firehosedeliverysystem-1bfa8ea"
    number_of_natgateways        : 1
    private_subnets              : [
        [0]: "subnet-0025cb4bfc0d9fca8"
        [1]: "subnet-0a0fe9418e022594d"
        [2]: "subnet-00ebb0a91be224c7d"
    ]
    public_subnets               : [
        [0]: "subnet-0ba6d65de3ac2d55e"
        [1]: "subnet-07dcd0e44c39bf899"
        [2]: "subnet-05cbb0d11fd758f41"
    ]
    s3_bucket_name               : "shaht-bucket-6994ceb"
    security_group_id            : "sg-0fc51f52c91b53706"
    security_group_name          : "shaht-security-group-82d8eb0"
    vpc_cidr_block               : "10.0.0.0/22"
    vpc_id                       : "vpc-0b4728a58cc591768"
    zookeeperConnectString       : "z-1.shahtmskkafkacluster13.9572ox.c6.kafka.us-east-2.amazonaws.com:2181,z-2.shahtmskkafkacluster13.9572ox.c6.kafka.us-east-2.amazonaws.com:2181,z-3.shahtmskkafkacluster13.9572ox.c6.kafka.us-east-2.amazonaws.com:2181"
```

1. Get the stack reference via `pulumi stack output` since we will need it for the next program

1. Next Step go to [aws-classic-py-vpc-msk-kafka-client-part-2](../aws-classic-py-vpc-msk-kafka-client-part2) and run *pulumi up* there