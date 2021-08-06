import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as tls from "@pulumi/tls";
import { output } from "@pulumi/pulumi";

const myname = "demo"

// Allocate a new VPC with the CIDR range from config file:
const myvpc = new awsx.ec2.Vpc(`${myname}-vpc`, {
    cidrBlock: "10.0.0.0/25",
    numberOfAvailabilityZones: 3,
    numberOfNatGateways: 1,
    tags: {"Name":`${myname}-vpc`}  
  });

const mysecuritygroup_allowTls = new aws.ec2.SecurityGroup(`${myname}-securitygroup-allowtls`, {
    description: "Allow TLS inbound traffic",
    vpcId: myvpc.id,
    ingress: [{
        description: "TLS from VPC",
        fromPort: 443,
        toPort: 443,
        protocol: "tcp",
        cidrBlocks: [myvpc.vpc.cidrBlock],
    }],
    egress: [{
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
        ipv6CidrBlocks: ["::/0"],
    }],
    tags: {
        Name: "allow_tls",
    },
});

const sshPrivateKey = new tls.PrivateKey(`${myname}-privatekey`, {
    algorithm: "RSA",
    rsaBits: 4096,
});

const mykeypair = new aws.ec2.KeyPair(`${myname}-keypair`, {
    publicKey: sshPrivateKey.publicKeyOpenssh,
    keyName: `${myname}`,
});

// Get the AMI
const myamiId = aws.ec2.getAmi({
    owners: ["amazon"],
    mostRecent: true,
    filters: [{
        name: "name",
        values: ["amzn2-ami-hvm-2.0.????????-x86_64-gp2"],
    }],
}, { async: true }).then(ami => ami.id);

const size = "t3a.micro";

const myrole = new aws.iam.Role(`${myname}-role`, {
    path: "/",
    assumeRolePolicy: `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
               "Service": "ec2.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
}
`,
});


const instanceprofile = new aws.iam.InstanceProfile(`${myname}-instanceprofile`, {role: myrole.name});
// Getting the private subnet0
export const vpc_private_subnet_0 = myvpc.privateSubnetIds.then(theprivatesubnets=> theprivatesubnets[0]);
// Changing from promise to string so that we can pass it into the launchtemplate function
export const vpc_private_subnet_0_string = pulumi.interpolate`${vpc_private_subnet_0}`

export function get_airflow_webserver_template(airflow_profile: aws.iam.InstanceProfile, securityGroupIds: pulumi.Output<string>[], subnetIds: pulumi.Output<string>, user_data: string) {

    return new aws.ec2.LaunchTemplate(`${myname}-airflow-webserver-dev`, {
        blockDeviceMappings: [
            {
                deviceName: "/dev/sda1",
                ebs: {
                    deleteOnTermination: "true",
                    encrypted: "false",
                    //iops: 400,
                    //throughput: 250,
                    volumeSize: 30,
                    volumeType: "gp2"
                }
            }
        ],
        updateDefaultVersion: true,
        disableApiTermination: false,
        ebsOptimized: "false",
        iamInstanceProfile: {arn: airflow_profile.arn},
        imageId: myamiId,
        instanceType: size,
        keyName: mykeypair.keyName,
        monitoring: {
            enabled: true
        },
        name: "Demo-Airflow-Webserver",
        networkInterfaces: [
            {
                associatePublicIpAddress: "false",
                deviceIndex: 0,
                ipv4AddressCount: 0,
                ipv6AddressCount: 0,
                securityGroups: [mysecuritygroup_allowTls.id],
                subnetId: subnetIds, // the second subnet could be assigned in another network interface.
            }
        ],
        tagSpecifications: [
            {
                resourceType: "instance",
                tags: {
                    Name: "Airflow-Webserver"
                }
            }
        ],
        tags: {
            "user:Project": pulumi.getProject(),
            "user:Stack": pulumi.getStack(),
            "user:Creator": "demo"
        },
        tagsAll: {},
        userData: user_data
    })
}

const myinstance = new aws.ec2.Instance(`${myname}-server`, {
    launchTemplate: {"name": get_airflow_webserver_template(instanceprofile,[mysecuritygroup_allowTls.id], vpc_private_subnet_0_string,"").name},

  }, {dependsOn: [myvpc]});

export const vpc_name = myvpc.id;
export const vpc_private_subnet_ids = myvpc.privateSubnetIds;
export const vpc_public_subnet_ids = myvpc.publicSubnetIds;
export const securitygroup_name = mysecuritygroup_allowTls.name;
export const instanceprofile_name = instanceprofile.name;