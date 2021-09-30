import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";

const name = "demo";
const chainName = pulumi.getStack()
const myvpc = new awsx.ec2.Vpc(chainName + "-vpc", {tags: { Name: `${chainName}-vpc` }});
const desiredClusterCapacity = 4

const mycluster = new eks.Cluster(`${name}-eks`, {
    vpcId: myvpc.id,
    subnetIds: myvpc.publicSubnetIds,
    instanceType: "t3a.small",
    version: "1.21",
    nodeRootVolumeSize: 10,
    minSize: 3,
    desiredCapacity: desiredClusterCapacity,
    maxSize: 6,
    encryptRootBockDevice: true,
    providerCredentialOpts: {
        profileName: aws.config.profile
    }
})

export const vpc_id = myvpc.id;
export const vpc_publicSubnetIds = myvpc.publicSubnetIds;
export const vpc_privateSubnetIds = myvpc.privateSubnetIds;
export const vpc_enableDnsHostnames = myvpc.vpc.enableDnsHostnames;
export const vpc_enableDnsSupport = myvpc.vpc.enableDnsSupport;
export const cluster_name = mycluster.eksCluster.name
export const cluster_id = mycluster.eksCluster.id;
export const cluster_version = mycluster.eksCluster.version;
export const cluster_status = mycluster.eksCluster.status;
export const kubeconfig = pulumi.secret(mycluster.kubeconfig);