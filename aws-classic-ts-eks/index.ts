import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import * as awsx from "@pulumi/awsx";
import { Namespace } from "@pulumi/kubernetes/core/v1";

const myname = "shaht";

const myvpc = new awsx.ec2.Vpc(`${myname}-vpc`, {
  cidrBlock: "10.0.0.0/24",
  numberOfAvailabilityZones: 3,
  natGateways: { strategy: "Single" },
  tags: { Name: `${myname}-vpc`, owner: "shaht" },
});

const mycluster = new eks.Cluster(`${myname}-eks`, {
  vpcId: myvpc.vpcId,
  skipDefaultNodeGroup: true,
  publicSubnetIds: myvpc.publicSubnetIds,
  privateSubnetIds: myvpc.privateSubnetIds,
  instanceType: "t3a.small",
  version: "1.23",  // Keep this version of the k8s to replicate the bug that customer encounters
  nodeRootVolumeSize: 10,
  encryptRootBlockDevice: true,
  enabledClusterLogTypes: [
    "api",
    "audit",
    "authenticator",
    "controllerManager",
    "scheduler",
  ],
  tags: { Name: `${myname}-eks`, owner: "shaht" },
});

export const myvpc_info = myvpc.vpcId;

const managed_node_group_spot = new eks.ManagedNodeGroup(
  `${myname}-manangednodegroup-spot`,
  {
    cluster: mycluster,
    labels: { managed: "true", spot: "true" },
    subnetIds: myvpc.privateSubnetIds,
    //instanceTypes: ["t3a.micro"], // will NOT work for hpa
    //instanceTypes: ["t3a.large"],  // will NOT work for hpa
    instanceTypes: ["c5.large"],  // Must use c5.large or bigger instance for hpa to work
    capacityType: "SPOT",
    nodeRole: mycluster.instanceRoles.apply((roles) => roles[0]),
    tags: {
      "k8s.cluster-autoscaler/shaht-dev": "owned",
      "k8s.cluster-autoscaler/enabled": "True",
      team: "team-ce",
      environment: "development",
      owner: "shaht",
    },
    scalingConfig: {
      desiredSize: 2,
      minSize: 2,
      maxSize: 8,
    },
  },
  { dependsOn: [myvpc, mycluster] }
);

export const managed_node_group_spot_name = managed_node_group_spot.nodeGroup.id;
  

const k8sprovider = new k8s.Provider(`${myname}-k8sprovider`, {
  kubeconfig: mycluster.kubeconfig,
  enableServerSideApply: true,
});

const mynamespace = new Namespace(
  `${myname}-ns`,
  {},
  { provider: k8sprovider, dependsOn: [mycluster, managed_node_group_spot] }
);

export const cluster_name = mycluster.eksCluster.name;
export const kubeconfig = pulumi.secret(mycluster.kubeconfig);
export const namespace_name = mynamespace.id;

const nginxLabels = { app: "nginx" };

// https://aptakube.com/blog/how-to-fix-failedgeteesourcemetric-hpa Must add limits for the hpa to work
const nginxDeployment = new k8s.apps.v1.Deployment(
  `${myname}-nginx-deployment`,
  {
    metadata: { namespace: mynamespace.metadata.name },
    spec: {
      selector: { matchLabels: nginxLabels },
      replicas: 2,
      template: {
        metadata: { labels: nginxLabels },
        spec: {
          containers: [
            {
              name: "nginx",
              image: "nginx:1.25.1",
              resources: {
                limits: { cpu: "100m", memory: "128Mi" },
              },
              ports: [{ containerPort: 8080 }],
            },
          ],
        },
      },
    },
  },
  { provider: k8sprovider, dependsOn: [mynamespace, managed_node_group_spot] }
);
export const nginx_deployment_name = nginxDeployment.metadata.name;

// This will route traffic to the Deployment pods.
const service = new k8s.core.v1.Service(`${myname}-service`, {
  metadata: { labels: nginxLabels, namespace: mynamespace.metadata.name },
  spec: {
      type: "LoadBalancer",
      ports: [{ port: 8081, targetPort: 8080 }],
      selector: nginxLabels,
  },
}, { provider: k8sprovider, dependsOn: [mynamespace, nginxDeployment] })

export const service_name = service.metadata.name;
export const service_url = service.status.loadBalancer.ingress[0].hostname;

// pre-requisite for hpa
const metricsServer = new k8s.helm.v3.Release(
  `${myname}-metricsserver`,
  {
    chart: "metrics-server",
    version: "3.10.0",
    namespace: "kube-system",
    repositoryOpts: {
      repo: "https://kubernetes-sigs.github.io/metrics-server/",
    },
   },
  { provider: k8sprovider, dependsOn: [mynamespace] }
);

export const metrics_server_name = metricsServer.name;

// kubectl -n shaht-ns-6f984d31 get deploy shaht-nginx-deployment-e1b3d05e --show-managed-fields -o yaml >mystack1withnohpa.yaml
// kubectl -n shaht-ns-6f984d31 get deploy shaht-nginx-deployment-e1b3d05e --show-managed-fields -o yaml >mystack2withhpa.yaml

// HPA, Scaling occurs on cpu and memory utilization
const horizontalpodautoscaler = new k8s.autoscaling.v2.HorizontalPodAutoscaler(
  `${myname}-hpa`,
  {
    metadata: { namespace: mynamespace.metadata.name },
    spec: {
      scaleTargetRef: {
        apiVersion: "apps/v1",
        kind: "Deployment",
        name: nginxDeployment.metadata.name,
      },
       minReplicas: 4, // Comment this line out when testing with hpa and uncomment the next line and run pulumi up the 1st time.
      //minReplicas: 6, // Uncomment this line when testing with hpa and comment out the previous line and run pulumi up the 2nd time to trigger the error.
      maxReplicas: 15,
      metrics: [
         {
          type: "Resource",
          resource: {
              name: "cpu",
              target: {
                  type: "Utilization",
                  averageUtilization: 30,
              },
          },
          
      },
      ],
    },
  },
  { provider: k8sprovider, dependsOn: [mynamespace] }
);

export const horizontalpodautoscaler_name = horizontalpodautoscaler.metadata.name;
