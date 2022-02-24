import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import { Namespace } from "@pulumi/kubernetes/core/v1";

const name = "democert"
const mycluster = new eks.Cluster(`${name}-eks`, {
    instanceType: "t3a.micro",
    version: "1.19",
    nodeRootVolumeSize: 10,
    encryptRootBlockDevice: true, 
});

const k8sProvider = new k8s.Provider(`${name}-k8sprovider`, {
	kubeconfig: mycluster.kubeconfig,
	enableDryRun: true
});

const certmanager_namespace = new Namespace("certmanager-ns",{}, {provider: k8sProvider});

const certManager = new k8s.helm.v3.Release(
	`${name}-certmanager`,
	{
		chart: 'cert-manager',
		version: "1.7.1",
		repositoryOpts: {
			repo: "https://charts.jetstack.io/"
		},
		namespace: certmanager_namespace.metadata.name,
		values: {
			global: {
				imagePullSecrets: [{ name: 'dockerhubcred' }]
			},
			serviceAccount: {
				create: true
			}
		},
		skipAwait: false,
		skipCrds: true,
        timeout: 300
	},
	{
		provider: k8sProvider,
	}
);

export const cluster_name = mycluster.eksCluster.name;
export const kubeconfig = pulumi.secret(mycluster.kubeconfig);
export const k8sProvider_name = k8sProvider.id;
export const certmanager_namespace_name = certmanager_namespace.id;

