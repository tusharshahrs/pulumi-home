"""An AWS Python Pulumi program"""
import pulumi_aws as aws
import pulumi_eks as eks
from pulumi import export, Output, ResourceOptions, get_stack, get_project
import iam
import vpc
from pulumi_kubernetes.core.v1 import Namespace
from pulumi_kubernetes.helm.v3 import Release, ReleaseArgs, RepositoryOptsArgs

# create an iam role for eks
role0 = iam.create_role("demo-py-role0")

# generic tags across cluster
mytags ={"project_name":get_project(), "stack_name":get_stack()}

# Create an EKS cluster.
mycluster = eks.Cluster("demo-py-eks",
            skip_default_node_group = True,
            instance_type = "t3a.medium",
            version = "1.21",
            node_root_volume_size = 10,
            instance_roles=[role0],
            encrypt_root_block_device = True,
            desired_capacity=2,
            min_size=2,
            max_size=6,
            enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"],
            tags = mytags,
            vpc_id =vpc.vpc.id,
            public_subnet_ids = vpc.public_subnet_ids,
            private_subnet_ids = vpc.private_subnet_ids,
            )

# spot managed node group to save cost
managed_nodegroup_spot_0 = eks.ManagedNodeGroup("demo-py-managed-nodegroup-spot-ng0",
   cluster=mycluster.core, # TODO[pulumi/pulumi-eks#483]: Pass cluster directly.
   capacity_type = "SPOT",
   instance_types=["t3a.medium"],
   scaling_config=aws.eks.NodeGroupScalingConfigArgs(
      desired_size=3,
      min_size=2,
      max_size=8,
   ),
   node_role=role0,
   opts=ResourceOptions(depends_on=[mycluster])
   )

# Creatinga namespace
namespace = Namespace("awslbcontroller-ns",
                      opts=ResourceOptions(depends_on=[mycluster], provider=mycluster.provider))

# Helm Release: https://www.pulumi.com/registry/packages/kubernetes/api-docs/helm/v3/release/
release_args = ReleaseArgs(
    chart="aws-load-balancer-controller",
    repository_opts=RepositoryOptsArgs(
        repo="https://aws.github.io/eks-charts"
    ),
    version="1.3.2",
    namespace=namespace.metadata["name"],
    values={
        "clusterName": mycluster.core,
        },
    # By default Release resource will wait till all created resources
    # are available. Set this to true to skip waiting on resources being
    # available.
    skip_await=False)   

release = Release("aws-load-balancer-controller", args=release_args, opts=ResourceOptions(parent=namespace, provider=mycluster.provider))
status = release.status

export("vpcname", vpc.vpc.id)
export("cluster_name", mycluster.core.cluster.name)
export("managed_nodegroup_name", managed_nodegroup_spot_0.node_group.node_group_name)
export("managed_nodegroup_capacity_type", managed_nodegroup_spot_0.node_group.capacity_type)
export("managed_nodegroup_version", managed_nodegroup_spot_0.node_group.version)
export("kubeconfig", Output.secret(mycluster.kubeconfig))
export("k8s_namespace", namespace.id)
export("k8s_chart",status["chart"])
export("k8s_chart_app_version",status["app_version"])