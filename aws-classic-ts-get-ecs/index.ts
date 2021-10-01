import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Config, getStack, StackReference } from "@pulumi/pulumi";

// importing local configs
const config = new Config();

// reading in vpc StackReference Path from local config
const networkingStack = new StackReference(config.require("networkingStack"));
export const vpc_id = networkingStack.getOutput("pulumi_vpc_id");
export const vpc_name = networkingStack.getOutput("pulumi_vpc_name");
const vpc_public_subnet_ids = networkingStack.getOutput("pulumi_vpc_public_subnet_ids");
const vpc_private_subnet_ids = networkingStack.getOutput("pulumi_vpc_public_subnet_ids");

const name_prefix = "demo-ecs-vpc";

const myecsStack = new StackReference(config.require("ecsStack"));
const mycluster_name = myecsStack.getOutput("cluster_name");

const myloadbalancer_arn = myecsStack.getOutput("load_balancer_arn");
const mysecuritygroup_id = myecsStack.getOutput("securitygroup_id");

// Retrieving existing vpc for mytaskdefinition
const myvpc = awsx.ec2.Vpc.fromExistingIds(`${name_prefix}-getvpc`, {
    vpcId:  vpc_id,     
});

const mytargetgroup = new aws.alb.TargetGroup(`${name_prefix}-targetgroup`, {
    port: 80,
    protocol: "HTTP",
    vpcId: myvpc.id,
});

export const targetgroup_name = mytargetgroup.name;

const mytargetlistener = new aws.alb.Listener(`${name_prefix}-targetlistener`, {
    port: 80,
    protocol: "HTTP",
    
    loadBalancerArn: myloadbalancer_arn,
    defaultActions: [{
        type: "forward",
        targetGroupArn: mytargetgroup.arn,
    }],
});

export const target_listener_arn = mytargetlistener.arn;

const mytaskdefinition = new awsx.ecs.FargateTaskDefinition(`${name_prefix}-taskdefinition`, {
    vpc: myvpc,
    container: {
        image: "hello-world",
        memory: 20,
        portMappings: [{
            'containerPort': 80,
            'hostPort': 80,
            'protocol': 'tcp'
        }],
    },
});
export const taskdefinition_id = mytaskdefinition.taskDefinition.id;
export const taskdefinition_role = mytaskdefinition.taskRole?.name

const myexistingcluster = new awsx.ecs.Cluster(`${name_prefix}-ecs1`, {
    cluster: aws.ecs.Cluster.get("clusterName", mycluster_name),
});

const fargateService = new awsx.ecs.FargateService(`${name_prefix}-service`, {
    cluster: myexistingcluster,
    desiredCount: 2,
    taskDefinition: mytaskdefinition,
    assignPublicIp: true,
    securityGroups: [mysecuritygroup_id],
    subnets: vpc_public_subnet_ids,
    });
