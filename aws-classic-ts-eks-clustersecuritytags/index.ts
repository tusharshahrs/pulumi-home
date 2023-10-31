import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";


const name = "shaht";

// Create a VPC with 3 public and 3 private subnets with the CIDR block 10.0.0.0/22.
const vpc = new awsx.ec2.Vpc(`${name}-vpc`, {
    cidrBlock: "10.0.0.0/22",
    numberOfAvailabilityZones: 3,
    natGateways: { strategy: "Single"},
    tags: { "Name": `${name}-vpc` },
});

export const vpc_id = vpc.vpcId;
export const public_subnet_ids = vpc.publicSubnetIds;
export const private_subnet_ids = vpc.privateSubnetIds;

// Create an EKS cluster with a managed node group.
const cluster = new eks.Cluster(`${name}-eks`, {
    vpcId: vpc.vpcId,
    publicSubnetIds: vpc.publicSubnetIds,
    privateSubnetIds: vpc.privateSubnetIds,
    skipDefaultNodeGroup: true,
    instanceType: "t3a.small",
    desiredCapacity: 3,
    //maxSize: 5,
    version: "1.25",
    encryptRootBlockDevice: true,
    nodeRootVolumeSize: 10,
    enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler", ],
    tags: { "Name": `${name}-eks` },
    //clusterSecurityGroupTags: { 'ts/carpark.blue': 'true' },  // original tag that works, use when cluster comes up 1st time.  Then comment out
    clusterSecurityGroupTags: { 'ts/carpark.green': 'true' },  // new tag that does NOT work with pulumi cli 3.91.  Uncomment out after cluster comes up 1st time. OR the line below
    //clusterSecurityGroupTags: { "ts/carpark.green": "true" },  // new tag that does NOT work with pulumi cli 3.91.  Uncomment out after cluster comes up 1st time. OR the line below
 
});

export const kubeconfig = pulumi.secret(cluster.kubeconfig);
export const cluster_name = cluster.core.cluster.name;
export const cluster_arn = cluster.core.cluster.arn;