# AWS Vpc via EC2 in TypeScript

[AWS](https://www.pulumi.com/registry/packages/aws/) vpc, subnet, igw, nat gateway, routes, route tables, route table association, public and private subnets.

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
        View Live: https://app.pulumi.com/shaht/aws-classic-ts-securitygroup-vs-securitygrouprules/dev/updates/34

PENDING
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (16):
    OUTPUT                                  VALUE
    security_group_no_sg_rules_egress       [{"cidrBlocks":["0.0.0.0/0"],"description":"Egress https securitygroup","fromPort":443,"ipv6CidrBlocks":[],"prefixListIds":[],"protocol":"tcp","securityGroups":[],"self":false,"toPort":443},{"cidrBlocks":["0.0.0.0/0"],"description":"Egress http securitygroup","fromPort":80,"ipv6CidrBlocks":[],"prefixListIds":[],"protocol":"tcp","securityGroups":[],"self":false,"toPort":80}]
    security_group_no_sg_rules_ingress      [{"cidrBlocks":[],"description":"Ingress http self","fromPort":80,"ipv6CidrBlocks":[],"prefixListIds":[],"protocol":"tcp","securityGroups":[],"self":true,"toPort":80},{"cidrBlocks":[],"description":"Ingress https self","fromPort":443,"ipv6CidrBlocks":[],"prefixListIds":[],"protocol":"tcp","securityGroups":[],"self":true,"toPort":443}]
    security_group_no_sg_rules_name         sg-01c6e8b17d108fe4f
    security_group_no_sg_rules_vpc          vpc-0db7bd2c90038ff47
    securitygroupwithrules_egress           []
    securitygroupwithrules_ingress          []
    securitygroupwithrules_name             sg-0e6dafbecf21bc0e3
    securitygroupwithrules_sgrule1_egress   sgrule-537624476
    securitygroupwithrules_sgrule2_egress   sgrule-3107646133
    securitygroupwithrules_sgrule3_egress   sgrule-2073818948
    securitygroupwithrules_sgrule4_ingress  sgrule-967859901
    securitygroupwithrules_vpc              vpc-0db7bd2c90038ff47
    vpc_id                                  vpc-0db7bd2c90038ff47
    vpc_natgateways                         nat-0161258b0516b0b5e
    vpc_private_subnetids                   ["subnet-0af1cbfc55d97cae4","subnet-095b72c632b412195","subnet-0156952cc7cecbd80"]
    vpc_public_subnetids                    ["subnet-012265c5b8a70e322","subnet-0d4f3caa1028f9787","subnet-0874552a48f42dd16"]
   ```

1. Update the **egress port** `80` to `81` in the `to_port` in the *security_group_no_sg_rules* and in the *security_group_rule2* in `index.ts`.

1. Run *pulumi up*.  Click on `details` and notice that `preview` will show only ports are updated(what we want) in the *security_group_no_sg_rules* while *security_group_rule2* performs a **create-replace**(what we don't want).
   ```bash
   pulumi up
   View Live: https://app.pulumi.com/myuser/aws-classic-ts-securitygroup-vs-securitygrouprules/dev/updates/36

        Type                          Name                                                    Status       Info
        pulumi:pulumi:Stack           aws-classic-ts-securitygroup-vs-securitygrouprules-dev               
    ~   ├─ aws:ec2:SecurityGroup      demo-securitygroup                                      updated      [diff: ~egress]
    +-  └─ aws:ec2:SecurityGroupRule  demo-securitygrouprule2                                 replaced     [diff: ~toPort]
    
    Outputs:
    ~ security_group_no_sg_rules_egress     : [
            [0]: {
                    cidrBlocks    : [
                        [0]: "0.0.0.0/0"
                    ]
                    description   : "Egress https securitygroup"
                    fromPort      : 443
                    protocol      : "tcp"
                    self          : false
                    toPort        : 443
                }
        ~ [1]: {
                    cidrBlocks    : [
                        [0]: "0.0.0.0/0"
                    ]
                    description   : "Egress http securitygroup"
                    fromPort      : 80
                    protocol      : "tcp"
                    self          : false
                ~ toPort        : 80 => 81
                }
        ]
        security_group_no_sg_rules_ingress    : [
            [0]: {
                description   : "Ingress http self"
                fromPort      : 80
                protocol      : "tcp"
                self          : true
                toPort        : 80
            }
            [1]: {
                description   : "Ingress https self"
                fromPort      : 443
                protocol      : "tcp"
                self          : true
                toPort        : 443
            }
        ]
        security_group_no_sg_rules_name       : "sg-01c6e8b17d108fe4f"
        security_group_no_sg_rules_vpc        : "vpc-0db7bd2c90038ff47"
        securitygroupwithrules_name           : "sg-0e6dafbecf21bc0e3"
        securitygroupwithrules_sgrule1_egress : "sgrule-537624476"
    ~ securitygroupwithrules_sgrule2_egress : "sgrule-3107646133" => "sgrule-575209569"
        securitygroupwithrules_sgrule3_egress : "sgrule-2073818948"
        securitygroupwithrules_sgrule4_ingress: "sgrule-967859901"
        securitygroupwithrules_vpc            : "vpc-0db7bd2c90038ff47"
        vpc_id                                : "vpc-0db7bd2c90038ff47"
        vpc_natgateways                       : "nat-0161258b0516b0b5e"
        vpc_private_subnetids                 : [
            [0]: "subnet-0af1cbfc55d97cae4"
            [1]: "subnet-095b72c632b412195"
            [2]: "subnet-0156952cc7cecbd80"
        ]
        vpc_public_subnetids                  : [
            [0]: "subnet-012265c5b8a70e322"
            [1]: "subnet-0d4f3caa1028f9787"
            [2]: "subnet-0874552a48f42dd16"
        ]

    Resources:
        ~ 1 updated
        +-1 replaced
        2 changes. 34 unchanged

    Duration: 6s
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```