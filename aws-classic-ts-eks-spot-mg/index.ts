import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
//import * as eks from "@pulumi/eks";
import * as iam from "./iam";
import * as k8s from "@pulumi/kubernetes";
import { CustomResourceDefinitionArgs } from "@pulumi/kubernetes/apiextensions/v1";
import { Config, StackReference } from "@pulumi/pulumi";
import { type } from "os";

// Create 3 IAM Roles and matching InstanceProfiles to use with the nodegroups.
const my_name = `shaht2`;

/*
const roles = iam.createRoles(my_name, 1);
const instanceProfiles = iam.createInstanceProfiles(my_name, roles);
*/
//const config = new pulumi.Config();
//const networkingStack = new StackReference(config.require("networkingStack"));
//const myvpcid = networkingStack.getOutput("vpc_id");
//const mypublicsubnetids = networkingStack.getOutput("public_subnet_ids");
//const myprivatesubnetids = networkingStack.getOutput("private_subnet_ids");


const myvpc = new awsx.ec2.Vpc(`${my_name}-vpc`, {
  cidrBlock: "10.0.0.0/22",
  numberOfAvailabilityZones: 3,
  natGateways: { strategy: "Single" },
  tags: { Name: `${my_name}-vpc` },
  enableDnsHostnames: true,
  enableDnsSupport: true,

});

export const myvpc_id = myvpc.vpcId;

const eksclustersecuritygroup = new aws.ec2.SecurityGroup(`${my_name}-eks-cluster-sg`, {
  vpcId: myvpc.vpcId,
  revokeRulesOnDelete: true,
  description: "EKS created security group created by code.",
  egress: [{
      description: "Allow outbound internet access",
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
  }],
  ingress: [
      {
          description: "Ingress to self cluster.  ",
          protocol: "-1",
          fromPort: 0,
          toPort: 0,
          self: true, // This allows us to call the securitygroup itself as a source
      },
    ],
    //tags: { Name: `${my_name}-eks-cluster-sg` },
    /* tags: //
//pulumi.all([ mycluster.eksCluster.name]).apply(([cluster_name]) => {
  mycluster.eksCluster.name.apply(cluster_name => {
      return {
        Name: `${my_name}-eks-cluster-sg`,
        [`kubernetes.io/cluster/${cluster_name}`]: "owned",
        //[`aws:eks:cluster-name`]: cluster_name,
      };
    }), */
  }, { dependsOn: myvpc });
 
export const securitygroup_eksnode_id = eksclustersecuritygroup.id;
export const securitygroup_eksnode_name = eksclustersecuritygroup.name;
export const securitygroup_eksnode_vpcid = eksclustersecuritygroup.vpcId;
export const securitygroup_eksnode_tags = eksclustersecuritygroup.tags;

const mylaunchTemplate = new aws.ec2.LaunchTemplate(`${my_name}-launchtemplate`, {
  tags: {"Name": `${my_name}-launchtemplate`},
  //imageId: "ami-028b7bddbfee3053f", // Customize the image ID based on your requirements: amazon-eks-node-1.25-v20230513
  instanceType: "t3a.small", // Customize the instance type based on your requirements 
  description: "This is the example launch template for the EKS cluster managed node group by Tushar Shah",
  updateDefaultVersion: true,
  vpcSecurityGroupIds: [eksclustersecuritygroup.id],
  
}
);

export const mylaunchTemplate_id = mylaunchTemplate.id;
export const mylaunchTemplate_version = mylaunchTemplate.latestVersion;
export const public_subnet_ids = myvpc.publicSubnetIds;
export const private_subnet_ids = myvpc.privateSubnetIds;

// Extract the subnet IDs from the VPC
const eksRole = new aws.iam.Role(`${my_name}-eksRole`, {
  assumeRolePolicy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
          {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: { Service: "eks.amazonaws.com" },
          },
      ],
  }),
});

const eksPolicyAttachment = new aws.iam.RolePolicyAttachment(`${my_name}-eksPolicyAttachment`, {
  policyArn: aws.iam.ManagedPolicy.AmazonEKSClusterPolicy,
  role: eksRole.name,
});

const AmazonEKSVPCResourceController = new aws.iam.RolePolicyAttachment("example-AmazonEKSVPCResourceController", {
  policyArn: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
  role: eksRole.name,
});

const nodeRole = new aws.iam.Role(`${my_name}-nodeRole`, {
  assumeRolePolicy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
          {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: { Service: "ec2.amazonaws.com" },
          },
      ],
  }),
});

const example_AmazonEKSWorkerNodePolicy = new aws.iam.RolePolicyAttachment("example-AmazonEKSWorkerNodePolicy", {
  policyArn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
  role: nodeRole.name,
});
const example_AmazonEKSCNIPolicy = new aws.iam.RolePolicyAttachment("example-AmazonEKSCNIPolicy", {
  policyArn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
  role: nodeRole.name,
});
const example_AmazonEC2ContainerRegistryReadOnly = new aws.iam.RolePolicyAttachment("example-AmazonEC2ContainerRegistryReadOnly", {
  policyArn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
  role: nodeRole.name,
});

const mycluster = new aws.eks.Cluster(`${my_name}-eks`, {
 roleArn: eksRole.arn,
 version: "1.25",
 enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler"],
 
 vpcConfig: {
    //vpcId: myvpc.vpcId, //commented out due to: https://github.com/pulumi/pulumi-terraform-bridge/issues/74
    securityGroupIds:  [eksclustersecuritygroup.id],
    subnetIds: myvpc.publicSubnetIds,
  },
});

const eksnodegroup = new aws.eks.NodeGroup(`${my_name}-eksNodeGroup`, {
  clusterName: mycluster.name,
  subnetIds: myvpc.publicSubnetIds, // Provide a list of subnet IDs associate with the node group
  nodeRoleArn: nodeRole.arn,
  launchTemplate: {
    id: mylaunchTemplate.id,
    version: pulumi.interpolate`${mylaunchTemplate.latestVersion}`,
  },
  scalingConfig: {
      desiredSize: 2,
      maxSize: 8,
      minSize: 2,
  },
});

/*
const eksNodeGroup2 = new aws.eks.NodeGroup(`${my_name}-eksNodeGroup-lt`, {
  clusterName: myclusterawseks.name,
  //subnetIds: myvpc.publicSubnetIds, // Provide a list of subnet IDs associate with the node group
  subnetIds: myvpc.privateSubnetIds, // Provide a list of subnet IDs associate with the node group
  nodeRoleArn: nodeRole.arn,
  launchTemplate: {
    id: mylaunchTemplate.id,
    version: pulumi.interpolate`${mylaunchTemplate.latestVersion}`,
  },
  
  scalingConfig: {
      desiredSize: 3,
      maxSize: 8,
      minSize: 2,
  },
});
*/

/*
const mynodegroup = new aws.eks.NodeGroup(`${my_name}-eks-nodegroup`, {
  clusterName: myclusterawseks.name,
  //nodeRoleArn: roles[0].arn,
  updateConfig: {
    maxUnavailable: 1,
  },
  launchTemplate: { 
    id: mylaunchTemplate.id,
    version: pulumi.interpolate`${mylaunchTemplate.latestVersion}`    
  },
  scalingConfig: {
    desiredSize: 3,
    minSize: 2,
    maxSize: 8,
  },
  subnetIds: [
    myvpc.publicSubnetIds[0],
    myvpc.publicSubnetIds[1],
    myvpc.publicSubnetIds[2],
    myvpc.privateSubnetIds[0],
    myvpc.privateSubnetIds[1],
    myvpc.privateSubnetIds[2]
  ],
}, { dependsOn: [myclusterawseks, mylaunchTemplate] });
*/

/*
const mycluster = new eks.Cluster(
  `${my_name}-eks`,
  {
    skipDefaultNodeGroup: true,
    vpcId: myvpc.vpcId,
    publicSubnetIds: myvpc.publicSubnetIds,
    privateSubnetIds: myvpc.privateSubnetIds,
    clusterSecurityGroup: eksclustersecuritygroup,
    instanceType: "t3a.small",
    version: "1.25",
    nodeRootVolumeSize: 10,
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
  { parent: mylaunchTemplate, dependsOn: [myvpc, eksclustersecuritygroup, mylaunchTemplate],}
);

export const myvpcid = myvpc.vpcId;
export const cluster_name = mycluster.eksCluster.name;
//export const managed_nodegroup_capacitytype =managed_node_group_spot.nodeGroup.capacityType;
export const cluster_verion = mycluster.eksCluster.version;
export const kubeconfig = pulumi.secret(mycluster.kubeconfig);
export const eksclustersecuritygroupinfo = eksclustersecuritygroup;
*/
//const kubeconfig = aws.eks.Cluster.get("kubeconfig", { clusterName: mycluster.name });
// comment out entire block if you are using ~/.kube/config

/*
const k8sProvider = new k8s.Provider(`${my_name}-k8sprovider`, {
  kubeconfig: mycluster.kubeconfig,
});
*/
const k8sProvider = new k8s.Provider(`${my_name}-k8sprovider`, {
  kubeconfig: aws.eks.Cluster.get("kubeconfig", { clusterName: mycluster.name }),
});
/*
const managed_node_group_spot = new eks.ManagedNodeGroup(
  `${my_name}-mng-nolt`,
  {
    cluster: mycluster,
    capacityType: "SPOT",
    //instanceTypes: ["t3a.micro"],
    nodeRole: roles[0],
    labels: { managed: "true", spot: "true" },
    //labels: { managed: "true", spot: "false" }, 
    tags: {
      //"k8s.cluster-autoscaler/shaht-dev": "owned",
      //"k8s.cluster-autoscaler/enabled": "True",
      team: "team-ce",
      environment: "development",
      launch_template: "no"
    },

    scalingConfig: {
      desiredSize: 3,
      minSize: 2,
      maxSize: 8,
    },
  },
  { dependsOn: [myvpc, mycluster, mylaunchTemplate]}
);
*/

/*
const mynamespace = new k8s.core.v1.Namespace(
    `${my_name}-namespace`,
    {},
  
    //{dependsOn: [mycluster] }  // Use this for ~/.kube/config
    { dependsOn: [mycluster, eksnodegroup] }
  );

  export const managed_node_group_name = eksnodegroup.id;
  export const managed_node_group_version = eksnodegroup.version;  
  export const managed_node_group_launchtemplate = eksnodegroup.launchTemplate;  
*/

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

/*
// Create a Pod Disruption Budget.
const pdb = new k8s.policy.v1.PodDisruptionBudget(`${my_name}-pdb`, {
  //metadata: { namespace: "default",  },
  metadata: { namespace: "default",  },
  spec: {
      minAvailable: 1,
      //maxUnavailable: 3,
      selector: {
          matchLabels: {
              app: "myapp",
          },
      },
  },
}, { dependsOn: [mycluster], provider: k8sprovider}); // Comment out this line after the first run when you are trying to create the issue.
*/
/*
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
      //minAvailable: "100%", // percentage of pods that must remain available
      selector: {
          matchLabels: {
              "app": "example2", // match pods with this label
          },
      },
      //unhealthyPodEvictionPolicy: "NoEviction", // criteria for evicting unhealthy pods (NoEviction, StaticallyKubeletOnly)
  },
}, { dependsOn: [mycluster,mynamespace], provider: k8sProvider });
*/
export const mypdb = pdb.metadata.name;
//export const mypdb2 = pdb2.metadata.name;

