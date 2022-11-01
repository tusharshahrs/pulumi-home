# AWS Vpc via EC2 with no loops in TypeScript

[AWS](https://www.pulumi.com/registry/packages/aws/) vpc, subnet, igw, nat gateway, routes, route tables, route table association, public and private subnets.



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
      View Live: https://app.pulumi.com/shaht/aws-classic-ts-vpc-routetables-no-loops/dev/updates/3

        Type                                    Name                                         Status      
    +   pulumi:pulumi:Stack                     aws-classic-ts-vpc-routetables-no-loops-dev  created     
    +   ├─ aws:ec2:Vpc                          demo-vpc                                     created     
    +   │  ├─ aws:ec2:Subnet                    demo-private-subnet1                         created     
    +   │  ├─ aws:ec2:InternetGateway           demo-igw                                     created     
    +   │  ├─ aws:ec2:Subnet                    demo-public-subnet2                          created     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-public-rt-association-2                 created     
    +   │  ├─ aws:ec2:Subnet                    demo-private-subnet2                         created     
    +   │  ├─ aws:ec2:Subnet                    demo-public-subnet1                          created     
    +   │  │  ├─ aws:ec2:Eip                    demo-eip-nat                                 created     
    +   │  │  │  └─ aws:ec2:NatGateway          demo-natgateway1                             created     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-public-rt-association-1                 created     
    +   │  ├─ aws:ec2:Subnet                    demo-public-subnet3                          created     
    +   │  │  └─ aws:ec2:RouteTableAssociation  demo-public-rt-association-3                 created     
    +   │  ├─ aws:ec2:Subnet                    demo-private-subnet3                         created     
    +   │  └─ aws:ec2:RouteTable                demo-public-route-table                      created     
    +   ├─ aws:ec2:RouteTable                   demo-private-rt1                             created     
    +   │  └─ aws:ec2:RouteTableAssociation     demo-pv-rta1                                 created     
    +   ├─ aws:ec2:RouteTable                   demo-private-rt2                             created     
    +   │  └─ aws:ec2:RouteTableAssociation     demo-pv-rta2                                 created     
    +   └─ aws:ec2:RouteTable                   demo-private-rt3                             created     
    +      └─ aws:ec2:RouteTableAssociation     demo-pv-rta3                                 created     
    
    Outputs:
        eip_name                              : "eipalloc-0c9300fa553ce9049"
        igw_id                                : "igw-0464c3df946d68127"
        igw_tags                              : {
            Name: "demo-igw"
        }
        nat_gateway_name                      : "nat-0b203b3161bb0f85d"
        private_rt1_name                      : "rtb-0b5321f2e0193ac62"
        private_rt2_name                      : "rtb-0b058b4f22f7e874e"
        private_rt3_name                      : "rtb-0a202cabf17d4db3f"
        private_rt_association1_id            : "rtbassoc-064ccbc8021dfff1a"
        private_rt_association2_id            : "rtbassoc-02eab9062825567e2"
        private_rt_association3_id            : "rtbassoc-081661b42ff0b99bb"
        private_subnet1_name                  : "subnet-0e62629e2c050bf2a"
        private_subnet1_vpc                   : "vpc-002944bf910a2182e"
        private_subnet2_name                  : "subnet-089fa24de24feb59b"
        private_subnet2_vpc                   : "vpc-002944bf910a2182e"
        private_subnet3_name                  : "subnet-09dea432e8c4326e7"
        private_subnet3_vpc                   : "vpc-002944bf910a2182e"
        public_route_table_id                 : "rtb-089753c0ee169b411"
        public_route_table_vpc_tags           : {
            Name: "demo-public-route-table"
        }
        public_subnet1_name                   : "subnet-067d75b319f5a45ca"
        public_subnet1_vpc                    : "vpc-002944bf910a2182e"
        public_subnet2_name                   : "subnet-0671c303e5253a67e"
        public_subnet2_vpc                    : "vpc-002944bf910a2182e"
        public_subnet3_name                   : "subnet-0de734c6b2fff4c07"
        public_subnet3_vpc                    : "vpc-002944bf910a2182e"
        route_table_id_association_public_1_id: "rtbassoc-03532f78964ea0524"
        route_table_id_association_public_2_id: "rtbassoc-01b462d5ab3cfa2ce"
        route_table_id_association_public_3_id: "rtbassoc-091874ef6bf6347ef"
        vpc_id                                : "vpc-002944bf910a2182e"
        vpc_tags                              : {
            Name: "demo-vpc"
        }
        zone1                                 : "us-east-2a"
        zone2                                 : "us-east-2b"
        zone3                                 : "us-east-2c"
        zones                                 : [
            [0]: "us-east-2a"
            [1]: "us-east-2b"
            [2]: "us-east-2c"
        ]

    Resources:
        + 21 created

    Duration: 1m48s

   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (33):
        OUTPUT                                  VALUE
        eip_name                                eipalloc-0c9300fa553ce9049
        igw_id                                  igw-0464c3df946d68127
        igw_tags                                {"Name":"demo-igw"}
        nat_gateway_name                        nat-0b203b3161bb0f85d
        private_rt1_name                        rtb-0b5321f2e0193ac62
        private_rt2_name                        rtb-0b058b4f22f7e874e
        private_rt3_name                        rtb-0a202cabf17d4db3f
        private_rt_association1_id              rtbassoc-064ccbc8021dfff1a
        private_rt_association2_id              rtbassoc-02eab9062825567e2
        private_rt_association3_id              rtbassoc-081661b42ff0b99bb
        private_subnet1_name                    subnet-0e62629e2c050bf2a
        private_subnet1_vpc                     vpc-002944bf910a2182e
        private_subnet2_name                    subnet-089fa24de24feb59b
        private_subnet2_vpc                     vpc-002944bf910a2182e
        private_subnet3_name                    subnet-09dea432e8c4326e7
        private_subnet3_vpc                     vpc-002944bf910a2182e
        public_route_table_id                   rtb-089753c0ee169b411
        public_route_table_vpc_tags             {"Name":"demo-public-route-table"}
        public_subnet1_name                     subnet-067d75b319f5a45ca
        public_subnet1_vpc                      vpc-002944bf910a2182e
        public_subnet2_name                     subnet-0671c303e5253a67e
        public_subnet2_vpc                      vpc-002944bf910a2182e
        public_subnet3_name                     subnet-0de734c6b2fff4c07
        public_subnet3_vpc                      vpc-002944bf910a2182e
        route_table_id_association_public_1_id  rtbassoc-03532f78964ea0524
        route_table_id_association_public_2_id  rtbassoc-01b462d5ab3cfa2ce
        route_table_id_association_public_3_id  rtbassoc-091874ef6bf6347ef
        vpc_id                                  vpc-002944bf910a2182e
        vpc_tags                                {"Name":"demo-vpc"}
        zone1                                   us-east-2a
        zone2                                   us-east-2b
        zone3                                   us-east-2c
        zones                                   ["us-east-2a","us-east-2b","us-east-2c"]
   ```

1. Destroy the environment
   ```bash
   pulumi destroy -y
   ```

1. Clean up and Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```