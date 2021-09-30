"""An AWS Python Pulumi program"""
import pulumi
import pulumi_aws as aws
import pulumi_eks as eks
from pulumi import export, Output, ResourceOptions, Config, StackReference, get_stack, get_project
import iam
import vpc

role0 = iam.create_role("demo-py-role0")
mytags ={"project_name":get_project(), "stack_name":get_stack()}

#my_vpc_id = vpc.vpc.id
#export("my_vpcname", my_vpc_id)

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

export("cluster_name", mycluster.core.cluster.name)
export("managed_nodegroup_name", managed_nodegroup_spot_0.node_group.node_group_name)
export("managed_nodegroup_capacity_type", managed_nodegroup_spot_0.node_group.capacity_type)
export("managed_nodegroup_version", managed_nodegroup_spot_0.node_group.version)
export("kubeconfig", Output.secret(mycluster.kubeconfig))