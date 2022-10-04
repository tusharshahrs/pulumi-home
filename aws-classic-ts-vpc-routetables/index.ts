import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import * as av from "@pulumi/aws"

const name = "shaht"
const myvpc = new aws.ec2.Vpc(`${name}-vpc`,
{
    cidrBlock: "10.0.0.0/23",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: { Name:`${name}-vpc`}
})

export const vpc_id = myvpc.id;
export const vpc_tags = myvpc.tags;


const myinternetgateway = new aws.ec2.InternetGateway(`${name}-igw`, {
    vpcId: myvpc.id,
    tags: {
        Name: `${name}-igw`,
    },
}, {parent: myvpc});

export const igw_id = myinternetgateway.id;
export const igw_tags = myinternetgateway.tags;
//export const igw_vpc = myinternetgateway.vpcId;


const public_route_table = new aws.ec2.RouteTable(`${name}-publicroutetable`,{
    vpcId: myvpc.id,
    routes: [{
        cidrBlock: "0.0.0.0/0",
        gatewayId: myinternetgateway.id,
    }],
    tags: {Name: `${name}-publicroutetable`},
}, {parent: myvpc});

export const  public_route_table_id = public_route_table.id;
//export const  public_route_table_vpcid = public_route_table.vpcId;
export const  public_route_table_vpc_tags = public_route_table.tags;

/*
export const availzones = aws.getAvailabilityZones({
    state: "available"
}).then(name_of_az=>name_of_az.names[0]);
*/

const availzones = aws.getAvailabilityZones({
    state: "available"
});

export const zones = availzones.then(name_of_az=>name_of_az.names);

export const zone1 = zones.then(name_of_az=>name_of_az[0]);
export const zone2 = zones.then(name_of_az=>name_of_az[1]);
export const zone3 = zones.then(name_of_az=>name_of_az[2]);


const number_of_nat_gateways = 1;
const current_number_of_nat_gateways = 0;

const public_subnet_ids = [];
const private_subnet_ids = [];

const public_subnet1 = new aws.ec2.Subnet(
    `${name}-public-subnet1`,
    {
        vpcId: myvpc.id,
        cidrBlock: "10.0.0.0/25",
        availabilityZone: zone1,
        tags: {
            Name: `${name}-public-subnet1`,
            'kubernetes.io/role/elb': '1',
        },
        mapPublicIpOnLaunch: false,
    },
    { parent: myvpc }
);

const public_subnet2 = new aws.ec2.Subnet(
    `${name}-public-subnet2`,
    {
        vpcId: myvpc.id,
        cidrBlock: "10.0.0.128/26",
        availabilityZone: zone2,
        tags: {
            Name: `${name}-public-subnet2`,
            'kubernetes.io/role/elb': '1',
        },
        mapPublicIpOnLaunch: false,
    },
    { parent: myvpc }
);

const public_subnet3 = new aws.ec2.Subnet(
    `${name}-public-subnet3`,
    {
        vpcId: myvpc.id,
        cidrBlock: "10.0.0.192/26",
        availabilityZone: zone3,
        tags: {
            Name: `${name}-public-subnet3`,
            'kubernetes.io/role/elb': '1',
        },
        mapPublicIpOnLaunch: false,
    },
    { parent: myvpc }
);

const route_table_id_association_public_1 = new aws.ec2.RouteTableAssociation(`${name}-public-rt-association-1`,{
    subnetId: public_subnet1.id,
    routeTableId: public_route_table.id,
},{parent:public_subnet1, dependsOn: public_subnet1});

const route_table_id_association_public_2 = new aws.ec2.RouteTableAssociation(`${name}-public-rt-association-2`,{
    subnetId: public_subnet2.id,
    routeTableId: public_route_table.id,
},{parent:public_subnet2, dependsOn: public_subnet2});

const route_table_id_association_public_3 = new aws.ec2.RouteTableAssociation(`${name}-public-rt-association-3`,{
    subnetId: public_subnet3.id,
    routeTableId: public_route_table.id,
},{parent:public_subnet3, dependsOn: public_subnet3});

const eip = new aws.ec2.Eip(`${name}-eip-nat`,{ tags: { Name: `${name}-eip-nat`} }, { parent: public_subnet1 })

const nat_gateway = new aws.ec2.NatGateway(
    `${name}-natgateway1`,
    {
        subnetId: public_subnet1.id,
        allocationId: eip.id,
    },{parent: eip, dependsOn: eip});

const private_subnet1 = new aws.ec2.Subnet(
        `${name}-private-subnet1`,
        {
            vpcId: myvpc.id,
            cidrBlock: "10.0.1.0/26",
            availabilityZone: zone1,
            tags: {
                Name: `${name}-private-subnet1`,
                'kubernetes.io/role/elb': '1',
            },
            mapPublicIpOnLaunch: false,
        },{ parent: myvpc }
    );

const private_subnet2 = new aws.ec2.Subnet(
        `${name}-private-subnet2`,
        {
            vpcId: myvpc.id,
            cidrBlock: "10.0.1.64/26",
            availabilityZone: zone2,
            tags: {
                Name: `${name}-private-subnet1`,
                'kubernetes.io/role/elb': '1',
            },
            mapPublicIpOnLaunch: false,
        },{ parent: myvpc }
    );

const private_subnet3 = new aws.ec2.Subnet(
        `${name}-private-subnet3`,
        {
            vpcId: myvpc.id,
            cidrBlock: "10.0.1.128/25",
            availabilityZone: zone3,
            tags: {
                Name: `${name}-private-subnet3`,
                'kubernetes.io/role/elb': '1',
            },
            mapPublicIpOnLaunch: false,
        },{ parent: myvpc }
    );


const private_rt1 = new aws.ec2.RouteTable(
    `${name}-private-rt1`,
		{
			vpcId: myvpc.id,
			tags: { Name: `${name}-private-rt1`},
			routes: [
				{
					cidrBlock: '0.0.0.0/0',
					natGatewayId: nat_gateway.id,
				},
			],
		},{dependsOn: [nat_gateway, myvpc]});

const private_rt2 = new aws.ec2.RouteTable(
            `${name}-private-rt2`,
                {
                    vpcId: myvpc.id,
                
                    tags: { Name: `${name}-private-rt2`},
                    routes: [
                        {
                            cidrBlock: '0.0.0.0/0',
                            natGatewayId: nat_gateway.id,
                        },
                    ],
                },{dependsOn: [nat_gateway, myvpc]});


const private_rt3 = new aws.ec2.RouteTable(
                    `${name}-private-rt3`,
                        {
                            vpcId: myvpc.id,
                        
                            tags: { Name: `${name}-private-rt3`},
                            routes: [
                                {
                                    cidrBlock: '0.0.0.0/0',
                                    natGatewayId: nat_gateway.id,
                                },
                            ],
                        },{dependsOn: [nat_gateway, myvpc]});

const private_rt_association1 = new aws.ec2.RouteTableAssociation(`${name}-pv-rta1`, {
    routeTableId: private_rt1.id,
    subnetId: private_subnet1.id,
},{parent: private_rt1});

const private_rt_association2 = new aws.ec2.RouteTableAssociation(`${name}-pv-rta2`, {
    routeTableId: private_rt2.id,
    subnetId: private_subnet2.id,
},{parent: private_rt2}); 

const private_rt_association3 = new aws.ec2.RouteTableAssociation(`${name}-pv-rta3`, {
    routeTableId: private_rt3.id,
    subnetId: private_subnet3.id,
},{parent: private_rt3}); 



export const eip_name = eip.id;
export const nat_gateway_name = nat_gateway.id;

export const public_subnet1_name = public_subnet1.id;
export const public_subnet1_vpc = public_subnet1.vpcId;
export const public_subnet2_name = public_subnet2.id;
export const public_subnet2_vpc = public_subnet2.vpcId;
export const public_subnet3_name = public_subnet3.id;
export const public_subnet3_vpc = public_subnet3.vpcId;
export const route_table_id_association_public_1_id = route_table_id_association_public_1.id;
export const route_table_id_association_public_2_id = route_table_id_association_public_2.id;
export const route_table_id_association_public_3_id = route_table_id_association_public_3.id;

export const private_subnet1_name = private_subnet1.id;
export const private_subnet1_vpc = private_subnet1.vpcId;
export const private_subnet2_name = private_subnet2.id;
export const private_subnet2_vpc = private_subnet2.vpcId;
export const private_subnet3_name = private_subnet3.id;
export const private_subnet3_vpc = private_subnet3.vpcId;

export const private_rt1_name = private_rt1.id;
export const private_rt2_name = private_rt2.id;
export const private_rt3_name = private_rt3.id;

export const private_rt_association1_id = private_rt_association1.id;
export const private_rt_association2_id = private_rt_association2.id;
export const private_rt_association3_id = private_rt_association3.id;