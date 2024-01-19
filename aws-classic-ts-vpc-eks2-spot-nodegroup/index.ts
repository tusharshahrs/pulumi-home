import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import * as iam from "./iam";

const config = new pulumi.Config();
const myip = config.get("myipaddress") || "0.0.0.0/0"
const name = "demo";
const roles = iam.createRoles(`${name}-role`, 1);
const instance_profile = iam.createInstanceProfiles(`${name}-instance-profile`, roles);

// Get the AWS region from the pulumi config since we need it for the aws vpc cni helm chart
const awsConfig = new pulumi.Config("aws");

// https://github.com/grafana/k8s-monitoring-helm/blob/main/charts/k8s-monitoring/README.md
// get the grafana auth token from the pulumi config
const grafanaauth = config.requireSecret("GRAFANA_AUTH");
// get the grafana prometheus user from the pulumi config
const grafana_prometheus_user = config.requireSecret("GRAFANA_PROMETHEUS_USERNAME");
// get the grafana loki user from the pulumi config
const grafana_loki_user = config.requireSecret("GRAFANA_LOKI_USERNAME");
// get the grafana tempo user from the pulumi config
const grafana_tempo_user = config.requireSecret("GRAFANA_TEMPO_USERNAME");
// get the kubecost token from the pulumi config
const kubecost_token = config.requireSecret("KUBECOST_TOKEN");


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
          //cidrBlocks:[myip]  // uncomment this line to allow access from your local machine only if you are passing in your static ip address.
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
    //instanceProfileName: instance_profile[0].name,
    instanceRole: roles[0],
    instanceType: "t3a.medium",
    desiredCapacity: 3,
    version: "1.26",
    nodeRootVolumeEncrypted: true,
    nodeRootVolumeSize: 30,
    enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler", ],
    tags: { "Name": `${name}-eks` },
},// {dependsOn: [myvpc]});
     { dependsOn: [eksclustersecuritygroup]});

// Export the cluster name
export const cluster_name = mycluster.eksCluster.name;
// Export the cluster's kubeconfig as a secret (required to be secret).
export const kubeconfig = pulumi.secret(mycluster.kubeconfig);


// Create a managed nodegroup with spot instances.
const managed_node_group = new eks.ManagedNodeGroup(`${name}-manangednodegroup`,
    {
      cluster: mycluster,
      capacityType: "SPOT",
      instanceTypes: ["t3a.large"],
      nodeRole: roles[0],
      //nodeRoleArn: mycluster.instanceRoles[0].arn,
      labels: { managed: "true", spot: "true" },
      tags: {
        "Name": `${name}-manangednodegroup`,
      },
      subnetIds: myvpc.privateSubnetIds,
      scalingConfig: {
        desiredSize: 3,
        minSize: 3,
        maxSize: 8,
      },
      diskSize: 50,
    },
    { parent: mycluster, dependsOn: [mycluster]}
  );

export const managed_node_group_name = managed_node_group.nodeGroup.id;
export const managed_node_group_version =managed_node_group.nodeGroup.version;

// Create a Kubernetes provider using the EKS cluster's kubeconfig. We do this so we can use it easily in k8s namespace and helm chart later
const k8sprovider = new k8s.Provider(`${name}-k8sprovider`, { kubeconfig }, {dependsOn: [managed_node_group] });
const k8sproviderinfo = k8sprovider.id;

// Create a Metrics Namespace
const metrics_namespace = new k8s.core.v1.Namespace(`${name}-metric-ns`, 
  {}, 
  { provider: k8sprovider, dependsOn: [k8sprovider]});

export const namespace_metrics = metrics_namespace.metadata.name;

// Create a Kubecost Namespace
const kubecost_namespace = new k8s.core.v1.Namespace(`${name}-kubecost-ns`, 
  {}, 
  { provider: k8sprovider, dependsOn: [managed_node_group] });

export const namespace_kubecost = kubecost_namespace.metadata.name;


// Creating a helm release for prometheus metrics, loki, tempo, and opencost
// https://github.com/grafana/helm-charts/blob/main/charts/grafana/README.md
const prometheusmetrics = new k8s.helm.v3.Release(`${name}-grafanahelmchart`, {
  chart: "k8s-monitoring",
  version: "0.8.5",
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
}, { provider: k8sprovider, parent: metrics_namespace, dependsOn: [metrics_namespace] });

// Export the prometheus metrics helmrelease name
export const helm_chart_prometheus_metrics = prometheusmetrics.name;


//https://artifacthub.io/packages/helm/deliveryhero/aws-ebs-csi-driver  Required after k8s 1.23
// Install the AWS EBS CSI Driver using a Helm chart.
const awsEbsCsiDriverChart = new k8s.helm.v3.Release(`${name}-awsebscsidriver`, {
  chart: "aws-ebs-csi-driver",
  version: "2.17.1", // Replace with the specific version you want to install
  namespace: "kube-system",
  repositoryOpts: {
      repo: "https://kubernetes-sigs.github.io/aws-ebs-csi-driver/",
  },
  values: {
      // Custom values for the aws-ebs-csi-driver chart can be specified here if needed.
  },
}, { provider: k8sprovider });
// Export the awsebscsidriverchart  name
export const helm_chart_aws_ebs_csi_driver = awsEbsCsiDriverChart.name;

// Creating a helm release for kube cost
// https://github.com/kubecost/cost-analyzer-helm-chart
const kubecostchart = new k8s.helm.v3.Release(`${name}-kubecosthelmchart`, {
  chart: "cost-analyzer",
  version: "1.108.1",
  namespace: kubecost_namespace.metadata.name,
  repositoryOpts: {
      repo: "https://kubecost.github.io/cost-analyzer/",
  },
  values: {
    kubecostToken: kubecost_token,
    networkCosts: {
      enabled: true,
    },
    persistentVolume: {
      size: "18Gi",
      dbSize: "18Gi",
    },
    prometheus: {
      server:{
        retention: "1d",
        global: { external_labels: {cluster_id: mycluster.eksCluster.name}}, // Found in https://github.com/kubecost/cost-analyzer-helm-chart/blob/develop/cost-analyzer/values.yaml#L838
      },
      kubeStateMetrics: {
        enabled: false,
      },
      serviceAccounts: {
        nodeExporter: {
          create: false,
        },
      },
      nodeExporter: {
        enabled: false,
      },
    },
  }
}, { provider: k8sprovider, parent: kubecost_namespace, dependsOn: [awsEbsCsiDriverChart] });

// export the kubecost helmrelease name
export const helm_chart_kubecost = kubecostchart.name;