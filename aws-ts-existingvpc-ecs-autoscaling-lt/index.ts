import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// importing local configs
const config = new pulumi.Config();
const vpc_existing_name = config.require("vpc_already_created_name");

const name_prefix = "demo";

// Retrieving existing vpc
const myvpc = awsx.ec2.Vpc.fromExistingIds(`${name_prefix}-getvpc`, {
    vpcId:  vpc_existing_name,     
});

// Retrieving all subnets associated with vpc
export const mysubnetids = aws.ec2.getSubnetIds({ 
    vpcId: vpc_existing_name,
}, {async: true}).then(subnets =>subnets.ids);

const minsize = 3;
const maxsize = 10;

export const subnet0 = mysubnetids.then(sub1 => sub1[0]);
export const subnet1 = mysubnetids.then(sub1 => sub1[1]);
export const subnet2 = mysubnetids.then(sub1 => sub1[2]);
export const subnet3 = mysubnetids.then(sub1 => sub1[3]);
export const subnet4 = mysubnetids.then(sub1 => sub1[4]);
export const subnet5 = mysubnetids.then(sub1 => sub1[5]);

// Create alb
const myloadbalancer = new awsx.lb.ApplicationLoadBalancer(`${name_prefix}-alb`, {
    vpc: myvpc,
    subnets: [subnet0, subnet1],
});

const mytargetgroup = myloadbalancer.createTargetGroup(`${name_prefix}-targetgroup`, { port: 80, targetType: "instance" });


// Create ecs cluster
const mycluster = new awsx.ecs.Cluster(`${name_prefix}-ecs`, { 
    vpc: myvpc,    
});

const autoscalinggroup =mycluster.createAutoScalingGroup(`${name_prefix}-autoscalinggroup`,
            {
                vpc: myvpc,
                subnetIds: myloadbalancer.loadBalancer.subnets, //selected the same subnets for the autoscaling as the load balancer
                targetGroups: [mytargetgroup],
                launchConfigurationArgs: { instanceType: "t3a.small"},
                templateParameters: {
                    
                    minSize: minsize,
                    maxSize: maxsize,
                    healthCheckGracePeriod: 100,
                    healthCheckType: 'ELB',
                },
            },
        );

export const vpc_name = myvpc.vpc.id;
export const cluster_name = mycluster.cluster.name;
export const loadbalancer_id = myloadbalancer.loadBalancer.id;
export const launchconfiguration_name = autoscalinggroup.launchConfiguration.launchConfiguration.name;
export const autoscaling_group_ame = autoscalinggroup.group.name;