import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";

const name = "demo"
const myvpc = new awsx.ec2.Vpc(`${name}-vpc`, {
  cidrBlock: "10.0.0.0/24",
  numberOfAvailabilityZones: 3,
  natGateways: {
    strategy: "Single", // We are only doing this to save cost since this is dev. In qa and prod, you would NOT enable this since High Availability matters there.
  },
});

export const vpc_id = myvpc.vpcId;
export const vpc_natgateways = myvpc.natGateways[0].id;
export const vpc_public_subnetids = myvpc.publicSubnetIds;
export const vpc_private_subnetids = myvpc.privateSubnetIds;


// Securitygroup with no securitygrouprules
const security_group_no_sg_rules = new aws.ec2.SecurityGroup(`${name}-securitygroup`, {
    vpcId: myvpc.vpcId,
    egress: [{
        description: "Egress https securitygroup",
        protocol: "tcp",
        fromPort: 443,
        toPort: 443,
        cidrBlocks: ["0.0.0.0/0"],
    },
    {
        description: "Egress http securitygroup",
        protocol: "tcp",
        fromPort: 80,
        toPort: 81, // Change this one port to 81 after 1st pulumi up
        cidrBlocks: ["0.0.0.0/0"],
    }],
    ingress: [
        {
            description: "Ingress https self",
            protocol: "tcp",
            fromPort: 443,
            toPort: 443,
            self: true, // This allows us to call the securitygroup itself as a source
        },
        {
            description: "Ingress http self",
            protocol: "tcp",
            fromPort: 80,
            toPort: 80,
            self: true, // This allows us to call the securitygroup itself as a source
        },

    ],
    tags: { "Name": `${name}-securitygroup`, "awsx": "yes", "multilang": "yes", "environment": "dev", "testing": "yes" },
});

// Securitygroup with securitygrouprules
const securitygroupwithrules = new aws.ec2.SecurityGroup(`${name}-securitygroupwithrules`, {
    vpcId: myvpc.vpcId,
    tags: { "Name": `${name}-securitygroupwithrules`, "awsx": "yes", "multilang": "yes", "environment": "dev", "testing": "yes" },
});


// securitygrouprules egress https 443
const security_group_rule1 = new aws.ec2.SecurityGroupRule(`${name}-securitygrouprule1`, {
    type: "egress",
    toPort: 443,
    fromPort: 443,
    protocol: "tcp",
    securityGroupId: securitygroupwithrules.id,
    description: "SecurityGroupRule egress https",
    cidrBlocks: ["0.0.0.0/0"],
});

// securitygrouprules egress http 80
const security_group_rule2 = new aws.ec2.SecurityGroupRule(`${name}-securitygrouprule2`, {
    type: "egress",
    toPort: 81, // Change this one port to 442 after 1st pulumi up
    fromPort: 80, 
    protocol: "tcp",
    securityGroupId: securitygroupwithrules.id,
    description: "SecurityGroupRule egress http",
    cidrBlocks: ["0.0.0.0/0"],
});


// securitygrouprules ingress https 443
const security_group_rule3 = new aws.ec2.SecurityGroupRule(`${name}-securitygrouprule3`, {
    type: "ingress",
    toPort: 443,
    fromPort: 443,
    protocol: "tcp",
    securityGroupId: securitygroupwithrules.id,
    description: "SecurityGroupRule ingress https",
    cidrBlocks: ["0.0.0.0/0"],
});

// securitygrouprules ingress https 80
const security_group_rule4 = new aws.ec2.SecurityGroupRule(`${name}-securitygrouprule4`, {
    type: "ingress",
    toPort: 80,
    fromPort: 80,
    protocol: "tcp",
    securityGroupId: securitygroupwithrules.id,
    description: "SecurityGroupRule ingress http",
    cidrBlocks: ["0.0.0.0/0"],
});

export const security_group_no_sg_rules_name=security_group_no_sg_rules.id;
export const security_group_no_sg_rules_vpc=security_group_no_sg_rules.vpcId;
export const security_group_no_sg_rules_egress=security_group_no_sg_rules.egress;
export const security_group_no_sg_rules_ingress=security_group_no_sg_rules.ingress;

export const securitygroupwithrules_name=securitygroupwithrules.id;
export const securitygroupwithrules_vpc=securitygroupwithrules.vpcId;
export const securitygroupwithrules_egress=securitygroupwithrules.egress;
export const securitygroupwithrules_ingress=securitygroupwithrules.ingress;

export const securitygroupwithrules_sgrule1_egress=security_group_rule1.id;
export const securitygroupwithrules_sgrule2_egress=security_group_rule2.id;
export const securitygroupwithrules_sgrule3_egress=security_group_rule3.id;
export const securitygroupwithrules_sgrule4_ingress=security_group_rule4.id;
