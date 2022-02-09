"""An AWS Python Pulumi program"""

import pulumi
import pulumi_eks as eks
from pulumi import Output, ResourceOptions
from pulumi_kubernetes.core.v1 import Namespace

# Create an EKS cluster with the default configuration.
name = "demo"
mycluster = eks.Cluster(f'{name}-eks',
    version = "1.21",
    instance_type = "t3a.small",
    node_root_volume_encrypted = True,
    )

awslb_namespace = Namespace("awslb-controller-ns")
#awslb_namespace = Namespace("awslb-controller-ns",opts=ResourceOptions(provider=mycluster.provider))

pulumi.export("cluster_name", mycluster.core.cluster.name)
# Export the cluster's kubeconfig.
pulumi.export("kubeconfig", Output.secret(mycluster.kubeconfig))