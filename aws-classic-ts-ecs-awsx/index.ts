import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import { Config, getStack, StackReference } from "@pulumi/pulumi";

// importing local configs
const config = new Config();

// reading in vpc StackReference Path from local config
const networkingStack = new StackReference(config.require("networkingStack"));
const vpc_id = networkingStack.getOutput("pulumi_vpc_id");
const vpc_name = networkingStack.getOutput("pulumi_vpc_name");
const vpc_public_subnet_ids = networkingStack.getOutput("pulumi_vpc_public_subnet_ids");
const vpc_private_subnet_ids = networkingStack.getOutput("pulumi_vpc_public_subnet_ids");

const name_prefix = "demo";

// Retrieving existing vpc, need it as a VPC resource
const myvpc = awsx.ec2.Vpc.fromExistingIds(`${name_prefix}-getvpc`, {
    vpcId:  vpc_id,     
});

export const vpc_existing = pulumi.secret(myvpc);
// Create an ECS cluster using awsx package
const mycluster = new awsx.ecs.Cluster(`${name_prefix}-ecs`, { vpc: myvpc });
export const cluster_name = mycluster.cluster.name;
export const cluster_id = pulumi.secret(mycluster.cluster.id);

// Create a securitygroup
const mysecuritygroup = new aws.ec2.SecurityGroup(`${name_prefix}-securitygroup`,{
    description: "Enable HTTP Access",
    vpcId: vpc_id,
    ingress: [{
        description: "TLS from VPC",
        fromPort: 443,
        toPort: 443,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
    },
    {
        description: "Enable HTTP access",
        fromPort: 80,
        toPort: 80,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
    },
    ],
    egress: [{
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
    }],
});

// Exporting security group information
export const securitygroup_name = mysecuritygroup.name;
export const securitygroup_id = mysecuritygroup.id;

// creating a load balancer via aws and NOT awsx package - this is to allow us to create targetgroups and listeners in another stack
const my_loadbalancer = new aws.alb.LoadBalancer(`${name_prefix}-alb`, {
    enableCrossZoneLoadBalancing: true,
    securityGroups: [mysecuritygroup.id],
    enableHttp2: true,
    dropInvalidHeaderFields: true,
    subnets: vpc_public_subnet_ids,
});

// Exporting load balancer information
export const load_balancer_name = my_loadbalancer.name;
export const load_balancer_arn = pulumi.secret(my_loadbalancer.arn);