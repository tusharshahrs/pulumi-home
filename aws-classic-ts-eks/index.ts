import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import { Namespace } from "@pulumi/kubernetes/core/v1";

const name = "demo"
const mycluster = new eks.Cluster(`${name}-eks`, {
    instanceType: "t3a.micro",
    version: "1.21",
    nodeRootVolumeSize: 10,
    encryptRootBlockDevice: true, 
});

const awslb_namespace = new Namespace("awslb-controller-ns",{}, {provider: mycluster.provider});

export const cluster_name = mycluster.eksCluster.name;
export const kubeconfig = pulumi.secret(mycluster.kubeconfig);
export const awslb_namespace_name = awslb_namespace.id;