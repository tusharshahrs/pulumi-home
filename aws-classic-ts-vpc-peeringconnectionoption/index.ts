import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const name = "demo"
const firstVpc = new aws.ec2.Vpc(`${name}-firstVpc`, {cidrBlock: "10.0.0.0/16", enableDnsHostnames: true,},);
export const firstvpc_name = firstVpc.id;

const secondVpc = new aws.ec2.Vpc(`${name}-secondVpc`, {cidrBlock: "10.1.0.0/16",enableDnsHostnames: true,});
export const secondvpc_name = secondVpc.id;

const myvpcPeeringConnection = new aws.ec2.VpcPeeringConnection(`${name}-VpcPeeringConnection`, {
    vpcId: firstVpc.id,
    peerVpcId: secondVpc.id,
    autoAccept: true,
});

export const vpcpeeringconnection_id = myvpcPeeringConnection.id;
export const vpcpeeringconnection_acceptstatus = myvpcPeeringConnection.acceptStatus;

const myvpcPeeringConnectionOptions = new aws.ec2.PeeringConnectionOptions(`${name}-fooPeeringConnectionOptions`, {
    vpcPeeringConnectionId: myvpcPeeringConnection.id,
    accepter: {
        allowRemoteVpcDnsResolution: true,
    },
    requester: {
        allowRemoteVpcDnsResolution: true,
    },
});

export const myvpcPeeringConnectionOptions_id = myvpcPeeringConnectionOptions.id;
export const myvpcPeeringConnectionOptions_accepter = myvpcPeeringConnectionOptions.accepter;
export const myvpcPeeringConnectionOptions_requester = myvpcPeeringConnectionOptions.requester;