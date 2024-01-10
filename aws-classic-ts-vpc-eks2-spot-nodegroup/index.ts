import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import * as grafana from "@lbrlabs/pulumi-grafana";

const config = new pulumi.Config();
const myip = config.get("myipaddress") || "0.0.0.0/0"
const name = "demo";

// https://github.com/grafana/k8s-monitoring-helm/blob/main/charts/k8s-monitoring/README.md
// get the grafana auth token from the pulumi config
const grafanaauth = config.requireSecret("GRAFANA_AUTH");
// get the grafana prometheus user from the pulumi config
const grafana_prometheus_user = config.requireSecret("GRAFANA_PROMETHEUS_USERNAME");
// get the grafana loki user from the pulumi config
const grafana_loki_user = config.requireSecret("GRAFANA_LOKI_USERNAME");
// get the grafana tempo user from the pulumi config
const grafana_tempo_user = config.requireSecret("GRAFANA_TEMPO_USERNAME");

// Create a VPC with 3 public and 3 private subnets with the CIDR block 10.0.0.0/22.
const myvpc = new awsx.ec2.Vpc(`${name}-vpc`, {
    cidrBlock: "10.0.0.0/23",
    numberOfAvailabilityZones: 3,
    natGateways: { strategy: "Single"}, // Only using a single nat gateway to save costs
    tags: { "Name": `${name}-vpc` },
});

export const vpc_id = myvpc.vpcId;
export const public_subnet_ids = myvpc.publicSubnetIds;
export const private_subnet_ids = myvpc.privateSubnetIds;


const eksclustersecuritygroup = new aws.ec2.SecurityGroup(`${name}-eksclustersg`, {
  vpcId: myvpc.vpcId,
  revokeRulesOnDelete: true,
  description: "EKS created security group created by code.",
  tags: { "Name": `${name}-eksclustersg` },
  egress: [{
      description: "Allow outbound internet access",
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
  }],
  ingress: [
      {
          description: "Ingress to self cluster.",
          protocol: "-1",
          fromPort: 0,
          toPort: 0,
          // This allows us to call the securitygroup itself as a source // 
          self: true,          // Comment this out if you need access to the nodegroup from your local machine and 
          cidrBlocks:[myip]  // uncomment this line to allow access from your local machine.
      },
    ],
  }, {parent: myvpc, dependsOn: [myvpc] });

// The name of the security group
const eksclustersecuritygroup_id = eksclustersecuritygroup.name;


// Create an EKS cluster with a managed node group.
const mycluster = new eks.Cluster(`${name}-eks`, {
    vpcId: myvpc.vpcId,
    publicSubnetIds: myvpc.publicSubnetIds,
    privateSubnetIds: myvpc.privateSubnetIds,
    skipDefaultNodeGroup: true,
    clusterSecurityGroup: eksclustersecuritygroup,
    instanceType: "t3a.small",    
    desiredCapacity: 2,
    version: "1.26",
    nodeRootVolumeEncrypted: true,
    nodeRootVolumeSize: 10,
    enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler", ],
    tags: { "Name": `${name}-eks` },
}, {dependsOn: [myvpc]});

export const cluster_name = mycluster.eksCluster.name;
// Export the cluster's kubeconfig as a secret (required to be secret).
export const kubeconfig = pulumi.secret(mycluster.kubeconfig);


// Create a managed nodegroup with spot instances.
const managed_node_group = new eks.ManagedNodeGroup(`${name}-manangednodegroup`,
    {
      cluster: mycluster,
      capacityType: "SPOT",
      instanceTypes: ["t3a.medium"],
      nodeRoleArn: mycluster.instanceRoles[0].arn,
      labels: { managed: "true", spot: "true" },
      tags: {
        "Name": `${name}-manangednodegroup`,
      },
      subnetIds: myvpc.privateSubnetIds,
      scalingConfig: {
        desiredSize: 3,
        minSize: 2,
        maxSize: 8,
      },
      diskSize: 20,
    },
    { parent: mycluster, dependsOn: [mycluster]}
  );

// Create a Kubernetes provider using the EKS cluster's kubeconfig. We do this so we can use it easily in k8s namespace and helm chart later
const k8sprovider = new k8s.Provider(`${name}-k8sprovider`, { kubeconfig });
const k8sproviderinfo = k8sprovider.id;

// Create a Kubernetes Namespace
const metrics_namespace = new k8s.core.v1.Namespace(`${name}-metric-ns`, 
  {}, 
  { provider: k8sprovider, parent: managed_node_group, dependsOn: [managed_node_group] });

export const metrics_ns = metrics_namespace.metadata.name;

export const managed_node_group_name = managed_node_group.nodeGroup.id;
export const managed_node_group_version =managed_node_group.nodeGroup.version;


// Creating a helm release for prometheus metrics, loki, tempo, and opencost
const prometheusmetrics = new k8s.helm.v3.Release(`${name}-grafanak8smonitoring`, {
  chart: "k8s-monitoring",
  version: "0.8.3",
  namespace: metrics_namespace.metadata.name,
  repositoryOpts: {
      repo: "https://grafana.github.io/helm-charts",
  },
  values: {
    cluster: { name: mycluster.eksCluster.name },
    externalServices: {
          prometheus: {
            host: "https://prometheus-prod-13-prod-us-east-0.grafana.net",
            basicAuth: {
              username: grafana_prometheus_user,
              password: grafanaauth,
            },
          },
          loki: {
            host: "https://logs-prod-006.grafana.net",
            basicAuth: {
              username: grafana_loki_user,
              password: grafanaauth,
            },
          },
          tempo: {
            host: "https://tempo-prod-04-prod-us-east-0.grafana.net",
            basicAuth: {
              username: grafana_tempo_user,
              password: grafanaauth,
            },
          },
    },
  opencost: {
    opencost: {
      exporter: {
        defaultClusterId: mycluster.eksCluster.name,
      },
      prometheus: {
        external: {
          url: "https://prometheus-prod-13-prod-us-east-0.grafana.net/api/prom",
        },
      },
    },
  },
  traces: {
    enabled: true,
  },
},
}, { provider: k8sprovider, parent: metrics_namespace, dependsOn: [metrics_namespace, managed_node_group] });

// Export the prometheus metrics helmrelease name
export const prometheus_metrics_helmrelease_name = prometheusmetrics.name;
