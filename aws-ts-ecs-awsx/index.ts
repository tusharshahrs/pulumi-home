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
export const myvpc = awsx.ec2.Vpc.fromExistingIds(`${name_prefix}-getvpc`, {
    vpcId:  vpc_id,     
});

const mylb = new awsx.lb.NetworkLoadBalancer(`${name_prefix}-nlb1`, { external: true, enableCrossZoneLoadBalancing: true, vpc:myvpc , subnets: vpc_public_subnet_ids });
export const load_balancer_name = mylb.loadBalancer.name;
export const load_balancer_arn = mylb.loadBalancer.arn;


const mytargetgroup = mylb.createTargetGroup(`${name_prefix}-targetgroup`, { port: 80 });
export const target_group_name = mytargetgroup.targetGroup.name;

const mytargetlistener = mylb.createListener(`${name_prefix}-targetlistener`, { port: 80, targetGroup: mytargetgroup });
export const target_listener_id = mytargetlistener.listener.id;

const mycluster = new awsx.ecs.Cluster(`${name_prefix}-ecs`, { vpc: myvpc });
export const cluster_name = mycluster.cluster.name

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

export const securitygroup_name = mysecuritygroup.name;
export const securitygroup_id = mysecuritygroup.id;

const mytaskdefinition = new awsx.ecs.FargateTaskDefinition(`${name_prefix}-taskdefinition`, {
    vpc: myvpc,
    container: {
        image: "hello-world",
        memory: 20,
        portMappings: [mytargetlistener],
        //networkListener: {port: 80, loadBalancer: mylb},
    },
});

export const taskdefinition_id = mytaskdefinition.taskDefinition.id;

const fargateService = new awsx.ecs.FargateService(`${name_prefix}-service`, {
    cluster: mycluster,
    desiredCount: 2,
    taskDefinition: mytaskdefinition,
    assignPublicIp: true,
    securityGroups: [mysecuritygroup.id],
    subnets: vpc_public_subnet_ids,
    });

const fargateservice_name =  fargateService.service.name;