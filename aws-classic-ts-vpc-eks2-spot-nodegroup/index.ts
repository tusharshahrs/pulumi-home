import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import * as iam from "./iam";
import exp = require("constants");

const config = new pulumi.Config();
const myip = config.get("myipaddress") || "0.0.0.0/0"
const name = "shaht";
const roles = iam.createRoles(`${name}-role`, 1);
const instance_profile = iam.createInstanceProfiles(`${name}-instance-profile`, roles);

// Get the AWS region from the pulumi config since we need it for the aws vpc cni helm chart
const awsConfig = new pulumi.Config("aws");
const awsRegion = awsConfig.require("region");

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

// Create a security group for the EKS cluster.
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
    instanceType: "t3a.small",
    desiredCapacity: 3,
    version: "1.29",
    nodeRootVolumeEncrypted: true,
    nodeRootVolumeSize: 40,
    enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler", ],
    tags: { "Name": `${name}-eks`},
    createOidcProvider: true,
},// {dependsOn: [myvpc]});
     { parent: eksclustersecuritygroup, dependsOn: [eksclustersecuritygroup]});

// Export the cluster name
export const cluster_name = mycluster.eksCluster.name;
// Export the cluster's kubeconfig as a secret (required to be secret).
export const kubeconfig = pulumi.secret(mycluster.kubeconfig);

// Not needed after pulumi-eks 2.2.1 where the vpc cni is upgraded to v1.16.0 via a config map
//export const cluster_oidc_arn = mycluster.core.oidcProvider?.arn;
//export const cluster_oidc_url = mycluster.core.oidcProvider?.url;

// OIDC with apply. https://www.linkedin.com/pulse/how-enable-network-policies-eks-using-aws-vpc-cni-plugin-engin-diri/
// Had to use interpolate because of the ? in the url and arn part below.

// OIDC with apply for cluster autoscaler
const cluster_oidc_arn = pulumi.interpolate`${mycluster.core.oidcProvider?.arn}`;
const cluster_oidc_url = pulumi.interpolate`${mycluster.core.oidcProvider?.url}`;

// Create a policy document to allow the cluster autoscaler to scale
// STEP 3: Create IAM OIDC provider
const assumerolewithwebidentity = pulumi.all([cluster_oidc_arn, cluster_oidc_url])
    .apply(([arn, url]) =>
        aws.iam.getPolicyDocumentOutput({
            statements: [{
                effect: "Allow",
                actions: ["sts:AssumeRoleWithWebIdentity"],
                principals: [
                    {
                        type: "Federated",
                        identifiers: [
                            arn,
                        ],
                    },
                ],
                conditions: [
                    {
                        test: "StringEquals",
                        variable: `${url.replace('https://', '')}:sub`,
                        //values: ["system:serviceaccount:kube-system:cluster-autoscaler"],cluster-autoscaler-aws-cluster-autoscaler
                        // https://github.com/kubernetes/autoscaler/issues/4922#issuecomment-1380157352
                        values: ["system:serviceaccount:kube-system:cluster-autoscaler-aws-cluster-autoscaler"],
                    },
                    {
                        test: "StringEquals",
                        variable: `${url.replace('https://', '')}:aud`,
                        values: ["sts.amazonaws.com"],
                    }
                ],
            }],
        })
    );
  
export const assumerolewithwebidentityjson = pulumi.secret(assumerolewithwebidentity.json);

    //STEP 4: Create IAM policy
    const AmazonEKSClusterAutoscalerjson= `{
      "Version": "2012-10-17",
      "Statement": [
          {
              "Action": [
                  "autoscaling:DescribeAutoScalingGroups",
                  "autoscaling:DescribeAutoScalingInstances",
                  "autoscaling:DescribeLaunchConfigurations",
                  "autoscaling:DescribeTags",
                  "autoscaling:SetDesiredCapacity",
                  "autoscaling:TerminateInstanceInAutoScalingGroup",
                  "ec2:DescribeLaunchTemplateVersions"
              ],
              "Resource": "*",
              "Effect": "Allow"
          }
      ]
    }`
  
  // Create IAM policy to let users view nodes and workloads for all clusters in the AWS Management Console
  // Give it a name AmazonEKSClusterAutoscalerPolicy.
  const AmazonEKSClusterAutoscalerpolicy= new aws.iam.Policy("AmazonEKSClusterAutoscalerPolicy", {
      description: "Allows CA to increase or decrease the number of nodes in the cluster.",
      path: "/",
      policy: `${AmazonEKSClusterAutoscalerjson}`,
  });    

    // Create the role for the cluster autoscaler
    const clusterautoscaleRole = new aws.iam.Role(`${name}-clusterautoscalerRole`, {
      assumeRolePolicy: assumerolewithwebidentity.json,
      description: "Allows the cluster autoscaler to access AWS resources on your behalf.",
      managedPolicyArns: [AmazonEKSClusterAutoscalerpolicy.arn],
      tags: { "Name": `${name}-clusterautoscalerRole` },
    });
  

// kubectl -n kube-system describe ds aws-node  | grep amazon-k8s-cni: | cut -d : -f 3
// Not needed after pulumi-eks 2.2.1 where this is upgraded to v1.16.0 via a config map
// Version you need to use for the vpc-cni addon https://docs.aws.amazon.com/eks/latest/userguide/managing-vpc-cni.html
// https://www.linkedin.com/pulse/how-enable-network-policies-eks-using-aws-vpc-cni-plugin-engin-diri/
// create the vpc cni addon, need to use the specific version for 1.25 and above
/*
const vpcCniAddon = new aws.eks.Addon(`${name}-amazon-vpc-cni-addon`, {
  clusterName: mycluster.eksCluster.name,
  addonName: "vpc-cni",
  addonVersion: "v1.16.0-eksbuild.1",  // Specific to 1.26
  resolveConflictsOnCreate: "OVERWRITE", 
  configurationValues: pulumi.jsonStringify({
  }),
  serviceAccountRoleArn: vpcRoleCniRole.arn,
}, {dependsOn: [mycluster]});

export const vpcCniAddonName = vpcCniAddon.addonName;
*/

// https://docs.kubecost.com/install-and-configure/advanced-configuration/cluster-controller#eks-setup
//STEP 1: Create an eks speciic permission

const KubeCost_ClusterController_EKS_POLICY= `{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Effect": "Allow",
          "Action": [
              "eks:ListClusters",
              "eks:DescribeCluster",
              "eks:DescribeNodegroup",
              "eks:ListNodegroups",
              "eks:CreateNodegroup",
              "eks:UpdateClusterConfig",
              "eks:UpdateNodegroupConfig",
              "eks:DeleteNodegroup",
              "eks:ListTagsForResource",
              "eks:TagResource",
              "eks:UntagResource"
          ],
          "Resource": "*"
      },
      {
          "Effect": "Allow",
          "Action": [
              "iam:GetRole",
              "iam:ListAttachedRolePolicies",
              "iam:PassRole"
          ],
          "Resource": "*"
      }
  ]
}`

// Create IAM policy for kube cost controller.  Attach json to the policy
const kubecostcontrollerpolicy = new aws.iam.Policy(`${name}-KubeCostClusterControllerEKSPOLICY`, {
  description: "Allows KubeCostController to turn on and off resources in cluster.",
  path: "/",
  policy: `${KubeCost_ClusterController_EKS_POLICY}`,
});

export const kubecostcontroller_iampolicy = kubecostcontrollerpolicy.name;

// Create an IAM User
const kubecostcontrolleruser = new aws.iam.User(`${name}-kubecostcontrolleruser`, {
  tags: { "Name": `${name}-kubecostcontrolleruser` },
},)

export const kubecostcontrolleriamuser = kubecostcontrolleruser.name;

// Create an IAM User Policy Attachment
const kubecostcontrolleruserpa = new aws.iam.PolicyAttachment(`${name}-kubecostcontrolleruserpolicyattachment`, {
  policyArn: kubecostcontrollerpolicy.arn,
  users: [kubecostcontrolleruser.name],
});

export const kubecostcontrolleruserpa_id = kubecostcontrolleruserpa.id;

// Create an IAM User Policy Attachment for the managed policy
const kubecostcontrollerusermanagedpolicyattachment = new aws.iam.PolicyAttachment(`${name}-kubecostcontrollerusermanagedpolicyattachment`, {
  policyArn: "arn:aws:iam::aws:policy/AutoScalingFullAccess",
  users: [kubecostcontrolleruser.name],
});

export const kubecostcontrollerusermanagedpolicyattachment_id = kubecostcontrollerusermanagedpolicyattachment.id;

// Create a managed nodegroup with spot instances.
const managed_node_group = new eks.ManagedNodeGroup(`${name}-manangednodegroup`,
    {
      cluster: mycluster,
      capacityType: "SPOT",
      instanceTypes: ["t3a.medium"],
      nodeRole: roles[0],
      labels: { managed: "true", spot: "true" },
      tags: {
        "Name": `${name}-manangednodegroup`,
      },
      subnetIds: myvpc.privateSubnetIds,
      scalingConfig: {
        desiredSize: 3,
        minSize: 3,
        maxSize: 12,
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
}, { provider: k8sprovider, dependsOn: [k8sprovider]});
// Export the awsebscsidriverchart  name
export const helm_chart_aws_ebs_csi_driver = awsEbsCsiDriverChart.name;


// Create a Metrics Namespace
const metrics_namespace = new k8s.core.v1.Namespace(`${name}-metric-ns`, 
  {}, 
  { provider: k8sprovider, dependsOn: [k8sprovider]});

export const namespace_metrics = metrics_namespace.metadata.name;

// Creating a helm release for metrics server
// https://artifacthub.io/packages/helm/metrics-server/metrics-server
const metrics_server = new k8s.helm.v3.Release(`${name}-metrics-server-helm`, {
  chart: "metrics-server",
  version: "3.12.1",
  namespace: metrics_namespace.metadata.name,
  repositoryOpts: {
      repo: "https://kubernetes-sigs.github.io/metrics-server/",
  },
  values: {
  }
}, //{ provider: k8sprovider, parent: prometheusmetrics_k8s_monitoring, dependsOn: [prometheusmetrics_k8s_monitoring] });
{ provider: k8sprovider, parent: metrics_namespace, dependsOn: [metrics_namespace] });

// export the metrics server helmrelease name
export const helm_chart_metrics_server = metrics_server.name;
// Create a Grafana k8s-monitoring Namespace
const grafana_k8s_monitoring_namespace = new k8s.core.v1.Namespace(`${name}-k8smonitoring-ns`, 
  {}, 
  { provider: k8sprovider, dependsOn: [k8sprovider]});

export const namespace_grafana_k8s_monitoring = grafana_k8s_monitoring_namespace.metadata.name;

// Creating a helm release for prometheus metrics, loki, tempo, and opencost
// https://github.com/grafana/helm-charts/blob/main/charts/grafana/README.md
// https://artifacthub.io/packages/helm/prometheus-community/prometheus
// https://github.com/grafana/k8s-monitoring-helm/tree/main/charts/k8s-monitoring

const grafana_k8s_monitoring = new k8s.helm.v3.Release(`${name}-k8smonitoring-helm`, {
  chart: "k8s-monitoring",
  version: "1.5.0",
  namespace: grafana_k8s_monitoring_namespace.metadata.name,
  repositoryOpts: {
      repo: "https://grafana.github.io/helm-charts/",
      //repo: "https://prometheus-community.github.io/helm-charts/",
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
}, { provider: k8sprovider, deleteBeforeReplace: true , parent: grafana_k8s_monitoring_namespace, dependsOn: [grafana_k8s_monitoring_namespace] });
// Added deleteBeforeReplace: true to fix the issue with the helm chart not updating correctly: https://github.com/pulumi/pulumi-kubernetes/issues/2758 v3.helm.Release error: cannot re-use a name that is still in use

// Export the grafana k8s monitoring helmrelease name
export const helm_chart_grafana_k8s_monitoring = grafana_k8s_monitoring.name;

// Creating a helm release for cluster autoscaler
// https://artifacthub.io/packages/helm/cluster-autoscaler/cluster-autoscaler#aws---using-auto-discovery-of-tagged-instance-groups
// Best instructions: https://www.kubecost.com/kubernetes-autoscaling/kubernetes-cluster-autoscaler/
// https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/CA_with_AWS_IAM_OIDC.md#change-2
// requires oidc, 
//          namespace: "kube-system", // required otherwise it will not show up in the cluster`
//         `name: "cluster-autoscaler", // required otherwise it will not show up in the cluster`
//         `labels: {"k8s-addon":"cluster-autoscaler.addons.k8s.io","k8s-app":"cluster-autoscaler"}, // critical part, need this for it to show up`
//         `"eks.amazonaws.com/role-arn": clusterautoscaleRole.arn,`

// Need the below for cluster autoscaler to pick up the nodegroups
const nodegroupautodiscovery = pulumi.interpolate`asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/${mycluster.eksCluster.name}`;

const cluster_autoscaler = new k8s.helm.v3.Release(`${name}-cluster-autoscaler`, {
  chart: "cluster-autoscaler",
  version: "9.37.0",
  namespace: "kube-system", // required otherwise it will not show up in the cluster
  name: "cluster-autoscaler", // avoiding autonaming to help on troubleshooting
  repositoryOpts: {
      repo: "https://kubernetes.github.io/autoscaler",
  },
  values: {
    autoDiscovery: {
                    cluster_name: mycluster.eksCluster.name,
                    labels: {"k8s-addon":"cluster-autoscaler.addons.k8s.io","k8s-app":"cluster-autoscaler"}, // critical part, need this for it to show up
                   },
    awsRegion: awsRegion,
    rbac: {
    //        // Define the service account and associate the IAM role with cluster-autoscaler
            serviceAccount: {
                create: true,
                annotations: {
                    "eks.amazonaws.com/role-arn": clusterautoscaleRole.arn,
                },
            },
        },
    extraArgs: {
      "balance-similar-node-groups": true,
      "skip-nodes-with-system-pods": false,
      "expander": "least-waste",
      "node-group-auto-discovery": nodegroupautodiscovery,
      //"node-group-auto-discovery": "asg:tag=k8s.io/cluster-autoscaler/enabled", // Worked, part 1
    },
    servieMonitor: {namespace: grafana_k8s_monitoring_namespace.metadata.name},
    prometheusRule: {namespace: grafana_k8s_monitoring_namespace.metadata.name },	
  }
},
{ provider: k8sprovider, parent: grafana_k8s_monitoring_namespace, dependsOn: [grafana_k8s_monitoring_namespace] });

// export the cluster autoscaler helmrelease name
export const helm_chart_cluster_autoscaler = cluster_autoscaler.name;



// Create a Kubecost Namespace
const kubecost_namespace = new k8s.core.v1.Namespace(`${name}-kubecost-ns`, 
  {}, 
  { provider: k8sprovider, dependsOn: [managed_node_group] });

export const namespace_kubecost = kubecost_namespace.metadata.name;

// Creating a helm release for kube cost
// https://github.com/kubecost/cost-analyzer-helm-chart
const kubecostchart = new k8s.helm.v3.Release(`${name}-kubecost-helm`, {
  chart: "cost-analyzer",
  version: "2.3.5",
  namespace: kubecost_namespace.metadata.name,
  repositoryOpts: {
      repo: "https://kubecost.github.io/cost-analyzer/",
  },
  values: {
    clusterController: {enabled: true},
    kubecostToken: kubecost_token,
    networkCosts: {
      enabled: true,
    },
    //persistentVolume: {
    //  size: "18Gi",
    //  dbSize: "18Gi",
    //},
    prometheus: {
      server:{
        retention: "3d", // 1d works for 2.1.0. starting with 2.2.1, it now needs to be 3d   
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
}, { provider: k8sprovider, deleteBeforeReplace: true, parent: kubecost_namespace, dependsOn: [kubecost_namespace]});

// export the kubecost helmrelease name
export const helm_chart_kubecost = kubecostchart.name;
