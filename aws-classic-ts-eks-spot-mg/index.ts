import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as iam from "./iam";
import * as k8s from "@pulumi/kubernetes";
import { CustomResourceDefinitionArgs } from "@pulumi/kubernetes/apiextensions/v1";

// Create 3 IAM Roles and matching InstanceProfiles to use with the nodegroups.
const my_name = `shaht`;
const roles = iam.createRoles(my_name, 1);
const instanceProfiles = iam.createInstanceProfiles(my_name, roles);

const myvpc = new awsx.ec2.Vpc(`${my_name}-vpc`, {
  numberOfAvailabilityZones: 3,
  natGateways: { strategy: "Single" },
  tags: { Name: `${my_name}-vpc` },
});

const myvpc_info = myvpc.vpcId;

const mycluster = new eks.Cluster(
  `${my_name}-eks`,
  {
    skipDefaultNodeGroup: true,
    vpcId: myvpc.vpcId,
    publicSubnetIds: myvpc.publicSubnetIds,
    privateSubnetIds: myvpc.privateSubnetIds,
    instanceType: "t3a.medium",
    version: "1.24",
    nodeRootVolumeSize: 20,
    instanceRole: roles[0],
    encryptRootBockDevice: true,
    enabledClusterLogTypes: [
      "api",
      "audit",
      "authenticator",
      "controllerManager",
      "scheduler",
    ],
  },
  { dependsOn: myvpc }
);

export const cluster_name = mycluster.eksCluster.name;
//export const managed_nodegroup_capacitytype =managed_node_group_spot.nodeGroup.capacityType;
export const cluster_verion = mycluster.eksCluster.version;
export const kubeconfig = pulumi.secret(mycluster.kubeconfig);


const mylaunchTemplate = new aws.ec2.LaunchTemplate("example-launch-template", {
  tags: {"Name": "example-launch-template", "eks": pulumi.interpolate`${mycluster.eksCluster.name}`},
  imageId: "ami-01a3db5413137ab41", // Customize the image ID based on your requirements: amazon-eks-node-1.25-v20230513
  instanceType: "t3a.small", // Customize the instance type based on your requirements 
  //defaultVersion: 1,
  description: "This is the example launch template for the EKS cluster managed node group by Tushar Shah",
  updateDefaultVersion: true,
  vpcSecurityGroupIds: [mycluster.nodeSecurityGroup.id],
});

export const mylaunchTemplate_info = mylaunchTemplate.id;
export const mylaunchTemplate_version = mylaunchTemplate.latestVersion;


const managed_node_group_spot = new eks.ManagedNodeGroup(
  `${my_name}-manangednodegroup-spot`,
  //`${my_name}-manangednodegroup`,
  {
    cluster: mycluster,
    capacityType: "SPOT",
    //instanceTypes: ["t3a.micro"],
    nodeRole: roles[0],
    labels: { managed: "true", spot: "true" },
    //labels: { managed: "true", spot: "false" },
    subnetIds: myvpc.publicSubnetIds,
    
    launchTemplate: {
      id: mylaunchTemplate.id,
      version: pulumi.interpolate`${mylaunchTemplate.latestVersion}`,
    },
    tags: {
      "k8s.cluster-autoscaler/shaht-dev": "owned",
      "k8s.cluster-autoscaler/enabled": "True",
      team: "team-ce",
      environment: "development",
    },

    scalingConfig: {
      desiredSize: 4,
      minSize: 3,
      maxSize: 10,
    },
    //diskSize: 10,
  },
  { dependsOn: [myvpc] }
);


// comment out entire block if you are using ~/.kube/config
const k8sProvider = new k8s.Provider(`${my_name}-k8sprovider`, {
  kubeconfig: mycluster.kubeconfig,
});


const mynamespace = new k8s.core.v1.Namespace(
    `${my_name}-namespace`,
    {},
  
    //{dependsOn: [mycluster] }  // Use this for ~/.kube/config
    { provider: k8sProvider, dependsOn: [mycluster] }
  );


/*  
const foobarcrd = new k8s.apiextensions.v1.CustomResourceDefinition(
    `${my_name}-foobarcrd`,
    {
      metadata: { name: "foobars.stable.example.com"},
      spec: {
        group: "stable.example.com",
        versions: [
          {
            name: "v1",
            served: true,
            storage: true,
            schema: {
              openAPIV3Schema: {
                type: "object",
              },
            },
          },
        ],
        scope: "Namespaced",
        names: {
          plural: "foobars",
          singular: "foobar",
          kind: "FooBar",
          shortNames: ["fb"],
        },
      },
    },
    { provider: k8sProvider, dependsOn: [mynamespace, mycluster] } // Comment out this line after the first run when you are trying to create the issue.
   //{ provider: k8sProvider, dependsOn: [namespace, mycluster], import: "foobars.stable.example.com" }
   //  {dependsOn: [namespace, mycluster], import: "foobars.stable.example.com"}    
  
    //{dependsOn: [namespace, mycluster]}     // Use this for ~/.kube/config  Uncomment the code on this line and run pulumi up and select yes to trigger the error
  ); 
  
  export const my_namespace = mynamespace.metadata.name;
  export const my_crd = foobarcrd.metadata.name;
  //pulumi stack output kubeconfig  --show-secrets> ~/.kube/config  
*/


// Create a Pod Disruption Budget.
const pdb = new k8s.policy.v1.PodDisruptionBudget(`${my_name}-pdb`, {
  metadata: { namespace: "default",  },
  spec: {
      minAvailable: 2,
      //maxUnavailable: 3,
      selector: {
          matchLabels: {
              app: "myapp",
          },
      },
  },
}, { provider: k8sProvider });

const pdb2 = new k8s.policy.v1.PodDisruptionBudget(`${my_name}-pdb2`, {
  metadata: {
      //name: "example-pdb2",
      namespace: mynamespace.metadata.name,
      annotations: {
          "example-key2": "example-value2",
      },
      labels: {
          "app": "example2",
      },
  },
  spec: {
      //maxUnavailable: "50%", // percentage of pods allowed to be unavailable
      minAvailable: "50%", // percentage of pods that must remain available
      selector: {
          matchLabels: {
              "app": "example2", // match pods with this label
          },
      },
      unhealthyPodEvictionPolicy: "NoEviction", // criteria for evicting unhealthy pods (NoEviction, StaticallyKubeletOnly)
  },
}, { provider: k8sProvider });

export const mypdb = pdb.metadata.name;
export const mypdb2 = pdb2.metadata.name;
export const managed_node_group_name = managed_node_group_spot.nodeGroup.id;
export const managed_node_group_version = managed_node_group_spot.nodeGroup.version;  
export const managed_node_group_launchtemplate = managed_node_group_spot.nodeGroup.launchTemplate;  
