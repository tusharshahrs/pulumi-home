"""An AWS Python Pulumi program"""

import pulumi
import pulumi_eks as eks
from pulumi import Output, ResourceOptions
from pulumi_kubernetes.core.v1 import Namespace
from pulumi_kubernetes import Provider
import pulumi_kubernetes as k8s

# Create an EKS cluster with the default configuration.
name = "demo"
mycluster = eks.Cluster(f'{name}-eks',
    version = "1.21",
    instance_type = "t3a.small",
    )

k8s_provider = Provider("mycluster_provider",kubeconfig=mycluster.kubeconfig)
awslb_ns = k8s.core.v1.Namespace("awslb-controller-ns", opts=ResourceOptions(provider=k8s_provider))

pulumi.export("cluster_name", mycluster.core.cluster.name)
# Export the cluster's kubeconfig.
pulumi.export("kubeconfig", Output.secret(mycluster.kubeconfig))
pulumi.export("aws-lb-namespace",awslb_ns.id)

#awslb_ns_broken = k8s.core.v1.Namespace("awslb-ns-maybebroken", opts=ResourceOptions(provider=mycluster.provider))