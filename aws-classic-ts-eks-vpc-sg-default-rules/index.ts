import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";

// importing local configs
const config = new pulumi.Config();
const vpc_cidrs = config.get("vpc_cidr") || "10.0.0.0/24"
const availability_zones = config.getNumber("number_of_availability_zones") || 3
const nat_gateways = config.getNumber("number_of_nat_gateways")|| 1

const myname = 'demo'

// creating a vpc
const myvpc = new awsx.ec2.Vpc(`${myname}-vpc`, {
    cidrBlock: vpc_cidrs,
    numberOfAvailabilityZones: availability_zones,
    numberOfNatGateways: nat_gateways,
  });

// export vpc outputs
export const vpc_id = myvpc.id;
export const vpc_az_zones = availability_zones;
export const vpc_cidr = vpc_cidrs;
export const vpc_number_of_nat_gateways = nat_gateways;
export const vpc_private_subnet_ids = myvpc.privateSubnetIds;
export const vpc_public_subnet_ids = myvpc.publicSubnetIds;

// create a vpc, don't pass in security group.  Default ones will be created.
const mycluster = new eks.Cluster(`${myname}-eks`, {
    instanceType: "t3a.micro",
    version: "1.21",
    nodeRootVolumeSize: 10,
    encryptRootBlockDevice: true,
    vpcId: myvpc.id,
    publicSubnetIds: myvpc.publicSubnetIds,
    privateSubnetIds: myvpc.privateSubnetIds,
    enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler"],
});

// Export the eks cluster and the default security group that was created.
export const cluster_name = mycluster.eksCluster.id;
export const cluster_security_group_name = mycluster.clusterSecurityGroup.name;
export const cluster_security_group_ingress = mycluster.clusterSecurityGroup.ingress;
export const cluster_security_group_egress = mycluster.clusterSecurityGroup.egress;