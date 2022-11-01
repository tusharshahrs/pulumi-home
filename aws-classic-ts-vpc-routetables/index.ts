import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const name = "demo"
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
let current_number_of_nat_gateways = 0;

export const public_subnet_cidrs = ["10.0.0.0/25","10.0.0.128/26","10.0.0.192/26"];
export const private_subnet_cidrs = ["10.0.1.0/26","10.0.1.64/26","10.0.1.128/25"];

export const public_route_tables: any[] = [];
export const public_subnet_ids: any[] = [];
export const public_rt_associations: any[] = [];

export const private_subnet_ids: any[] = [];
export const private_route_tables: any[] = [];
export const private_rt_associations: any[] = [];
export const eips: any[] = [];
export const nat_gateways: any[] = [];

for (let x = 0; x < 3; x++ )
{
    // Create a public route table
    const public_route_table = new aws.ec2.RouteTable(`${name}-public-rt-${x}`,{
        vpcId: myvpc.id,
        routes: [{
            cidrBlock: "0.0.0.0/0",
            gatewayId: myinternetgateway.id,
        }],
        tags: {Name: `${name}-public-rt-${x}`},
    }, {parent: myvpc});
    

    // Create a public subnet
    const public_subnet = new aws.ec2.Subnet(
        `${name}-public-subnet-${x}`,
        {
            vpcId: myvpc.id,
            cidrBlock: public_subnet_cidrs[x],
            availabilityZone: zones.then(name_of_az=>name_of_az[x]),
            tags: {
                Name: `${name}-public-subnet-${x}`,
                'kubernetes.io/role/elb': '1',
            },
            mapPublicIpOnLaunch: false,
        },
        { parent: myvpc }
    );

    // Create a public route table association
    const public_rt_association = new aws.ec2.RouteTableAssociation(`${name}-public-rt-association-${x}`,{
        subnetId: public_subnet.id,
        routeTableId: public_route_table.id,
    }, {parent: myvpc});
    
    public_subnet_ids.push(public_subnet.id);
    public_route_tables.push(public_route_table.id);
    public_rt_associations.push(public_rt_association.id);

    // Elastic IP for nat gateway
    if (current_number_of_nat_gateways < number_of_nat_gateways)
    {
        const eip = new aws.ec2.Eip(`${name}-eip-nat-${x}`,{ tags: { Name: `${name}-eip-nat-${x}`} })

        const nat_gateway = new aws.ec2.NatGateway(
            `${name}-natgateway-${x}`,
            {
                subnetId: public_subnet.id,
                allocationId: eip.allocationId,
                tags: {
                    Name: `${name}-natgateway-${x}`
                }
            },{parent: eip, dependsOn: [eip, myinternetgateway ]});
        
        eips.push(eip.tags)
        nat_gateways.push(nat_gateway.id)
        current_number_of_nat_gateways += 1;
    }

    
    // Private subnets don't have a diff. This is good and expected
    const private_subnet = new aws.ec2.Subnet(
        `${name}-private-subnet-${x}`,
        {
            vpcId: myvpc.id,
            cidrBlock: private_subnet_cidrs[x],
            availabilityZone: zones.then(name_of_az=>name_of_az[x]),
            tags: {
                Name: `${name}-private-subnet-${x}`,
                'kubernetes.io/role/elb': '1',
            },
            mapPublicIpOnLaunch: false,
        },{ parent: myvpc, dependsOn: myvpc }
    );
    private_subnet_ids.push(private_subnet.id);

    
    // The cidrBlock shows a random diff.
    const private_route_table = new aws.ec2.RouteTable(
        `${name}-private-rt-${x}`,
            {
                vpcId: myvpc.id,
                tags: { Name: `${name}-private-rt-${x}`},
                routes: [
                    {
                       cidrBlock: '0.0.0.0/0',
                       natGatewayId: pulumi.interpolate`${nat_gateways[0]}`,
                    },
                ],
            });
    
    const private_rt_association = new aws.ec2.RouteTableAssociation(`${name}-private-rt-association-${x}`, {
        routeTableId: private_route_table.id,
        subnetId: private_subnet.id,
    });
    
    private_route_tables.push(private_route_table.id);
    private_rt_associations.push(private_rt_association.id);
    
}
