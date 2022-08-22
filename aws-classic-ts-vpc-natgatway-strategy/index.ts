import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

const name = "demo"
const myvpc = new awsx.ec2.Vpc(`${name}-vpc`, {
  cidrBlock: "10.0.0.0/24",
  numberOfAvailabilityZones: 3,
  natGateways: {
    strategy: "Single",
  },
});

export const vpc_id = myvpc.vpcId;
export const vpc_natgateways = myvpc.natGateways[0].id;
export const vpc_public_subnetids = myvpc.publicSubnetIds;
export const vpc_private_subnetids = myvpc.privateSubnetIds;