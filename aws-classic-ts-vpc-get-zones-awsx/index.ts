import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

// importing local configs
const config = new pulumi.Config();
const vpc_cidr_blocks = "10.0.0.0/24"
const availability_zones = 3

const name = 'demo'

const myvpc = new awsx.ec2.Vpc(`${name}-vpc`, {
    cidrBlock: vpc_cidr_blocks,
    numberOfAvailabilityZones: availability_zones,
    natGateways: {
      strategy: "Single",
    },
    tags: {"Name":`${name}-vpc`}
  }); 

// Export a few resulting fields to make them easy to use:

export const vpc_id = myvpc.vpcId;
export const vpc_az_zones = availability_zones;
export const vpc_cidrs = vpc_cidr_blocks;
export const vpc_private_subnet_ids = myvpc.privateSubnetIds;
export const vpc_public_subnet_ids = myvpc.publicSubnetIds;

// No need for apply here
/*
export const public_subnet1_id = vpc_public_subnet_ids.apply(my_public_subnets=>my_public_subnets[0]);
export const public_subnet2_id = vpc_public_subnet_ids.apply(my_public_subnets=>my_public_subnets[1]);
export const public_subnet3_id = vpc_public_subnet_ids.apply(my_public_subnets=>my_public_subnets[2]);
export const private_subnet1_id = vpc_private_subnet_ids.apply(my_private_subnets=>my_private_subnets[0]);
export const private_subnet2_id = vpc_private_subnet_ids.apply(my_private_subnets=>my_private_subnets[1]);
export const private_subnet3_id = vpc_private_subnet_ids.apply(my_private_subnets=>my_private_subnets[2]);
*/

// Patern seems to be that 0,2,4 are public subnets and that 1,3,5 are private subnets.
export const vpc_subnets1_id = myvpc.subnets[0].id;
export const vpc_subnets1_az = myvpc.subnets[0].availabilityZone;
export const vpc_subnets1_tags = myvpc.subnets[0].tags;

export const vpc_subnets2_id = myvpc.subnets[2].id;
export const vpc_subnets2_az = myvpc.subnets[2].availabilityZone;
export const vpc_subnets2_tags = myvpc.subnets[2].tags;

export const vpc_subnets3_id = myvpc.subnets[4].id;
export const vpc_subnets3_az = myvpc.subnets[4].availabilityZone;
export const vpc_subnets3_tags = myvpc.subnets[4].tags;

export const vpc_subnets4_id = myvpc.subnets[1].id;
export const vpc_subnets4_az = myvpc.subnets[1].availabilityZone;
export const vpc_subnets4_tags = myvpc.subnets[1].tags;

export const vpc_subnets5_id = myvpc.subnets[3].id;
export const vpc_subnets5_az = myvpc.subnets[3].availabilityZone;
export const vpc_subnets5_tags = myvpc.subnets[3].tags;

export const vpc_subnets6_id = myvpc.subnets[5].id;
export const vpc_subnets6_az = myvpc.subnets[5].availabilityZone;
export const vpc_subnets6_tags = myvpc.subnets[5].tags;

// Outputs below are for old awsx package
/*  
export const public_subnet1_id = vpc_public_subnet_ids.then(subs=>subs[0]);
export const public_subnet2_id = vpc_public_subnet_ids.then(subs=>subs[1]);
export const public_subnet3_id = vpc_public_subnet_ids.then(subs=>subs[2]);

const vpc_public_subnets = myvpc.publicSubnets;
export const public_subnets_1_name = vpc_public_subnets.then(subs=>subs[0].subnetName);
export const public_subnets_1_az = vpc_public_subnets.then(subs=>subs[0].subnet.availabilityZone);

export const public_subnets_2_name = vpc_public_subnets.then(subs=>subs[1].subnetName);
export const public_subnets_2_az = vpc_public_subnets.then(subs=>subs[1].subnet.availabilityZone);

export const public_subnets_3_name = vpc_public_subnets.then(subs=>subs[2].subnetName);
export const public_subnets_3_az = vpc_public_subnets.then(subs=>subs[2].subnet.availabilityZone);
*/