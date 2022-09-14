# AWS AWSX Multilang Vpc Single Nat Gateway SecurityGroup vs SecurityGroupRules in Python

[AWSX](https://www.pulumi.com/registry/packages/awsx/) multilang VPC, igw, single nat gateway strategy, public and private subnets. [SecurityGroup](https://www.pulumi.com/registry/packages/aws/api-docs/ec2/securitygroup/) vs [SecurityGroupRules](https://www.pulumi.com/registry/packages/aws/api-docs/ec2/securitygrouprule/).

## Speical Note
The issue we are working around: SecurityGroupRules does a replace and recreate(what we don't want).  SecurityGroup only updates the ports(what we want).
```html
NOTE on SecurityGroup and SecurityGroupRules: This provider currently provides both a standalone Security Group Rule resource (a single ingress or egress rule), and a Security Group resource with ingress and egress rules defined in-line. 
At this time you cannot use a Security Group with in-line rules in conjunction with any Security Group Rule resources. Doing so will cause a conflict of rule settings and will overwrite rules.
```

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
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
      View Live: https://app.pulumi.com/myuser/aws-classic-py-securitygroup-vs-securitygrouprules/dev/updates/16

      Type                                          Name                                                    Status       
   +   pulumi:pulumi:Stack                           aws-classic-py-securitygroup-vs-securitygrouprules-dev  creating.    
   +   pulumi:pulumi:Stack                           aws-classic-py-securitygroup-vs-securitygrouprules-dev  creating..   
   +      └─ aws:ec2:Vpc                             demo-vpc                                                created      
   +         ├─ aws:ec2:Subnet                       demo-vpc-public-3                                       created      
   +         │  └─ aws:ec2:RouteTable                demo-vpc-public-3                                       creating..   
   +         │  └─ aws:ec2:RouteTable                demo-vpc-public-3                                       created      
   +         ├─ aws:ec2:Subnet                       demo-vpc-public-1                                       created      
   +         ├─ aws:ec2:Subnet                       demo-vpc-public-1                                       created      
   +         ├─ aws:ec2:Subnet                       demo-vpc-public-1                                       created      
   +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                                       created      
   +   pulumi:pulumi:Stack                           aws-classic-py-securitygroup-vs-securitygrouprules-dev  creating     
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                                       created      
   +         │  │  └─ aws:ec2:Route                  demo-vpc-public-1                                       created      
   +   │     │  └─ aws:ec2:NatGateway                demo-vpc-1                                              created      
   +   │     ├─ aws:ec2:Subnet                       demo-vpc-private-1                                      created      
   +   pulumi:pulumi:Stack                           aws-classic-py-securitygroup-vs-securitygrouprules-dev  creating..   
   +   │     │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                                      created      
   +   │     │     └─ aws:ec2:Route                  demo-vpc-private-1                                      created     
   +   │     ├─ aws:ec2:Subnet                       demo-vpc-public-2                                       created     
   +   │     │  └─ aws:ec2:RouteTable                demo-vpc-public-2                                       created     
   +   │     │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                                       created     
   +   │     │     └─ aws:ec2:Route                  demo-vpc-public-2                                       created     
   +   │     ├─ aws:ec2:Subnet                       demo-vpc-private-2                                      created     
   +   │     │  └─ aws:ec2:RouteTable                demo-vpc-private-2                                      created     
   +   │     │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-2                                      created     
   +   │     │     └─ aws:ec2:Route                  demo-vpc-private-2                                      created     
   +   │     └─ aws:ec2:Subnet                       demo-vpc-private-3                                      created     
   +   │        └─ aws:ec2:RouteTable                demo-vpc-private-3                                      created     
   +   │           ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                                      created     
   +   │           └─ aws:ec2:Route                  demo-vpc-private-3                                      created     
   +   ├─ aws:ec2:SecurityGroup                      demo-securitygroup_with_sg_rules                        created     
   +   ├─ aws:ec2:SecurityGroup                      demo-securitygroup                                      created     
   +   ├─ aws:ec2:SecurityGroupRule                  demo-securitygrouprules1                                created     
   +   └─ aws:ec2:SecurityGroupRule                  demo-securitygrouprules2                                created     
   
   Outputs:
      security_group_egress            : [
         [0]: {
               cidr_blocks     : [
                  [0]: "0.0.0.0/0"
               ]
               description     : "Allow outbound access via https"
               from_port       : 443
               protocol        : "tcp"
               self            : false
               to_port         : 443
         }
         [1]: {
               cidr_blocks     : [
                  [0]: "0.0.0.0/0"
               ]
               description     : "Allow outbound access via http"
               from_port       : 81
               protocol        : "tcp"
               self            : false
               to_port         : 81
         }
      ]
      security_group_ingress           : [
         [0]: {
               cidr_blocks     : [
                  [0]: "0.0.0.0/0"
               ]
               description     : "Allow HTTP access inbound"
               from_port       : 80
               protocol        : "tcp"
               self            : false
               to_port         : 80
         }
         [1]: {
               cidr_blocks     : [
                  [0]: "0.0.0.0/0"
               ]
               description     : "Allow HTTPS access inbound"
               from_port       : 443
               protocol        : "tcp"
               self            : false
               to_port         : 443
         }
      ]
      security_group_name              : "sg-003f44a93c6c264d9"
      security_group_vpc               : "vpc-05e44affb05dc6955"
      security_group_with_rules_egress : "sgrule-2179524875"
      security_group_with_rules_ingress: "sgrule-1979274348"
      security_group_with_rules_name   : "sg-0e8097e1fdecd7c6f"
      security_group_with_rules_vpc    : "vpc-05e44affb05dc6955"
      vpc_id                           : "vpc-05e44affb05dc6955"
      vpc_natgateways                  : "nat-0348b4a48d90dd2ce"
      vpc_private_subnetids            : [
         [0]: "subnet-0c2f3c1b972511252"
         [1]: "subnet-0c8c273311d54103e"
         [2]: "subnet-03d75aca944835628"
      ]
      vpc_public_subnetids             : [
         [0]: "subnet-0e3899be16f927936"
         [1]: "subnet-0f36e7ac0d46939fb"
         [2]: "subnet-024c960e9ca0bccc7"
      ]

   Resources:
      + 34 created

   Duration: 2m15s
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (12):
    OUTPUT                             VALUE
    security_group_egress              [{"cidr_blocks":["0.0.0.0/0"],"description":"Allow outbound access via https","from_port":443,"ipv6_cidr_blocks":[],"prefix_list_ids":[],"protocol":"tcp","security_groups":[],"self":false,"to_port":443},{"cidr_blocks":["0.0.0.0/0"],"description":"Allow outbound access via http","from_port":81,"ipv6_cidr_blocks":[],"prefix_list_ids":[],"protocol":"tcp","security_groups":[],"self":false,"to_port":81}]
    security_group_ingress             [{"cidr_blocks":["0.0.0.0/0"],"description":"Allow HTTP access inbound","from_port":80,"ipv6_cidr_blocks":[],"prefix_list_ids":[],"protocol":"tcp","security_groups":[],"self":false,"to_port":80},{"cidr_blocks":["0.0.0.0/0"],"description":"Allow HTTPS access inbound","from_port":443,"ipv6_cidr_blocks":[],"prefix_list_ids":[],"protocol":"tcp","security_groups":[],"self":false,"to_port":443}]
    security_group_name                sg-003f44a93c6c264d9
    security_group_vpc                 vpc-05e44affb05dc6955
    security_group_with_rules_egress   sgrule-2179524875
    security_group_with_rules_ingress  sgrule-1979274348
    security_group_with_rules_name     sg-0e8097e1fdecd7c6f
    security_group_with_rules_vpc      vpc-05e44affb05dc6955
    vpc_id                             vpc-05e44affb05dc6955
    vpc_natgateways                    nat-0348b4a48d90dd2ce
    vpc_private_subnetids              ["subnet-0c2f3c1b972511252","subnet-0c8c273311d54103e","subnet-03d75aca944835628"]
    vpc_public_subnetids               ["subnet-0e3899be16f927936","subnet-0f36e7ac0d46939fb","subnet-024c960e9ca0bccc7"]
   ```

1. Update the **egress port** `80` to `81` in the `from_port` & `to_port` in the *security_group_no_sg_rules* and in the *security_group_rule2* in `__main__.py`.

1. Run *pulumi up*.  Click on `details` and notice that `preview` will show only ports are updated(what we want) in the *security_group_no_sg_rules* while *security_group_rule2* performs a **create-replace**(what we don't want).
   ```bash
   pulumi up
   View Live: https://app.pulumi.com/shaht/aws-classic-py-securitygroup-vs-securitygrouprules/dev/previews/3b1b37fa-0de1-436c-b624-9e05a75d3463

      Type                          Name                                                    Plan        Info
      pulumi:pulumi:Stack           aws-classic-py-securitygroup-vs-securitygrouprules-dev              
   ~   ├─ aws:ec2:SecurityGroup      demo-securitygroup                                      update      [diff: ~egress]
   +-  └─ aws:ec2:SecurityGroupRule  demo-securitygrouprules2                                replace     [diff: ~fromPort,toPort]
   
   Outputs:
   ~ security_group_egress            : [
         ~ [0]: {
                  cidr_blocks     : [
                     [0]: "0.0.0.0/0"
                  ]
               ~ description     : "Allow outbound access via https" => "Allow outbound access via http"
               ~ from_port       : 443 => 80
                  protocol        : "tcp"
                  self            : false
               ~ to_port         : 443 => 80
               }
         ~ [1]: {
                  cidr_blocks     : [
                     [0]: "0.0.0.0/0"
                  ]
               ~ description     : "Allow outbound access via http" => "Allow outbound access via https"
               ~ from_port       : 81 => 443
                  protocol        : "tcp"
                  self            : false
               ~ to_port         : 81 => 443
               }
      ]
   ~ security_group_with_rules_ingress: "sgrule-1979274348" => output<string>

   Resources:
      ~ 1 to update
      +-1 to replace
      2 changes. 32 unchanged
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```