import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const name = "demo"
const requester_ohio = new aws.Provider(`${name}-awsohioprovider`, {
    region: 'us-east-2',
  });

const accepter_oregon = new aws.Provider(`${name}-awsoregonoprovider`, {
    region: 'us-west-2',
  });

export const ohio_provider_region = requester_ohio.region;
export const oregon_provider_region = requester_ohio.region;

const mainvpc = new aws.ec2.Vpc(`${name}-mainVpc`, 
    {
        cidrBlock: "10.0.0.0/16", 
        enableDnsHostnames: true,
        enableDnsSupport: true,
        tags: {"Name": `${name}-mainVpc`},
    },{provider: requester_ohio}
);

export const mainvpc_name = mainvpc.id;

const peervpc = new aws.ec2.Vpc(`${name}-peerVpc`, 
    {
        cidrBlock: "10.1.0.0/16", 
        enableDnsHostnames: true,
        enableDnsSupport: true,
        tags: {"Name": `${name}-peerVpc`},
    },{provider: accepter_oregon}
);

export const peervpc_name = peervpc.id;

const peerCallerIdentity = aws.getCallerIdentity({});

// Requester's side of the connection.
const peerVpcPeeringConnection = new aws.ec2.VpcPeeringConnection(`${name}-peerVpcPeeringConnection`, {
    vpcId: mainvpc.id,
    peerVpcId: peervpc.id,
    peerOwnerId: peerCallerIdentity.then(peerCallerIdentity => peerCallerIdentity.accountId),
    autoAccept: false,
    tags: {
        Side: "Requester",
    },
}, {
    provider: requester_ohio,
});


// Accepter's side of the connection.
const peerVpcPeeringConnectionAccepter = new aws.ec2.VpcPeeringConnectionAccepter(`${name}-peerVpcPeeringConnectionAccepter`, {
    vpcPeeringConnectionId: peerVpcPeeringConnection.id,
    autoAccept: true,
    tags: {
        Side: "Accepter",
    },
}, {
    provider: accepter_oregon,
});

const requesterPeeringConnectionOptions = new aws.ec2.PeeringConnectionOptions(`${name}-requesterPeeringConnectionOptions`, {
    vpcPeeringConnectionId: peerVpcPeeringConnectionAccepter.id,
    requester: {
        allowRemoteVpcDnsResolution: true,
    },
}, {
    provider: requester_ohio,
});

const accepterPeeringConnectionOptions = new aws.ec2.PeeringConnectionOptions(`${name}accepterPeeringConnectionOptions`, {
    vpcPeeringConnectionId: peerVpcPeeringConnectionAccepter.id,
    accepter: {
        allowRemoteVpcDnsResolution: true,
    },
}, {
    provider: accepter_oregon,
});