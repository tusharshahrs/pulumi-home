"""An AWS Python Pulumi program"""

import pulumi
import pulumi_aws as aws
import pulumi_awsx as awsx
from pulumi import export, ResourceOptions, Config
import json

# importing local configs
config = Config()
my_vpc_cidr_block = config.get("vpc_cidr_block") or "10.0.0.0/25"
my_number_of_nat_gateways_requested = config.get_int("number_of_nat_gateways") or 2
my_number_of_availability_zones = config.get_int("number_of_availability_zones") or 2
myip = config.get_secret("my_ipaddress");

myname = "shaht"
# VPC
myvpc = awsx.ec2.Vpc(f"{myname}-vpc",
    cidr_block= my_vpc_cidr_block,
    number_of_availability_zones = my_number_of_availability_zones,
    nat_gateways = my_number_of_nat_gateways_requested
    )

export("vpc_id",myvpc.vpc_id)
export("vpc_cidr_block", my_vpc_cidr_block)
export("number_of_natgateways",my_number_of_nat_gateways_requested)
export("availabililty_zones",my_number_of_availability_zones)
export("public_subnets",myvpc.public_subnet_ids)
export("private_subnets",myvpc.private_subnet_ids)

## Security Group
mysecuritygroup = aws.ec2.SecurityGroup(
    f"{myname}-security-group",
    vpc_id=myvpc.vpc_id,
    description='MSK Security Group for VPC',
    tags={
        'Name': f"{myname}-security-group",
    },
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            cidr_blocks=[myip],
            from_port=0,
            to_port=0,
            protocol='-1',
            description='ingress rule for msk cluster for clients'
        ),
        aws.ec2.SecurityGroupIngressArgs(
            cidr_blocks=[myip],
            from_port=22,
            to_port=22,
            protocol='tcp',
            description='my ssh rule for client server'
        ),
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            cidr_blocks=["0.0.0.0/0"],
            from_port=0,
            to_port=0,
            protocol="-1",
            description="egress outbound rule for msk cluster"
        )
    ],
    opts=ResourceOptions(parent=myvpc, depends_on=myvpc),
) 

export("security_group_name", mysecuritygroup.name)
export("security_group_id", mysecuritygroup.id)

# kms key
mykms = aws.kms.Key(f"{myname}-kms", description="msk kafka kms key")
export("kms_key_id", mykms.key_id)

#cloud watch log group
mycloudwatchloggroup = aws.cloudwatch.LogGroup(f"{myname}-kms-cloudwatch-loggroup")
export("cloudwatch_log_group_name",mycloudwatchloggroup.name)

# s3 bucket
mybucket = aws.s3.Bucket(f"{myname}-bucket",
    acl="private",
    force_destroy=True)

export("s3_bucket_name",mybucket.id)

# iam role
firehoserole = aws.iam.Role(f"{myname}-firehoserole",
    assume_role_policy=json.dumps({
        "Version": "2012-10-17",
        "Statement": [{
            "Action": "sts:AssumeRole",
            "Effect": "Allow",
            "Sid": "",
            "Principal": {
                "Service": "firehose.amazonaws.com",
            },
        }],
    }),
)

export("firehoserole_iam_role",firehoserole.name)

# firehose delivery system
myfirehosedeliverysystem = aws.kinesis.FirehoseDeliveryStream(f"{myname}-firehosedeliverysystem",
    destination="s3",
    s3_configuration=aws.kinesis.FirehoseDeliveryStreamS3ConfigurationArgs(
        role_arn=firehoserole.arn,
        bucket_arn=mybucket.arn 
    )
)

export("myfirehosedeliverysystem_name", myfirehosedeliverysystem.name)

# Apply used to get all individual az's from the subnets for the msk cluster
subnetAz1 = myvpc.public_subnet_ids.apply(lambda public_subnet_ids: public_subnet_ids[0])
subnetAz2 = myvpc.public_subnet_ids.apply(lambda public_subnet_ids: public_subnet_ids[1])
subnetAz3 = myvpc.public_subnet_ids.apply(lambda public_subnet_ids: public_subnet_ids[2])

export("kafka_subnets1",subnetAz1)
export("kafka_subnets2",subnetAz2)
export("kafka_subnets3",subnetAz3)

# msk cluster
mskkafkacluster = aws.msk.Cluster(f"{myname}-msk-kafka-cluster",
    kafka_version="2.6.2",
    number_of_broker_nodes=3,
    broker_node_group_info=aws.msk.ClusterBrokerNodeGroupInfoArgs(
        instance_type="kafka.t3.small",
        client_subnets=[
            subnetAz1,
            subnetAz2,
            subnetAz3,
        ],
        storage_info=aws.msk.ClusterBrokerNodeGroupInfoStorageInfoArgs(
            ebs_storage_info=aws.msk.ClusterBrokerNodeGroupInfoStorageInfoEbsStorageInfoArgs(
                volume_size=100,
            ),
        ),
        security_groups=[mysecuritygroup.id],
    ),
    encryption_info=aws.msk.ClusterEncryptionInfoArgs(
        encryption_at_rest_kms_key_arn=mykms.arn,
    ),
    open_monitoring=aws.msk.ClusterOpenMonitoringArgs(
        prometheus=aws.msk.ClusterOpenMonitoringPrometheusArgs(
            jmx_exporter=aws.msk.ClusterOpenMonitoringPrometheusJmxExporterArgs(
                enabled_in_broker=True,
            ),
            node_exporter=aws.msk.ClusterOpenMonitoringPrometheusNodeExporterArgs(
                enabled_in_broker=True,
            ),
        ),
    ),
    logging_info=aws.msk.ClusterLoggingInfoArgs(
        broker_logs=aws.msk.ClusterLoggingInfoBrokerLogsArgs(
            cloudwatch_logs=aws.msk.ClusterLoggingInfoBrokerLogsCloudwatchLogsArgs(
                enabled=True,
                log_group=mycloudwatchloggroup.name,
            ),
            firehose=aws.msk.ClusterLoggingInfoBrokerLogsFirehoseArgs(
                enabled=True,
                delivery_stream=myfirehosedeliverysystem.name,
            ),
            s3=aws.msk.ClusterLoggingInfoBrokerLogsS3Args(
                enabled=True,
                bucket=mybucket.id,
                prefix="logs/msk-",
            ),
        ),
    ),
    opts=ResourceOptions(parent=myvpc, depends_on=[myvpc,mysecuritygroup,myfirehosedeliverysystem,mykms]),
)

export("msk_cluster_arn",mskkafkacluster.arn)
export("msk_cluster_name",mskkafkacluster.cluster_name)
export("zookeeperConnectString", mskkafkacluster.zookeeper_connect_string)