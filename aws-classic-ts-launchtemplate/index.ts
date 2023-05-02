import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as tls from "@pulumi/tls";
import { output } from "@pulumi/pulumi";
import { Tag } from "./tags";

const myname = "shaht"
const mytags: Tag = {
    Name: `${myname}`,
    t_active: 'TRUE',
    t_app: 'myapps',
    t_billing_center: 'Production-Technology',
    t_autoScale: 'TRUE',
    t_contact: 'securityops@something.com',
    t_deployment: 'green',
    t_env: 'lab',
    t_owner: 'Engineering',
    t_project: 'Remote Access',
    t_team: 'Security',
    t_repository: 'https://github.com'
};

const awsprovider   = new aws.Provider(`${myname}-awsprovider`,{
    region: "us-west-2",
});

// Allocate a new VPC with the CIDR range from config file:
const myvpc = new awsx.ec2.Vpc(`${myname}-vpc`, {
    cidrBlock: "10.0.0.0/24",
    numberOfAvailabilityZones: 3,
    natGateways: {strategy: "Single"},
  },{provider: awsprovider});


const mysecuritygroup_allowTls = new aws.ec2.SecurityGroup(`${myname}-securitygroup-allowtls`, {
    description: "Allow TLS inbound traffic",
    vpcId: myvpc.vpcId,
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
}, {provider: awsprovider,dependsOn: [myvpc]});

const myiamrole = new aws.iam.Role(`${myname}-role`, {
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
},{provider: awsprovider});

const instanceprofile = new aws.iam.InstanceProfile(`${myname}-instanceprofile`, {
        role: myiamrole.name},
 { provider: awsprovider, dependsOn: myiamrole});

const sshPrivateKey = new tls.PrivateKey(`${myname}-privatekey`, {
    algorithm: "ED25519",
    ecdsaCurve: "P521",
});

/*
const mypublickey = tls.getPublicKeyOutput({
     privateKeyOpenssh:sshPrivateKey.privateKeyOpenssh,
});
*/
const mykeypair = new aws.ec2.KeyPair(`${myname}-keypair`, {
    publicKey: sshPrivateKey.publicKeyOpenssh,
},{provider: awsprovider, dependsOn: [sshPrivateKey]});

// Get the AMI
const myamiId = aws.ec2.getAmi({
    owners: ["amazon"],
    mostRecent: true,
    filters: [{
        name: "name",
        values: ["amzn2-ami-k*-hvm-*-x86_64-gp2"],
    }],
},{provider: awsprovider, async: true }).then(ami => ami.id);

const size = "t3a.nano";


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
        /* tags: {
            "user:Project": pulumi.getProject(),
            "user:Stack": pulumi.getStack(),
            "user:Creator": "demo"
        }, */
        tags: {...mytags},
        //tagsAll: {},
        userData: user_data
    },{provider: awsprovider})
}

export const vpc_private_subnet_0 = myvpc.privateSubnetIds[0];

const myinstance = new aws.ec2.Instance(`${myname}-server`, {
    launchTemplate: {"name": get_airflow_webserver_template(instanceprofile,[mysecuritygroup_allowTls.id], vpc_private_subnet_0,"").name},

  }, {provider: awsprovider,dependsOn: [myvpc]});

export const awsprovider_region = awsprovider.region;
export const vpc_name = myvpc.vpcId;
export const vpc_private_subnet_ids = myvpc.privateSubnetIds;
export const vpc_public_subnet_ids = myvpc.publicSubnetIds;
export const securitygroup_name = mysecuritygroup_allowTls.name;
export const iam_role = myiamrole.name;
export const instanceprofile_name = instanceprofile.name;
export const sshPrivateKey_name = sshPrivateKey.id;
export const sshPrivateKey_publickeyopenssh = pulumi.secret(sshPrivateKey.publicKeyOpenssh);
export const mykeypair_name = mykeypair.keyName;
export const mykeypair_publickey =pulumi.secret(mykeypair.publicKey);
export const myamiId_id = myamiId;
