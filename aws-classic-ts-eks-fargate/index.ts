import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";

const name = "fargatetest";
const color = "blue";
const clusterKeyName = `eks-cluster-key-${color}`;
const clusterKeyAlias = `eks-cluster-key-alias-${color}`;
const logGroupResource = `cluster-log-group-${color}`;
const logGroupName = `eks-cluster-mgmt-logs-${color}`;
const clusterPolicy = ``;
const clusterPolicyAttachment = `eks-cluster-policy-attachment-${color}`;

// create a key for the cluster
const key = new aws.kms.Key(`${name}-clusterKeyName`, {
    description: `EKS Cluster Key - ${name}`,
    enableKeyRotation: false,
    deletionWindowInDays: 7,
});

export const key_name = key.keyId;


// create a cloudwatch log group
const clusterLogGroup = new aws.cloudwatch.LogGroup(`${name}-logGroupResource`, {
    retentionInDays: 1,
    tags: { "Name": `${name}-logGroupResource`},
    
});

export const clusterLogGroup_Name = clusterLogGroup.name;

// create a vpc with 3 public and 3 private subnets
const vpc = new awsx.ec2.Vpc(`${name}-vpc`, {
    cidrBlock: "10.0.0.0/24",
    numberOfAvailabilityZones: 3,
    natGateways: { strategy: "Single"}, // Only using a single nat gateway to save costs
    tags: { "Name": `${name}-vpc` },
});

export const vpc_id = vpc.vpcId;
export const public_subnet_ids = vpc.publicSubnetIds;
export const private_subnet_ids = vpc.privateSubnetIds;

const cluster = new eks.Cluster(name, {
    version: "1.28",
    createOidcProvider: true,
    fargate: true,
    //providerCredentialOpts: {
    //    profileName: process.env.AWS_PROFILE,
    //},
    vpcId: vpc.vpcId,
    privateSubnetIds: vpc.privateSubnetIds,
    publicSubnetIds: vpc.publicSubnetIds,
    nodeAssociatePublicIpAddress: true,
    endpointPublicAccess: true, // set to 'false' for better security posture, BUT won't be able to run k8s commands after doing so
    endpointPrivateAccess: true,    // set to 'true' to avoid billing costs for internal network traffic (and better security posture)
    encryptionConfigKeyArn: key.arn,
    desiredCapacity: 0,
    enabledClusterLogTypes: [
        'api',
        'audit',
        'authenticator',
    ],
}, {
    dependsOn: [clusterLogGroup]
});

export const cluster_name = cluster.eksCluster.name;