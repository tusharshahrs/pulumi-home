import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as iam from "./iam";

// Create 3 IAM Roles and matching InstanceProfiles to use with the nodegroups.
const my_name = `demo`;
const roles = iam.createRoles(my_name, 1);
const instanceProfiles = iam.createInstanceProfiles(my_name, roles);

const myvpc = new awsx.ec2.Vpc(`${my_name}-vpc`, {
    numberOfAvailabilityZones: 3,
    numberOfNatGateways: 1,
    tags: { "Name": `${my_name}-vpc` },
});

const mycluster = new eks.Cluster(`${my_name}-eks`, {
    skipDefaultNodeGroup: true,
    vpcId: myvpc.id,
    publicSubnetIds: myvpc.publicSubnetIds,
    privateSubnetIds: myvpc.privateSubnetIds,
    instanceType: "t3a.small",
    version: "1.21",
    nodeRootVolumeSize: 10,
    instanceRole: roles[0],
    encryptRootBockDevice: true,
    enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler"],
}, {dependsOn: myvpc}
);

const managed_node_group_spot = new eks.ManagedNodeGroup(`${my_name}-manangednodegroup-spot`, {
    cluster: mycluster,
    capacityType: "SPOT",
    instanceTypes: ["t3a.medium"],
    nodeRole: roles[0],
    labels: {"managed":"true", "spot":"true"},
    tags: {
        "k8s.cluster-autoscaler/shaht-dev":"owned",
        "k8s.cluster-autoscaler/enabled":"True",
        "team":"rabbitdig",
        //"enviroment":"development"
        "environment":"development"
    },
    
    scalingConfig: {
                    desiredSize: 2, 
                    minSize: 1, 
                    maxSize:10
                   },
    diskSize: 10,
},{dependsOn: [myvpc]})

export const cluster_name = mycluster.eksCluster.name;
export const managed_nodegroup_capacitytype = managed_node_group_spot.nodeGroup.capacityType;
export const cluster_verion = mycluster.eksCluster.version;
export const kubeconfig = pulumi.secret(mycluster.core.kubeconfig);