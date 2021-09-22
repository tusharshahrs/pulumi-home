import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";

const name = "demo";

const awsProvider = new aws.Provider(`${name}-provider`, {
    profile: aws.config.profile,
    region: aws.config.region,
})

const myvpc = new awsx.ec2.Vpc(`${name}-vpc`, {
  cidrBlock: "10.1.0.0/25",
  numberOfAvailabilityZones: 3,
  numberOfNatGateways: 1,
  enableDnsHostnames: true,
  enableDnsSupport: true,
  tags: { Name: `${name}-vpc` },
},{provider: awsProvider });

const mycluster = new eks.Cluster(`${name}-eks`, {
    vpcId: myvpc.id,
    publicSubnetIds: myvpc.publicSubnetIds,
    privateSubnetIds: myvpc.privateSubnetIds,
    instanceType: "t3a.small",
    version: "1.21",
    nodeRootVolumeSize: 10,
    encryptRootBockDevice: true,
    enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler"],
    providerCredentialOpts: {
        profileName: aws.config.profile
    }
}, {dependsOn: myvpc});



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