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
export const oregon_provider_region = accepter_oregon.region;

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
export const peerOwnerAccountId = pulumi.secret(peerCallerIdentity.then(myidentity =>myidentity.accountId))


// Requester's side of the connection.
const peerVpcPeeringConnection = new aws.ec2.VpcPeeringConnection(`${name}-peerVpcPeeringConnection`, {
    vpcId: mainvpc.id,
    peerVpcId: peervpc.id,
    peerOwnerId: peerOwnerAccountId,
    peerRegion: pulumi.interpolate`${accepter_oregon.region}`,
    //autoAccept: true,
    autoAccept: false,
    tags: {
        Side: "Requester",
    },
}, {
    provider: requester_ohio,
});

export const peerVpcPeeringConnection_acceptstatus = peerVpcPeeringConnection.acceptStatus;
export const peerVpcPeeringConnection_id = peerVpcPeeringConnection.id;


// Accepter's side of the connection.
const peerVpcPeeringConnectionAccepter = new aws.ec2.VpcPeeringConnectionAccepter(`${name}-peerVpcPeeringConnectionAccepter`, {
    vpcPeeringConnectionId: peerVpcPeeringConnection.id,
    autoAccept: true,
    //autoAccept: false,
    tags: {
        Side: "Accepter",
    },
}, 
    {
     provider: accepter_oregon, dependsOn: [mainvpc, peervpc]
});

export const peerVpcPeeringConnectionAccepter_status = peerVpcPeeringConnectionAccepter.acceptStatus

/*
const requesterPeeringConnectionOptions = new aws.ec2.PeeringConnectionOptions(`${name}-requesterPeeringConnectionOptions`, {
    vpcPeeringConnectionId: peerVpcPeeringConnectionAccepter.id,
    requester: {
        allowRemoteVpcDnsResolution: true,
    },
}, {
    provider: requester_ohio,
});

export const requesterPeeringConnectionOptions_info = requesterPeeringConnectionOptions.id;

const accepterPeeringConnectionOptions = new aws.ec2.PeeringConnectionOptions(`${name}accepterPeeringConnectionOptions`, {
    vpcPeeringConnectionId: peerVpcPeeringConnectionAccepter.id,
    accepter: {
        allowRemoteVpcDnsResolution: true,
    },
}, {
    provider: accepter_oregon,
});

export const accepterPeeringConnectionOptions_info = accepterPeeringConnectionOptions.id;
*/