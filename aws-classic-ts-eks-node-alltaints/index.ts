import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as iam from "./iam";
import * as k8s from "@pulumi/kubernetes";

// Create 3 IAM Roles and matching InstanceProfiles to use with the nodegroups.
const my_name = `demo`;
const roles = iam.createRoles(my_name, 1);
const instanceProfiles = iam.createInstanceProfiles(my_name, roles);

const myvpc = new awsx.ec2.Vpc(`${my_name}-vpc`, {
    numberOfAvailabilityZones: 3,
    numberOfNatGateways: 1,
    tags: { "Name": `${my_name}-vpc` },
});

const mycluster = new eks.Cluster(`${my_name}-eks-tainted`, {
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

const node_group_fixed = new eks.NodeGroup(`${my_name}-nodegroup-fixed-taint`, {
    cluster: mycluster,
    instanceType: "t3a.medium",
    encryptRootBlockDevice: true,
    nodeRootVolumeSize: 10,
    instanceProfile: instanceProfiles[0],
    minSize: 2,
    maxSize: 8,
    desiredCapacity: 3,
    labels: {
          "ng": "ng1","spot":"false", "qa":"true","engineering":"false"
        },
    taints: {
            "default": {
                value: "ng1",effect: "NoSchedule"
            }
    },

    },{dependsOn: [myvpc]})


const node_group_spot = new eks.NodeGroup(`${my_name}-nodegroup-spot-taint`, {
    cluster: mycluster,
    instanceType: "t3a.xlarge",
    encryptRootBlockDevice: true,
    nodeRootVolumeSize: 20,
    instanceProfile: instanceProfiles[0],
    spotPrice: "0.10",
    minSize: 2,
    maxSize: 8,
    desiredCapacity: 3,
    labels: {
          "ng": "ng2","spot":"true", "qa":"false","engineering":"true"
        },

    taints: {
        "default": {
            value: "ng2",effect: "NoSchedule"
        }
    },
    
    },{dependsOn: [myvpc]})

export const cluster_name = mycluster.eksCluster.name;
export const cluster_verion = mycluster.eksCluster.version;
export const kubeconfig = pulumi.secret(mycluster.core.kubeconfig);