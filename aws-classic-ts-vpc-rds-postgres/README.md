# AWS AWSX Multilang Vpc Single Nat Gateway RDS Postgres in TypeScript

[AWSX](https://www.pulumi.com/registry/packages/awsx/)multilang VPC, igw, single nat gateway strategy, public and private subnets. [RDS](https://www.pulumi.com/registry/packages/aws/api-docs/rds/) Postgres multi az. [Programtically creating secrets](https://www.pulumi.com/docs/intro/concepts/secrets/#programmatically-creating-secrets)

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Install dependencies:
   ```bash
   npm install
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
    Updating (dev)

        View Live: https://app.pulumi.com/shaht/aws-classic-ts-vpc-rds-postgres/dev/updates/8

        Type                              Name                                 Status       
    +   pulumi:pulumi:Stack               aws-classic-ts-vpc-rds-postgres-dev  creating     
    +   pulumi:pulumi:Stack               aws-classic-ts-vpc-rds-postgres-dev  creating.    
    +   pulumi:pulumi:Stack               aws-classic-ts-vpc-rds-postgres-dev  creating..   
    +      └─ aws:ec2:Vpc                 demo-vpc                             created      
    +         ├─ aws:ec2:InternetGateway              demo-vpc                             created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-1                    creating     
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-3                    creating.    
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-3                    created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-3                    created      
    +         │  └─ aws:ec2:RouteTable                demo-vpc-public-3                    creating     
    +         │  └─ aws:ec2:RouteTable                demo-vpc-public-1                    created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-private-1                   created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-private-1                   created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-private-1                   created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-private-1                   created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-private-1                   created      
    +         │  └─ aws:ec2:RouteTable                demo-vpc-private-1                   created      
    +         │     └─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                   created      
    +         │  └─ aws:ec2:NatGateway                demo-vpc-1                           created      
    +         ├─ aws:ec2:Subnet                       demo-vpc-public-2                    created      
    +         │  └─ aws:ec2:RouteTable                demo-vpc-public-2                    created      
    +      │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                    created      
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-public-2                    created      
    +   pulumi:pulumi:Stack                           aws-classic-ts-vpc-rds-postgres-dev  creating.    
    +   │  │  │  └─ aws:ec2:RouteTable                demo-vpc-private-3                   created     
    +   │  │  │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                   created     
    +   │  │  │     └─ aws:ec2:Route                  demo-vpc-private-3                   created     
    +   │  │  └─ aws:ec2:Subnet                       demo-vpc-private-2                   created     
    +   │  │     └─ aws:ec2:RouteTable                demo-vpc-private-2                   created     
    +   │  │        ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                   created     
    +   │  │        └─ aws:ec2:Route                  demo-vpc-private-2                   created     
    +   │  └─ aws:ec2:SecurityGroup                   demo-securitygroup                   created     
    +   ├─ aws:rds:SubnetGroup                        demo-dbsubnets                       created     
    +   └─ aws:rds:Instance                           demo-postgres                        created     
    
    Outputs:
        db_postgres_az           : "us-east-2c"
        db_postgres_endpoint     : [secret]
        db_postgres_engine       : "postgres"
        db_postgres_engineversion: "14"
        db_postgres_id           : "demo-postgres2ec0e42"
        db_postgres_multiaz      : true
        db_postgres_port         : 5432
        dbsubnet_name            : "demo-dbsubnets-050b897"
        rds_password             : [secret]
        security_group_name      : "sg-08ed4bb1ea0d11089"
        security_group_vpc       : "vpc-07f4a6e0908fb058f"
        vpc_id                   : "vpc-07f4a6e0908fb058f"
        vpc_natgateways          : "nat-0c8acb2463252a11e"
        vpc_private_subnetids    : [
            [0]: "subnet-07263b83e0a08afb2"
            [1]: "subnet-0dca2bce1b9c4736d"
            [2]: "subnet-0b926df0ad2e796a0"
        ]
        vpc_public_subnetids     : [
            [0]: "subnet-055b4e5fc09793599"
            [1]: "subnet-0220000647d8b079d"
            [2]: "subnet-09a82b92120a79353"
        ]

    Resources:
        + 34 created

    Duration: 12m26s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (15):
    OUTPUT                     VALUE
    db_postgres_az             us-east-2c
    db_postgres_endpoint       [secret]
    db_postgres_engine         postgres
    db_postgres_engineversion  14
    db_postgres_id             demo-postgres2ec0e42
    db_postgres_multiaz        true
    db_postgres_port           5432
    dbsubnet_name              demo-dbsubnets-050b897
    rds_password               [secret]
    security_group_name        sg-08ed4bb1ea0d11089
    security_group_vpc         vpc-07f4a6e0908fb058f
    vpc_id                     vpc-07f4a6e0908fb058f
    vpc_natgateways            nat-0c8acb2463252a11e
    vpc_private_subnetids      ["subnet-07263b83e0a08afb2","subnet-0dca2bce1b9c4736d","subnet-0b926df0ad2e796a0"]
    vpc_public_subnetids       ["subnet-055b4e5fc09793599","subnet-0220000647d8b079d","subnet-09a82b92120a79353"]
   ```

1. To view the secret output
   ```bash
   pulumi stack output --show-secrets rds_password
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```