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
const grafanaauth = config.getSecret("GRAFANA_AUTH");
// get the grafana prometheus user from the pulumi config
const grafana_prometheus_user = config.getSecret("GRAFANA_PROMETHEUS_USERNAME");
// get the grafana loki user from the pulumi config
const grafana_loki_user = config.getSecret("GRAFANA_LOKI_USERNAME");
// get the grafana tempo user from the pulumi config
const grafana_tempo_user = config.getSecret("GRAFANA_TEMPO_USERNAME");

// Create a VPC with 3 public and 3 private subnets with the CIDR block 10.0.0.0/22.
const vpc = new awsx.ec2.Vpc(`${name}-vpc`, {
    cidrBlock: "10.0.0.0/23",
    numberOfAvailabilityZones: 3,
    natGateways: { strategy: "Single"},
    tags: { "Name": `${name}-vpc` },
});

export const vpc_id = vpc.vpcId;
export const public_subnet_ids = vpc.publicSubnetIds;
export const private_subnet_ids = vpc.privateSubnetIds;

const eksclustersecuritygroup = new aws.ec2.SecurityGroup(`${name}-eksclustersg`, {
  vpcId: vpc.vpcId,
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
          description: "Ingress to self cluster.  ",
          protocol: "-1",
          fromPort: 0,
          toPort: 0,
          //self: true, // This allows us to call the securitygroup itself as a source
          cidrBlocks:[myip]
      },
    ],
  });

export const eksclustersecuritygroup_id = eksclustersecuritygroup.name;


// Create an EKS cluster with a managed node group.
const cluster = new eks.Cluster(`${name}-eks`, {
    vpcId: vpc.vpcId,
    publicSubnetIds: vpc.publicSubnetIds,
    privateSubnetIds: vpc.privateSubnetIds,
    skipDefaultNodeGroup: true,
    clusterSecurityGroup: eksclustersecuritygroup,
    instanceType: "t3a.nano",    
    desiredCapacity: 2,
    version: "1.26",
    nodeRootVolumeEncrypted: true,
    nodeRootVolumeSize: 10,
    enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler", ],
    tags: { "Name": `${name}-eks` },
});

export const cluster_name = cluster.eksCluster.name;
// Export the cluster's kubeconfig.
export const kubeconfig = pulumi.secret(cluster.kubeconfig);


const managed_node_group = new eks.ManagedNodeGroup(`${name}-manangednodegroup`,
    {
      cluster: cluster,
      capacityType: "SPOT",
      instanceTypes: ["t3a.small"],
      //securityGroupIds: [eksclustersecuritygroup.id],
      nodeRoleArn: cluster.instanceRoles[0].arn,
      labels: { managed: "true", spot: "true" },
      tags: {
        "Name": `${name}-manangednodegroup`,
      },
      subnetIds: vpc.privateSubnetIds,
      scalingConfig: {
        desiredSize: 3,
        minSize: 2,
        maxSize: 8,
      },
      diskSize: 20,
    },
    { dependsOn: [vpc,cluster]}
  );

// Create a Kubernetes provider using the EKS cluster's kubeconfig. We do this so we can use it easily in k8s
const k8sprovider = new k8s.Provider(`${name}-k8sprovider`, { kubeconfig });
const k8sproviderinfo = k8sprovider.id;

// Create a Kubernetes Namespace
const namespace = new k8s.core.v1.Namespace(`${name}-metric-ns`, {}, { provider: k8sprovider });
export const metrics_ns = namespace.metadata.name;

export const managed_node_group_name = managed_node_group.nodeGroup.id;
export const managed_node_group_version =managed_node_group.nodeGroup.version;


const prometheusmetrics = new k8s.helm.v3.Release(`${name}-grafanak8smonitoring`, {
  chart: "k8s-monitoring",
  version: "0.8.3",
  namespace: namespace.metadata.name,
  repositoryOpts: {
      repo: "https://grafana.github.io/helm-charts",
  },
  values: {
    cluster: { name: cluster.eksCluster.name },
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
        defaultClusterId: cluster.eksCluster.name,
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
}, { provider: k8sprovider });

export const prometheus_metrics_helmrelease_name = prometheusmetrics.name;