import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as iam from "./iam";
import * as k8s from "@pulumi/kubernetes";
import { create } from "domain";
import { Output } from "@pulumi/pulumi";

// importing local configs
const config = new pulumi.Config();
const env = pulumi.getStack()
const vpc_name = config.require("vpc_name");
const zone_number = config.requireNumber("zone_number");
const vpc_cidr = config.require("vpc_cidr");
const number_of_nat_gateways = config.requireNumber("number_of_nat_gateways");

const baseTags = {
    "Name": `${vpc_name}`,
    "availability_zones_used": `${zone_number}`,
    "cidr_block": `${vpc_cidr}`,
    "crosswalk": "yes",
    "number_of_nat_gateways": `${number_of_nat_gateways}`,
    "demo": "true",
    "pulumi:Project": pulumi.getProject(),
    "pulumi:Stack": pulumi.getStack(),
    "cost_center": "1234",
  }

  // Create 3 IAM Roles and matching InstanceProfiles to use with the nodegroups.
const my_name = `demo`;
const roles = iam.createRoles(my_name, 1);
const instanceProfiles = iam.createInstanceProfiles(my_name, roles);

  // Allocate a new VPC with the CIDR range from config file:
const vpc = new awsx.ec2.Vpc(vpc_name, {
    cidrBlock: vpc_cidr,
    numberOfAvailabilityZones: zone_number,
    numberOfNatGateways: number_of_nat_gateways,
    tags: baseTags,
  
  });
  
  // Export a few resulting fields to make them easy to use:
  export const pulumi_vpc_name = vpc_name;
  export const pulumi_vpc_id = vpc.id;
  export const pulumi_vpc_az_zones = zone_number;
  export const pulumi_vpc_cidr = vpc_cidr;
  export const pulumic_vpc_number_of_nat_gateways = number_of_nat_gateways;
  export const pulumi_vpc_private_subnet_ids = vpc.privateSubnetIds;
  export const pulumi_vpc_public_subnet_ids = vpc.publicSubnetIds;
  export const pulumi_vpc_aws_tags = baseTags;

  //  **************************** create K8s clutser ***********************************
// cluster options 
let options = {
    vpc: vpc,
    instanceType: aws.ec2.InstanceType.T3a_Medium,
    minSize: 2,
    maxSize: 6,
    name: my_name,
    version: "1.21",
    spotPrice: "0.1",
    desiredCapacity: 4,
    spotInstanceType: aws.ec2.InstanceType.T3a_Large,
    kubeProxyVersion: "1.21.2-eksbuild.2",
    awsNodeVersion: "1.8.0",
    coreDNSVersion: "1.8.3-eksbuild.1",
    clusterAutoscalerVersion: "1.21.0",
    deployDNSAutoscaler: true,
    enableLogging: true,
  };

  const cluster = new eks.Cluster(`${options.name}-ekscluster`, {
    tags: { Name: options.name },
    version: options.version,
    vpcId: options.vpc.vpc.id,
    endpointPrivateAccess: true,
    endpointPublicAccess: true,
    publicSubnetIds: options.vpc.publicSubnetIds,
    privateSubnetIds: options.vpc.privateSubnetIds,
    instanceType: options.instanceType,
    desiredCapacity: 4,
    skipDefaultNodeGroup: true,
    minSize: options.minSize,
    maxSize: options.maxSize,
    nodeAssociatePublicIpAddress: false,
    instanceRole: roles[0],
    enabledClusterLogTypes: options.enableLogging
      ? ["api", "audit", "authenticator", "controllerManager", "scheduler"]
      : [],
  });

const nodegroup = new eks.NodeGroup(`${options.name}-nodegroup-spot-1a`,
{
cluster: cluster,
instanceType: options.instanceType,
maxSize: options.maxSize,
minSize: options.minSize,
desiredCapacity: options.desiredCapacity,
instanceProfile: instanceProfiles[0],
});

//   ************************ create eks provider ************************** 
const k8sProvider = new k8s.Provider("eks-provider", {
  kubeconfig: cluster.kubeconfig.apply(JSON.stringify),
  suppressDeprecationWarnings: true,
});

export const cluster_name = cluster.eksCluster.name;

export const kubeconfig = pulumi.secret(cluster.kubeconfig)

// create a namespace for starry
const starrynamespace = new k8s.core.v1.Namespace("starry-ns", {
}, { provider: k8sProvider });

// create a namespace for light
const lightnamespace = new k8s.core.v1.Namespace("light-ns", {
}, { provider: k8sProvider });

//********************* create the deployment interface *****************************
interface flagshipBackendDeploymentOptionsDeploymentInterface {
    namespace: Output<string>,
    appLabels:{ app: string },
    containerName:string,
    image: string,
    replicas: number
};


// create deployment
function createDeployment(options:flagshipBackendDeploymentOptionsDeploymentInterface){
      const appDeployment = new k8s.apps.v1.Deployment(options.containerName, {
          metadata: { namespace: options.namespace },
          spec: {
              selector: { matchLabels: options.appLabels },
              replicas: options.replicas,
              template: {
                  metadata: { labels: options.appLabels },
                  spec: {
                      containers: [{
                          name: options.containerName,
                          image: options.image,
                          env: [
                            { "name": "test", value: "starry" },
                          ],
                          ports: [
                            {name: "http", containerPort: 80},
                            // { name: "https", containerPort: 443 }
                          ],
                      }],
                  }
              },
          }
      }, { provider: k8sProvider });
}

export const myfunction = createDeployment({
  namespace: starrynamespace.metadata.name,
  appLabels:{ app: "starryflagship" },
  containerName:'starry-falgship',
  image: "nginx:1.21.0",
  replicas:4
});

export const myfunction2 = createDeployment({
  namespace: lightnamespace.metadata.name,
  appLabels:{ app: "lightflagship" },
  containerName:'light-falgship',
  image: "nginx:1.19.0",
  replicas:3
});

/* const nginxLabels = { app: "nginx" };
const nginxDeployment = new k8s.apps.v1.Deployment("nginx-deployment", {
    spec: {
        selector: { matchLabels: nginxLabels },
        replicas: config.getNumber("replicas") || 2,
        template: {
            metadata: { labels: nginxLabels },
            spec: {
                containers: [{
                    name: "nginx",
                    image: "nginx:1.20.0",
                    ports: [{ containerPort: 80 }],
                }],
            },
        },
    },
}, {provider: k8sProvider}); */