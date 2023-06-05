import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";

const name = "tusharnolt";

// Create a VPC with 3 public and 3 private subnets with the CIDR block 10.0.0.0/22.
const vpc = new awsx.ec2.Vpc(`${name}-vpc`, {
    cidrBlock: "10.0.0.0/22",
    numberOfAvailabilityZones: 3,
    natGateways: { strategy: "Single"},
    tags: { "Name": `${name}-vpc` },
});


// Create an EKS cluster with a managed node group.
const cluster = new eks.Cluster(`${name}-eks`, {
    vpcId: vpc.vpcId,
    publicSubnetIds: vpc.publicSubnetIds,
    privateSubnetIds: vpc.privateSubnetIds,
    skipDefaultNodeGroup: true,
    instanceType: "t2.small",
    desiredCapacity: 3,
    maxSize: 5,
    version: "1.24",
    encryptRootBlockDevice: true,
    nodeRootVolumeSize: 10,
    enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler", ],
    tags: { "Name": `${name}-eks` },
});

export const cluster_name = cluster.eksCluster.name;
// Export the cluster's kubeconfig.
export const kubeconfig = pulumi.secret(cluster.kubeconfig);
export const mynodeRole = cluster.instanceRoles[0].arn;
// Create a Kubernetes provider using the EKS cluster's kubeconfig.
const k8sprovider = new k8s.Provider(`${name}-k8sprovider`, { kubeconfig });

const managed_node_group = new eks.ManagedNodeGroup(
    `${name}-manangednodegroup`,
    {
      cluster: cluster,
      //capacityType: "SPOT",
      instanceTypes: ["t3a.micro"],
      //nodeRole: cluster.instanceRoles.apply((roles) => roles[0]),
      nodeRoleArn: cluster.instanceRoles[0].arn,
      //nodeRole: roles[0],
      labels: { managed: "true", spot: "true" },
      tags: {
        "Name": `${name}-manangednodegroup`,
        "k8s.cluster-autoscaler/shaht-dev": "owned",
        "k8s.cluster-autoscaler/enabled": "True",
        team: "team-ce",
        environment: "development",
      },
  
      scalingConfig: {
        desiredSize: 3,
        minSize: 2,
        maxSize: 10,
      },
      diskSize: 10,
    },
    { dependsOn: [vpc,cluster]}
  );

export const managed_node_group_name = managed_node_group.nodeGroup.id;
export const managed_node_group_launchtemplate = managed_node_group.nodeGroup;  
export const managed_node_group_version =managed_node_group.nodeGroup.version;
//export const managed_node_group_templateVersion = managed_node_group.nodeGroup.launchTemplateVersion;  


// Create a namespace using the eks cluster's kubeconfig
const mynamespace = new k8s.core.v1.Namespace(
  `${name}-namespace`,
  {},
  { provider: k8sprovider, dependsOn: [cluster] },
);
export const namespace_name = mynamespace.metadata.name;


// Create a Pod Disruption Budget.
const pdb = new k8s.policy.v1.PodDisruptionBudget(`${name}-pdb`, {
    //metadata: { namespace: "default" },
    metadata: { namespace: mynamespace.metadata.name },
    spec: {
      minAvailable: "50%",
      //minAvailable: "100%", // This is an error, minAvailable should be an integer or percentage less than 100.
      //maxUnavailable: "100%",
        //minAvailable: 1,
        //maxUnavailable: 3,
        selector: {
            matchLabels: {
                app: "myapp",
            },
        },
        //unhealthyPodEvictionPolicy: "NoEviction", // criteria for evicting unhealthy pods (NoEviction, StaticallyKubeletOnly)
    },
}, { provider: k8sprovider });

export const pdbname1 = pdb.metadata.name;
export const pdbname1_status = pdb.status;
export const pdbname1_urn= pdb.urn;