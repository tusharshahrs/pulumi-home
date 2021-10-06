import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as tls from "@pulumi/tls";
import { Vpc } from "@pulumi/aws/ec2";

const name = "demo";

// create ssh private key
const sshPrivateKey = new tls.PrivateKey(`${name}-privatekey`, {
    algorithm: "RSA",
    rsaBits: 4096,
});

// create keypair for aws ec2 instance to use
const keyPair = new aws.ec2.KeyPair(`${name}-keypair`, {
    publicKey: sshPrivateKey.publicKeyOpenssh,
});


// Get the AMI
const amiId = aws.ec2.getAmi({
    owners: ["amazon"],
    mostRecent: true,
    filters: [{
        name: "name",
        values: ["amzn2-ami-hvm-2.0.????????-x86_64-gp2"],
    }],
}, { async: true }).then(ami => ami.id);

const size = "t3a.micro";

const vpc = new awsx.ec2.Vpc(`${name}-vpc`, {
    cidrBlock: "10.0.0.0/25",
    numberOfAvailabilityZones: 3,
    numberOfNatGateways: 1,
});

export const subnet_id_to_use = vpc.publicSubnetIds.then(mysubnet =>mysubnet[0]);

const instance = new aws.ec2.Instance(`${name}-server`, {
    ami: amiId,
    instanceType: "t3a.micro",
    subnetId: pulumi.interpolate`${subnet_id_to_use}`,
    disableApiTermination: false,
    getPasswordData: false,
    keyName: keyPair.keyName,
    tags: {"Name": "dev20-sqldb", "Patch Group": "Windows-Patching","t_app_eventlogseeder": "no","t_app_eventpublishing": "no","t_app_seeder": "no","t_deployment": "blue","t_env": "dev","t_pulumi": "TRUE"},
    //volumeTags: {"Name": "dev20v-sqldb", "Patch Group": "Windows-Patching","t_app_eventlogseeder": "no","t_app_eventpublishing": "no","t_app_seeder": "no","t_deployment": "blue","t_env": "dev","t_pulumi": "TRUE"},
    rootBlockDevice:{encrypted: true, deleteOnTermination: true, volumeSize:20},
    ebsBlockDevices: [
      {
        deleteOnTermination: true,
        deviceName: "xvdd",
        volumeSize: 10,
        encrypted: true,
        tags: {"Name": "dev20-sqldb-volume-1", "Patch Group": "Windows-Patching","t_app_eventlogseeder": "no","t_app_eventpublishing": "no","t_app_seeder": "no","t_deployment": "blue","t_env": "dev","t_pulumi": "TRUE"},
        
      },
      {
        deleteOnTermination: true,  
        deviceName: "xvde",
        volumeSize: 15,
        encrypted: true,
        tags: {"Name": "dev20-sqldb-volume-2", "Patch Group": "Windows-Patching","t_app_eventlogseeder": "no","t_app_eventpublishing": "no","t_app_seeder": "no","t_deployment": "blue","t_env": "dev","t_pulumi": "TRUE"},
      },
      
    ],
  });

export const keypair_name = keyPair.keyName;
export const ami = amiId;
export const vpc_name = vpc.id;
export const vpc_publicsubnets = vpc.publicSubnetIds;
export const vpc_privatesubnets = vpc.privateSubnetIds;
export const instance_name = instance.id;