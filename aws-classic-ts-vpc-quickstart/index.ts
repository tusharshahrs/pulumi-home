import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as quickstart_vpc from "@pulumi/aws-quickstart-vpc"

const name = "demo"

// Note, this creates 3 NAT gateways, this is what you want for prodution, however, for
// dev this can bexpensive.  You will have to use something else besides quickstart for dev
// or be willing to pay for 3 nat gateways in dev
const myVpc = new quickstart_vpc.Vpc(`${name}-vpc`, {
    cidrBlock: "10.0.0.0/23",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    createNatGateways: true,
    createFlowLogs: false,
    //flowLogsRetentionPeriodInDays: 1,
    availabilityZoneConfig: [{
        availabilityZone: "us-east-2a",
        privateSubnetACidr: "10.0.1.0/26",
        publicSubnetCidr: "10.0.0.0/25",

    },{
        availabilityZone: "us-east-2b",
        privateSubnetACidr: "10.0.1.64/26",
        publicSubnetCidr: "10.0.0.128/26"
    },
    {
        availabilityZone: "us-east-2c",
        privateSubnetACidr: "10.0.1.128/25",
        publicSubnetCidr: "10.0.0.192/26"
    },
]
})

export const vpcID = myVpc.vpcID;
export const publicSubnetIDs = myVpc.publicSubnetIDs;
export const privateSubnetIDs = myVpc.privateSubnetIDs;
export const natgatewayIPs = myVpc.natGatewayIPs;
