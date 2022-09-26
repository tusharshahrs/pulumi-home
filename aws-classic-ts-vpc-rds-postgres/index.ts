import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";
import * as random from "@pulumi/random";
import * as pulumi from "@pulumi/pulumi"

// Variable we will use for naming purpose
const name = "demo";

// Creating a VPC with a Single Nat Gateway  Strategy (To save cost)
const myvpc = new awsx.ec2.Vpc(`${name}-vpc`, {
    cidrBlock: "10.0.0.0/24",
    numberOfAvailabilityZones: 3,
    enableDnsHostnames: true,
    natGateways: {
      strategy: "Single", // This is mainly to save cost. You do this only in dev
    },
  });

// VPC Outputs
export const vpc_id = myvpc.vpcId;
export const vpc_natgateways = myvpc.natGateways[0].id;
export const vpc_public_subnetids = myvpc.publicSubnetIds;
export const vpc_private_subnetids = myvpc.privateSubnetIds;

// Creating Security Group within VPC
const mysecuritygroup = new aws.ec2.SecurityGroup(`${name}-securitygroup`, {
    vpcId:myvpc.vpcId,
    ingress: [
        { protocol: "tcp", 
          fromPort: 443, 
          toPort: 443, 
          description: "Allow inbound access via https",
          self: true, // Add the securitygroup itself as a source
        },
        { 
        protocol: "tcp", 
        fromPort: 80, 
        toPort: 80, 
        description: "Allow inbound access via http",
        self: true, // Add the securitygroup itself as a source
      },
    ],
    egress: [
      { protocol: "tcp", 
          fromPort: 443, 
          toPort: 443, 
          cidrBlocks: ["0.0.0.0/0"],
          description: "Allow outbound access via https" 
        },
        { 
        protocol: "tcp", 
        fromPort: 80, 
        toPort: 80, 
        cidrBlocks: ["0.0.0.0/0"],
        description: "Allow outbound access via http" 
      },
  ],
  tags: {"Name": `${name}-securitygroup`},
}, { parent: myvpc, dependsOn: myvpc });

// Exporting security group outputs
export const security_group_name = mysecuritygroup.id;
export const security_group_vpc = mysecuritygroup.vpcId;
//export const security_group_egress = mysecuritygroup.egress;
//export const security_group_ingress = mysecuritygroup.ingress;

const dbSubnets = new aws.rds.SubnetGroup(`${name}-dbsubnets`, {
    subnetIds: myvpc.privateSubnetIds,
    tags: {"Name":`${name}-dbsubnets`},
    description: "RDS DBSubnet Group Managed by Pulumi",
});

export const dbsubnet_name = dbSubnets.name;


const mypassword = new random.RandomPassword(`${name}-rds-password`, {
    length: 16,
    special: false,
});

export const rds_password = mypassword.result;
const myusername = "myusernamepulumi";


const mypostgresdb = new aws.rds.Instance(`${name}-postgres`, {
    engine: "postgres",
    instanceClass: "db.t3.micro",
    allocatedStorage: 20,
    maxAllocatedStorage: 100,
    storageType: "gp2",
    multiAz: true,
    dbSubnetGroupName: dbSubnets.id,
    vpcSecurityGroupIds: [mysecuritygroup.id],
    password: mypassword.result,
    username: myusername,
    applyImmediately: false,
    skipFinalSnapshot: true,
    storageEncrypted: true,
    copyTagsToSnapshot: true,
    autoMinorVersionUpgrade: true,
    port: 5432,
    engineVersion: "14",
    deleteAutomatedBackups: true, // In production, best to set to false. In dev, true is fine.
    tags: { "Name": `${name}-postgres`}
});

export const db_postgres_engine = mypostgresdb.engine;
export const db_postgres_engineversion = mypostgresdb.engineVersion;
export const db_postgres_id = mypostgresdb.id;
export const db_postgres_multiaz = mypostgresdb.multiAz;
export const db_postgres_az = mypostgresdb.availabilityZone;
export const db_postgres_endpoint =  pulumi.secret(mypostgresdb.endpoint);
export const db_postgres_port =  mypostgresdb.port;