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
}, {parent: myvpc, dependsOn: myvpc});


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


export const public_subnet_cidrs = ["10.0.0.0/25","10.0.0.128/26","10.0.0.192/26"];
export const private_subnet_cidrs = ["10.0.1.0/26","10.0.1.64/26","10.0.1.128/25"];

export const public_subnet_ids: any[] = [];
export const private_subnet_ids: any[] = [];

export const public_route_tables: any[] = [];
export const public_route_tables_names: any[] = [];

const number_of_nat_gateways = 1;
let current_number_of_nat_gateways = 0;

export const public_route_table_associations: any[] = [];

export const private_route_tables: any[] = [];
export const private_route_tables_names: any[] = [];
export const private_route_table_associations: any[] = [];

export const private_routes: any[] = [];

//export const private_rt_associations: any[] = [];
export const eips: any[] = [];
export const nat_gateways: any[] = [];

export const public_routes: any[] = [];

for (let x = 0; x < 3; x++ )
{
    // Create a public subnet
    const public_subnet = new aws.ec2.Subnet(`${name}-public-subnet-${x}`,
        {
            vpcId: myvpc.id,
            cidrBlock: public_subnet_cidrs[x],
            availabilityZone: zones.then(name_of_az=>name_of_az[x]),
            tags: {
                Name: `${name}-public-subnet-${x}`,
            },
            mapPublicIpOnLaunch: false,
        },
        { parent: myvpc, dependsOn: [myvpc] }
    );
    public_subnet_ids.push(public_subnet.id)

    // Creation of Private Subnets
    const private_subnet = new aws.ec2.Subnet(`${name}-private-subnet-${x}`,
        {
            vpcId: myvpc.id,
            cidrBlock: private_subnet_cidrs[x],
            availabilityZone: zones.then(name_of_az=>name_of_az[x]),
            tags: {
                Name: `${name}-private-subnet-${x}`,
            },
            mapPublicIpOnLaunch: false,
            },{ parent: myvpc, dependsOn: [myvpc] }
        );
    private_subnet_ids.push(private_subnet.id);
      
    // Create a public route table
    const public_route_table = new aws.ec2.RouteTable(`${name}-public-rt-${x}`,
        {
        vpcId: myvpc.id,
        tags: {
            Name: `${name}-public-rt-${x}`
        },
        }, {parent: public_subnet, dependsOn: [public_subnet]});
    public_route_tables.push(public_route_table.id)
    public_route_tables_names.push(public_route_table.tags)
    
    // create a private route table
    const private_route_table = new aws.ec2.RouteTable(`${name}-private-rt-${x}`,
        {
            vpcId: myvpc.id,
            tags: { 
                Name: `${name}-private-rt-${x}`
                },
            }, {parent: private_subnet, dependsOn: [private_subnet]});
    private_route_tables.push(private_route_table.id)
    private_route_tables_names.push(private_route_table.tags)
    
    // create a public route table association
    const public_rt_table_association = new aws.ec2.RouteTableAssociation(`${name}-public-rt-table-association-${x}`,
    {
        subnetId: public_subnet.id,
        routeTableId: public_route_table.id,
    }, {parent: public_route_table, dependsOn: public_route_table});
    public_route_table_associations.push(public_rt_table_association.id)

    const private_rt_table_association = new aws.ec2.RouteTableAssociation(`${name}-private-rt-table-association-${x}`, 
        {
            subnetId: private_subnet.id,
            routeTableId: private_route_table.id,
            
        }, {parent: private_route_table, dependsOn: [private_route_table]});
    private_route_table_associations.push(private_rt_table_association.id)


    // create a public_route.  Avoiding putting everything in route table due to delete/create on every pulumi up due to upstream issu
    const public_route = new aws.ec2.Route(`${name}-public-route-${x}`,
        {
            routeTableId: public_route_table.id,
            gatewayId: myinternetgateway.id,
            destinationCidrBlock: "0.0.0.0/0",
        }, { parent: public_route_table, dependsOn: [public_route_table, myinternetgateway,public_subnet] });
        public_routes.push(public_route.id)

    
    // Elastic IP for nat gateway
    if (current_number_of_nat_gateways < number_of_nat_gateways)
    {   // Create an elastic ip for the nat gateway
        const eip = new aws.ec2.Eip(`${name}-eip-nat-${x}`,
        {   vpc: true,
            tags: { Name: `${name}-eip-nat-${x}`} 
        
        },{dependsOn: myinternetgateway})
        // Create a nat gateway
        const nat_gateway = new aws.ec2.NatGateway(
            `${name}-natgateway-${x}`,
            {
                subnetId: public_subnet.id,
                allocationId: eip.allocationId,
                tags: {Name: `${name}-natgateway-${x}`}
            },{parent: eip, dependsOn: [eip,public_subnet] });
        eips.push(eip.tags)
        nat_gateways.push(nat_gateway.id)
        current_number_of_nat_gateways += 1;
    }
    
    // create a private_route.  Avoided placing nat gateway in route table due to delete/create on every pulumi up due to upstream issue.
    const private_route = new aws.ec2.Route(`${name}-private-route-${x}`,
        {
            routeTableId: private_route_table.id,
            destinationCidrBlock: "0.0.0.0/0",
            natGatewayId: pulumi.interpolate`${nat_gateways[0]}`,
        }, { parent: private_route_table, dependsOn:[private_route_table]});
    private_routes.push(private_route.id)
    
}
