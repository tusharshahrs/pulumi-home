import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import { AutoScalingGroup } from "@pulumi/awsx/autoscaling";

// importing local configs
const config = new pulumi.Config();
const env = pulumi.getStack()
const name_prefix = config.require("name_prefix");
const zone_number = config.requireNumber("zone_number");
const vpc_cidr = config.require("vpc_cidr");
const number_of_nat_gateways = config.requireNumber("number_of_nat_gateways");

const baseTags = {
    "Name": `${name_prefix}`,
    "availability_zones_used": `${zone_number}`,
    "cidr_block": `${vpc_cidr}`,
    "crosswalk": "yes",
    "number_of_nat_gateways": `${number_of_nat_gateways}`,
    "demo": "true",
    "pulumi:Project": pulumi.getProject(),
    "pulumi:Stack": pulumi.getStack(),
    "cost_center": "1234",
  }

const myvpc = new awsx.ec2.Vpc(`${name_prefix}-vpc`, {
    cidrBlock: vpc_cidr,
    numberOfAvailabilityZones: zone_number,
    numberOfNatGateways: number_of_nat_gateways,
    tags: baseTags,
  });

const mycluster = new awsx.ecs.Cluster(`${name_prefix}-ecs`, 
    { vpc: myvpc,
    });

const myloadbalancer = new awsx.lb.ApplicationLoadBalancer(`${name_prefix}-alb`, {
    vpc: myvpc,
    subnets: myvpc.publicSubnetIds,
});

const mytargetgroup = myloadbalancer.createTargetGroup(`${name_prefix}-targetgroup`, { port: 80, targetType: "instance" });


const minsize = 3;
const maxsize = 10;

const autoScalingGroup =mycluster.createAutoScalingGroup(`${name_prefix}-autoscalinggroup`,
            {
                vpc: myvpc,
                subnetIds: myvpc.publicSubnetIds,
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
export const launchConfiguration_name = autoScalingGroup.launchConfiguration.launchConfiguration.name;
export const autoscaling_group_ame = autoScalingGroup.group.name;
export const loadbalancer_name = myloadbalancer.loadBalancer.name;
export const loadbalancer_subnets = myloadbalancer.loadBalancer.subnets;