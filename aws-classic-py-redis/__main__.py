"""An AWS Python Pulumi program"""

import pulumi
import pulumi_aws as aws

name = "shaht"
# Create an AWS VPC
vpc = aws.ec2.Vpc(f'{name}-vpc',
    cidr_block='10.0.0.0/16',
    enable_dns_hostnames=True,
    enable_dns_support=True,
    tags= {'Name': f'{name}-vpc'})

pulumi.export('vpc_id', vpc.id)

# Create three public subnets
public_subnets = []
for i in range(2):
    public_subnet = aws.ec2.Subnet(f'{name}-public-subnet-{i}',
        cidr_block=f'10.0.{i}.0/24',
        vpc_id=vpc.id,
        map_public_ip_on_launch=True,
        tags= {'Name': f'{name}-public-subnet-{i}'})
    public_subnets.append(public_subnet)

# Create three private subnets
private_subnets = []
for i in range(2):
    private_subnet = aws.ec2.Subnet(f'{name}-private-subnet-{i}',
        cidr_block=f'10.0.{i+3}.0/24',
        vpc_id=vpc.id,
        tags= {'Name': f'{name}-private-subnet-{i}'})
    private_subnets.append(private_subnet)

# Export the IDs of the public subnets
for i, public_subnet in enumerate(public_subnets):
    pulumi.export(f'public_subnet_id_{i}',  public_subnet.id)

# Export the IDs of the private subnets
for i, private_subnet in enumerate(private_subnets):
    pulumi.export(f'private_subnet_id_{i}',  private_subnet.id)

# Create a security group associated with the VPC
mysecuritygroup = aws.ec2.SecurityGroup(f'{name}-sg', 
    vpc_id=vpc.id, 
       egress=[aws.ec2.SecurityGroupEgressArgs(
        from_port=0,
        to_port=0,
        protocol="-1",
        cidr_blocks=["0.0.0.0/0"],
    )],
    ingress=[aws.ec2.SecurityGroupIngressArgs(
        from_port=6379,
        to_port=6379,
        #protocol="-1",
        #self= True,
        protocol='tcp',
        # Change this CIDR BLOCK to your own IP address
        cidr_blocks=["0.0.0.0/0/32"])
        ],
        
    tags= {'Name': f'{name}-sg'},
    opts=pulumi.ResourceOptions(depends_on=[vpc])
)

pulumi.export('security_group_name', mysecuritygroup.name)
pulumi.export('security_group_id', mysecuritygroup.id)
pulumi.export('security_group_vpc_id', mysecuritygroup.vpc_id)

mysubnet_group = aws.elasticache.SubnetGroup(f'{name}-redis-subnet-group',
    #subnet_ids = vpc.vpc_id.subnets.apply(lambda subnets: [subnet.id for subnet in subnets]),
    subnet_ids=[subnet.id for subnet in private_subnets],
    opts=pulumi.ResourceOptions(depends_on=[vpc]),
)

pulumi.export('redis_subnet_group_name', mysubnet_group.name)

# Create a MemoryDB cluster  
redis_cluster = aws.elasticache.Cluster(f'{name}-rediscluster',
    engine="redis",
    engine_version="7.0",
    #engine_version="7.0.7",
    apply_immediately=True,
    node_type='cache.t3.small',
    num_cache_nodes=1,
    az_mode="single-az",   
    subnet_group_name=mysubnet_group.name,
    security_group_ids=[mysecuritygroup.id],
    port=6379,
    tags= {'Name': f'{name}-rediscluster'},
)

pulumi.export('redis_cluster_id', redis_cluster.id)
pulumi.export('redis_cluster_engine_version', redis_cluster.engine_version)

"""
redis_replicationgroup1 = aws.elasticache.ReplicationGroup(f'{name}-redisreplicationgroup1',
    engine="redis",
    engine_version="7.0",
    #engine_version="7.0.7",
    apply_immediately=True,
    node_type='cache.t3.small',
    automatic_failover_enabled=True,
    #multi_az_enabled=True,
    subnet_group_name=mysubnet_group.name,
    security_group_ids=[mysecuritygroup.id],
    port=6379,
    #number_cache_clusters = 2,
    cluster_mode={
        "num_node_groups": 2,
        "replicas_per_node_group": 1,
    },
    at_rest_encryption_enabled = True, 
    transit_encryption_enabled = True,
    replication_group_description="shahtest redis replication group1",
    tags= {'Name': f'{name}-redisreplicationgroup1'},
)
# Export the Redis Cluster ID
pulumi.export('redis_cluster_replicationgroup', redis_replicationgroup1.id)
"""