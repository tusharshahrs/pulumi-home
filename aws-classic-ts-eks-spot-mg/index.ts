import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as iam from "./iam";
import * as k8s from "@pulumi/kubernetes";

// Create 3 IAM Roles and matching InstanceProfiles to use with the nodegroups.
const my_name = `shaht`;
const roles = iam.createRoles(my_name, 1);
const instanceProfiles = iam.createInstanceProfiles(my_name, roles);

const myvpc = new awsx.ec2.Vpc(`${my_name}-vpc`, {
    numberOfAvailabilityZones: 3,
    natGateways: { strategy: "Single"},
    tags: { "Name": `${my_name}-vpc` },
});

const mycluster = new eks.Cluster(`${my_name}-eks`, {
    skipDefaultNodeGroup: true,
    vpcId: myvpc.vpcId,
    publicSubnetIds: myvpc.publicSubnetIds,
    privateSubnetIds: myvpc.privateSubnetIds,
    instanceType: "t3a.small",
    version: "1.21",
    nodeRootVolumeSize: 10,
    instanceRole: roles[0],
    encryptRootBockDevice: true,
    enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler"],
}, {dependsOn: myvpc}
);

const managed_node_group_spot = new eks.ManagedNodeGroup(`${my_name}-manangednodegroup-spot`, {
    cluster: mycluster,
    capacityType: "SPOT",
    instanceTypes: ["t3a.micro"],
    nodeRole: roles[0],
    labels: {"managed":"true", "spot":"true"},
    tags: {
        "k8s.cluster-autoscaler/shaht-dev":"owned",
        "k8s.cluster-autoscaler/enabled":"True",
        "team":"rabbitdig",
        //"enviroment":"development"
        "environment":"development"
    },
    
    scalingConfig: {
                    desiredSize: 2, 
                    minSize: 1, 
                    maxSize:10
                   },
    diskSize: 10,
},{dependsOn: [myvpc]})

const k8sProvider = new k8s.Provider(`${my_name}-k8sprovider`, {
    kubeconfig: mycluster.kubeconfig,}
);

const namespace = new k8s.core.v1.Namespace(`${my_name}-namespace`,{},

    {  provider: k8sProvider, dependsOn: [mycluster]},);


const foobarcrd  = new k8s.apiextensions.v1beta1.CustomResourceDefinition(`${my_name}-foobarcrd`, {
//const foobarcrd  = new k8s.apiextensions.v1.CustomResourceDefinition(`${my_name}-foobarcrd`, {
            metadata: { name: "foobars.stable.example.com" },
            spec: {
                group: "stable.example.com",
                versions: [
                    {
                        name: "v1",
                        served: true,
                        storage: true,
                        /*schema: {
                            openAPIV3Schema: {
                                type: "object",
                                /*properties: {
                                    spec: {
                                        type: "object",
                                        properties: {
                                            foo: {
                                                type: "string",
                                            },
                                            bar: {
                                                type: "string",
                                            },
                                        },
                                    }
                                }*/
                            //}
                        //}
                    }
                ],
                scope: "Namespaced",
                names: {
                    plural: "foobars",
                    singular: "foobar",
                    kind: "FooBar",
                    shortNames: ["fb"]
                }
            }
        },
        //{ provider: k8sProvider, dependsOn: [namespace, mycluster]});
        { provider: k8sProvider, dependsOn: [namespace, mycluster], import: "foobars.stable.example.com"});
       


export const cluster_name = mycluster.eksCluster.name;
export const managed_nodegroup_capacitytype = managed_node_group_spot.nodeGroup.capacityType;
export const cluster_verion = mycluster.eksCluster.version;
export const kubeconfig = pulumi.secret(mycluster.kubeconfig);
export const my_namespace = namespace.metadata.name;
export const my_crd = foobarcrd.metadata.name;