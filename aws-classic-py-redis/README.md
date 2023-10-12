# AWS VPC Subnets Security Groups Redis Cluster Engine Replacement

aws vpc with no awsx package.  create subnets, security groups, redis cluster, and changing engine version causes replace.  The requirements are pinned on purpose

## Issue
Version of pulumi-aws
`pulumi-aws == 4.1.0` - original, triggers replacement
`pulumi-aws == 4.38.0`  replacement, triggers replacement
`pulumi-aws == 5.30.0` replacement, triggers replacement

## Work Around
   Pass in the updated engine version:  `engine_version=7.0.7`

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init team-ce/dev
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
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
   pulumi up
   Previewing update (team-ce/dev)

   View in Browser (Ctrl+O): https://app.pulumi.com/team-ce/aws-classic-py-redis/dev/previews/90d08f24-c92a-4ff8-91dc-2df4e6c45d2a

      Type                            Name                      Plan       
   +   pulumi:pulumi:Stack             aws-classic-py-redis-dev  create     
   +   ├─ aws:ec2:Vpc                  shaht-vpc                 create     
   +   ├─ aws:ec2:Subnet               shaht-public-subnet-0     create     
   +   ├─ aws:ec2:Subnet               shaht-public-subnet-1     create     
   +   ├─ aws:ec2:Subnet               shaht-private-subnet-0    create     
   +   ├─ aws:ec2:Subnet               shaht-private-subnet-1    create     
   +   ├─ aws:ec2:SecurityGroup        shaht-sg                  create     
   +   ├─ aws:elasticache:SubnetGroup  shaht-redis-subnet-group  create     
   +   └─ aws:elasticache:Cluster      shaht-rediscluster        create     


   Outputs:
      private_subnet_id_0         : output<string>
      private_subnet_id_1         : output<string>
      public_subnet_id_0          : output<string>
      public_subnet_id_1          : output<string>
      redis_cluster_engine_version: "7.0"
      redis_cluster_id            : output<string>
      redis_subnet_group_name     : "shaht-redis-subnet-group-da4f944"
      security_group_id           : output<string>
      security_group_name         : "shaht-sg-fcff373"
      security_group_vpc_id       : output<string>
      vpc_id                      : output<string>

   Resources:
      + 9 to create

   Do you want to perform this update? yes
   Updating (team-ce/dev)

   View in Browser (Ctrl+O): https://app.pulumi.com/team-ce/aws-classic-py-redis/dev/updates/58

      Type                            Name                      Status             
   +   pulumi:pulumi:Stack             aws-classic-py-redis-dev  created (349s)     
   +   ├─ aws:ec2:Vpc                  shaht-vpc                 created (13s)      
   +   ├─ aws:ec2:Subnet               shaht-public-subnet-0     created (11s)      
   +   ├─ aws:ec2:Subnet               shaht-public-subnet-1     created (11s)      
   +   ├─ aws:ec2:Subnet               shaht-private-subnet-0    created (1s)       
   +   ├─ aws:ec2:Subnet               shaht-private-subnet-1    created (1s)       
   +   ├─ aws:ec2:SecurityGroup        shaht-sg                  created (3s)       
   +   ├─ aws:elasticache:SubnetGroup  shaht-redis-subnet-group  created (1s)       
   +   └─ aws:elasticache:Cluster      shaht-rediscluster        created (328s)     


   Outputs:
      private_subnet_id_0         : "subnet-00a636dbdfd45dffb"
      private_subnet_id_1         : "subnet-0c8ecf9431714fb37"
      public_subnet_id_0          : "subnet-01784ad8bac7ec9d1"
      public_subnet_id_1          : "subnet-0f60131d9f056da57"
      redis_cluster_engine_version: "7.0.7"
      redis_cluster_id            : "shaht-rediscluster-3054c6f"
      redis_subnet_group_name     : "shaht-redis-subnet-group-a92ce06"
      security_group_id           : "sg-00e431c13822e0e74"
      security_group_name         : "shaht-sg-69d9e76"
      security_group_vpc_id       : "vpc-0da1f83f3a619a367"
      vpc_id                      : "vpc-0da1f83f3a619a367"

   Resources:
      + 9 created

   Duration: 5m55s
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (11):
    OUTPUT                        VALUE
    private_subnet_id_0           subnet-00a636dbdfd45dffb
    private_subnet_id_1           subnet-0c8ecf9431714fb37
    public_subnet_id_0            subnet-01784ad8bac7ec9d1
    public_subnet_id_1            subnet-0f60131d9f056da57
    redis_cluster_engine_version  7.0.7
    redis_cluster_id              shaht-rediscluster-3054c6f
    redis_subnet_group_name       shaht-redis-subnet-group-a92ce06
    security_group_id             sg-00e431c13822e0e74
    security_group_name           shaht-sg-69d9e76
    security_group_vpc_id         vpc-0da1f83f3a619a367
    vpc_id                        vpc-0da1f83f3a619a367
   ```


1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```