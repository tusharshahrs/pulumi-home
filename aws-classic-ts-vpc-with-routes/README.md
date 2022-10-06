# AWS Vpc, Subnets, Route Table, Route Table Association, Route, and Nat Gateway via EC2 in TypeScript

[AWS](https://www.pulumi.com/registry/packages/aws/) vpc, igw, nat gateway, routes, route tables, route table association, public and private subnets.  Avoiding [routeable](https://www.pulumi.com/registry/packages/aws/api-docs/ec2/routetable/) issue.

## Special Note
 We are avoiding the following issue:
```
NOTE on Route Tables and Routes: This provider currently provides both a standalone Route resource and a Route Table resource with routes defined in-line. At this time you cannot use a Route Table with in-line routes in conjunction with any Route resources. Doing so will cause a conflict of rule settings and will overwrite rules.
```

```

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Install the dependencies
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
        View Live: https://app.pulumi.com/shaht/aws-classic-ts-vpc-with-routes/dev/updates/31

        Type                           Name                                Status       
    +   pulumi:pulumi:Stack            aws-classic-ts-vpc-with-routes-dev  creating..   
    +   ├─ aws:ec2:Vpc                 demo-vpc                            created      
    +   │  ├─ aws:ec2:Subnet           demo-private-subnet-1               created      
    +   │  │  └─ aws:ec2:RouteTable                demo-private-rt-1                    created      
    +   │  │     └─ aws:ec2:RouteTableAssociation  demo-private-rt-table-association-1  creating...  
    +   │  ├─ aws:ec2:Subnet                       demo-public-subnet-0                 created      
    +   │  │  └─ aws:ec2:RouteTable                demo-public-rt-0                     created      
    +   │  │     ├─ aws:ec2:Route                  demo-public-route-0                  creating     
    +   │  │     └─ aws:ec2:RouteTableAssociation  demo-private-rt-table-association-1  created      
    +   │  ├─ aws:ec2:Subnet                       demo-public-subnet-1                 created      
    +   │  │     └─ aws:ec2:RouteTableAssociation  demo-public-rt-table-association-0   created      
    +   pulumi:pulumi:Stack                        aws-classic-ts-vpc-with-routes-dev   creating     
    +   │  │     └─ aws:ec2:Route                  demo-public-route-1                  creating.    
    +   │  │     └─ aws:ec2:Route                  demo-public-route-1                  created      
    +   │  ├─ aws:ec2:InternetGateway              demo-igw                             created      
    +   │  ├─ aws:ec2:Subnet                       demo-private-subnet-0                created      
    +   │  │  └─ aws:ec2:RouteTable                demo-private-rt-0                    created     
    +   │  │     ├─ aws:ec2:RouteTableAssociation  demo-private-rt-table-association-0  created     
    +   │  │     └─ aws:ec2:Route                  demo-private-route-0                 created     
    +   │  ├─ aws:ec2:Subnet                       demo-private-subnet-2                created     
    +   │  │  └─ aws:ec2:RouteTable                demo-private-rt-2                    created     
    +   │  │     ├─ aws:ec2:RouteTableAssociation  demo-private-rt-table-association-2  created     
    +   │  │     └─ aws:ec2:Route                  demo-private-route-2                 created     
    +   │  └─ aws:ec2:Subnet                       demo-public-subnet-2                 created     
    +   │     └─ aws:ec2:RouteTable                demo-public-rt-2                     created     
    +   │        ├─ aws:ec2:Route                  demo-public-route-2                  created     
    +   │        └─ aws:ec2:RouteTableAssociation  demo-public-rt-table-association-2   created     
    +   └─ aws:ec2:Eip                             demo-eip-nat-0                       created     
    +      └─ aws:ec2:NatGateway                   demo-natgateway-0                    created     
    
    Outputs:
        eips                            : [
            [0]: {
                Name: "demo-eip-nat-0"
            }
        ]
        igw_id                          : "igw-041ffc2b787debba8"
        igw_tags                        : {
            Name: "demo-igw"
        }
        nat_gateways                    : [
            [0]: "nat-0828e4469c51c20c6"
        ]
        private_route_table_associations: [
            [0]: "rtbassoc-0c7b8aadc76815056"
            [1]: "rtbassoc-09a57971e71e5f1ae"
            [2]: "rtbassoc-040ff70ecf7e84ce1"
        ]
        private_route_tables            : [
            [0]: "rtb-0fe8ff5605d26a8ba"
            [1]: "rtb-0bc29c371ccba152d"
            [2]: "rtb-004ba822d75aa5624"
        ]
        private_route_tables_names      : [
            [0]: {
                Name: "demo-private-rt-0"
            }
            [1]: {
                Name: "demo-private-rt-1"
            }
            [2]: {
                Name: "demo-private-rt-2"
            }
        ]
        private_routes                  : [
            [0]: "r-rtb-0fe8ff5605d26a8ba1080289494"
            [1]: "r-rtb-0bc29c371ccba152d1080289494"
            [2]: "r-rtb-004ba822d75aa56241080289494"
        ]
        private_subnet_cidrs            : [
            [0]: "10.0.1.0/26"
            [1]: "10.0.1.64/26"
            [2]: "10.0.1.128/25"
        ]
        private_subnet_ids              : [
            [0]: "subnet-0435a797be65bba17"
            [1]: "subnet-013f6939a839d0fa1"
            [2]: "subnet-08b68b067d326e777"
        ]
        public_route_table_associations : [
            [0]: "rtbassoc-0651c430d37ed85d4"
            [1]: "rtbassoc-0bd853d3ae19d8c44"
            [2]: "rtbassoc-0ec1aaeb81b6cc971"
        ]
        public_route_tables             : [
            [0]: "rtb-07f70e03694e18efc"
            [1]: "rtb-0841d876aa5a7da98"
            [2]: "rtb-04dd72b3664ecbc99"
        ]
        public_route_tables_names       : [
            [0]: {
                Name: "demo-public-rt-0"
            }
            [1]: {
                Name: "demo-public-rt-1"
            }
            [2]: {
                Name: "demo-public-rt-2"
            }
        ]
        public_routes                   : [
            [0]: "r-rtb-07f70e03694e18efc1080289494"
            [1]: "r-rtb-0841d876aa5a7da981080289494"
            [2]: "r-rtb-04dd72b3664ecbc991080289494"
        ]
        public_subnet_cidrs             : [
            [0]: "10.0.0.0/25"
            [1]: "10.0.0.128/26"
            [2]: "10.0.0.192/26"
        ]
        public_subnet_ids               : [
            [0]: "subnet-0e31a0cf353956443"
            [1]: "subnet-0ae40f3cb3b42a8e7"
            [2]: "subnet-090ef3fc55bb5ecf5"
        ]
        vpc_id                          : "vpc-081519e2f7f560086"
        vpc_tags                        : {
            Name: "demo-vpc"
        }
        zone1                           : "us-east-2a"
        zone2                           : "us-east-2b"
        zone3                           : "us-east-2c"
        zones                           : [
            [0]: "us-east-2a"
            [1]: "us-east-2b"
            [2]: "us-east-2c"
        ]

    Resources:
        + 29 created

    Duration: 2m31s
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (22):
    OUTPUT                            VALUE
    eips                              [{"Name":"demo-eip-nat-0"}]
    igw_id                            igw-041ffc2b787debba8
    igw_tags                          {"Name":"demo-igw"}
    nat_gateways                      ["nat-0828e4469c51c20c6"]
    private_route_table_associations  ["rtbassoc-0c7b8aadc76815056","rtbassoc-09a57971e71e5f1ae","rtbassoc-040ff70ecf7e84ce1"]
    private_route_tables              ["rtb-0fe8ff5605d26a8ba","rtb-0bc29c371ccba152d","rtb-004ba822d75aa5624"]
    private_route_tables_names        [{"Name":"demo-private-rt-0"},{"Name":"demo-private-rt-1"},{"Name":"demo-private-rt-2"}]
    private_routes                    ["r-rtb-0fe8ff5605d26a8ba1080289494","r-rtb-0bc29c371ccba152d1080289494","r-rtb-004ba822d75aa56241080289494"]
    private_subnet_cidrs              ["10.0.1.0/26","10.0.1.64/26","10.0.1.128/25"]
    private_subnet_ids                ["subnet-0435a797be65bba17","subnet-013f6939a839d0fa1","subnet-08b68b067d326e777"]
    public_route_table_associations   ["rtbassoc-0651c430d37ed85d4","rtbassoc-0bd853d3ae19d8c44","rtbassoc-0ec1aaeb81b6cc971"]
    public_route_tables               ["rtb-07f70e03694e18efc","rtb-0841d876aa5a7da98","rtb-04dd72b3664ecbc99"]
    public_route_tables_names         [{"Name":"demo-public-rt-0"},{"Name":"demo-public-rt-1"},{"Name":"demo-public-rt-2"}]
    public_routes                     ["r-rtb-07f70e03694e18efc1080289494","r-rtb-0841d876aa5a7da981080289494","r-rtb-04dd72b3664ecbc991080289494"]
    public_subnet_cidrs               ["10.0.0.0/25","10.0.0.128/26","10.0.0.192/26"]
    public_subnet_ids                 ["subnet-0e31a0cf353956443","subnet-0ae40f3cb3b42a8e7","subnet-090ef3fc55bb5ecf5"]
    vpc_id                            vpc-081519e2f7f560086
    vpc_tags                          {"Name":"demo-vpc"}
    zone1                             us-east-2a
    zone2                             us-east-2b
    zone3                             us-east-2c
    zones                             ["us-east-2a","us-east-2b","us-east-2c"]
   ```

1. There will be no `diff` in the routetable regardless of how many times you run `pulumi up` without any changes.

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```