import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as k8s from "@pulumi/kubernetes";

// Set a variable name to be used for all resources
const my_name = `mydemo`;

// create a vpc with awsx
const myvpc = new awsx.ec2.Vpc(`${my_name}-vpc`, {
    cidrBlock: "10.0.0.0/22",
    numberOfAvailabilityZones: 3,
    natGateways: { strategy: "Single" },
    tags: { Name: `${my_name}-vpc` },
    enableDnsHostnames: true,
    enableDnsSupport: true,
  });

// export the vpc id, public and private subnets
export const myvpc_id = myvpc.vpcId;
export const myvpc_public_subnets = myvpc.publicSubnetIds;
export const myvpc_private_subnets = myvpc.privateSubnetIds;

// create a security group for the eks cluster
const eksclustersecuritygroup = new aws.ec2.SecurityGroup(`${my_name}-eks-cluster-sg`, {
    vpcId: myvpc.vpcId,
    revokeRulesOnDelete: true,
    description: "EKS created security group created by code.",
    egress: [{
        description: "Allow outbound internet access",
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"],
    }],
    ingress: [
        {
            description: "Ingress to self cluster.  ",
            protocol: "-1",
            fromPort: 0,
            toPort: 0,
            self: true, // This allows us to call the securitygroup itself as a source
        },
      ],
      tags: { Name: `${my_name}-eks-cluster-sg` },
    }, { dependsOn: myvpc });

// export the security group id, name, vpcid and tags
const eksnodegroupsecuritygroup_name = eksclustersecuritygroup.id;
export const securitygroup_eksnode_id = eksclustersecuritygroup.id;
export const securitygroup_eksnode_name = eksclustersecuritygroup.name;
export const securitygroup_eksnode_vpcid = eksclustersecuritygroup.vpcId;
export const securitygroup_eksnode_tags = eksclustersecuritygroup.tags;

// create a launch template for the eks cluster
// This is where a lot of the magic happens.  The launch template is what is used to create the instances in the node group.
const mylaunchTemplate = new aws.ec2.LaunchTemplate(`${my_name}-launchtemplate`, {
    tags: {"Name": `${my_name}-launchtemplate`},
    // DO NOT pass in a ami image, it the instances will say FAILED_CREATE to connect to the eks cluster.
    //imageId: "ami-055c9a441998a8f28",
    instanceType: "t3a.small", // Toggle this instance type with the one below so that the launch template changes versions.
    //instanceType: "t3a.nano", // Toggle this instance type with the one above so that the launch template changes versions.
    description: "This is the example launch template for the EKS cluster managed node group by Tushar Shah",
    updateDefaultVersion: true,
    vpcSecurityGroupIds: [eksclustersecuritygroup.id],
  }
  );

// export the launch template id and version
export const mylaunchTemplate_id = mylaunchTemplate.id;
export const mylaunchTemplate_version = mylaunchTemplate.latestVersion;

// create a role for the eks cluster
const eksRole = new aws.iam.Role(`${my_name}-eksRole`, {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Action: "sts:AssumeRole",
                Effect: "Allow",
                Principal: { Service: "eks.amazonaws.com" },
            },
        ],
    }),
  });

// add the managed policy amazon eks cluster policy to the eks role
const eksPolicyAttachment = new aws.iam.RolePolicyAttachment(`${my_name}-eksPolicyAttachment`, {
    policyArn: aws.iam.ManagedPolicy.AmazonEKSClusterPolicy,
    role: eksRole.name,
  });

// add the managed policy amazon eks vpc resource controller policy to the eks role
const AmazonEKSVPCResourceControllerPolicyAttachment = new aws.iam.RolePolicyAttachment("example-AmazonEKSVPCResourceController", {
    policyArn: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
    role: eksRole.name,
  });

// create an iam role for the node group
const nodeRole = new aws.iam.Role(`${my_name}-nodeRole`, {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Action: "sts:AssumeRole",
                Effect: "Allow",
                Principal: { Service: "ec2.amazonaws.com" },
            },
        ],
    }),
  });

// add the managed policy amazon eks worker node policy to the node role
const example_AmazonEKSWorkerNodePolicy = new aws.iam.RolePolicyAttachment("example-AmazonEKSWorkerNodePolicy", {
    policyArn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    role: nodeRole.name,
});

// add the managed policy amazon eks cni policy to the node role
const example_AmazonEKSCNIPolicy = new aws.iam.RolePolicyAttachment("example-AmazonEKSCNIPolicy", {
    policyArn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    role: nodeRole.name,
});

// add the managed policy amazon ec2 container registry read only to the node role
const example_AmazonEC2ContainerRegistryReadOnly = new aws.iam.RolePolicyAttachment("example-AmazonEC2ContainerRegistryReadOnly", {
    policyArn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    role: nodeRole.name,
});

// create the eks cluster.  There is NO pulumi-eks here
const mycluster = new aws.eks.Cluster(`${my_name}-eks`, {
    roleArn: eksRole.arn,
    version: "1.25",
    enabledClusterLogTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler"],
    vpcConfig: {
       //vpcId: myvpc.vpcId, //commented out due to: https://github.com/pulumi/pulumi-terraform-bridge/issues/74
       securityGroupIds:  [eksclustersecuritygroup.id],
       subnetIds: myvpc.publicSubnetIds,
     },
   });

// create the eks node group with the launch template
const eksnodegroup = new aws.eks.NodeGroup(`${my_name}-eksNodeGroup`, {
    clusterName: mycluster.name,
    //subnetIds: myvpc.publicSubnetIds, // Provide a list of subnet IDs associate with the node group
    subnetIds: myvpc.privateSubnetIds, // Provide a list of subnet IDs associate with the node group
    nodeRoleArn: nodeRole.arn,
    launchTemplate: {
      id: mylaunchTemplate.id,
      version: pulumi.interpolate`${mylaunchTemplate.latestVersion}`,
    },
    scalingConfig: {
        desiredSize: 2,
        maxSize: 8,
        minSize: 2,
    },
  });

// export the nodegroup name
export const eksnodegroup_name = eksnodegroup.nodeGroupName;

// Generate a kubeconfig for the EKS cluster.
const mykubeconfig = pulumi.all([
    mycluster.endpoint,
    mycluster.certificateAuthority.data,
    mycluster.name,
]).apply(([endpoint, certData, clusterName]) => {
    return {
        apiVersion: "v1",
        clusters: [{
            cluster: {
                server: endpoint,
                "certificate-authority-data": certData,
            },
            name: clusterName,
        }],
        contexts: [{
            context: { cluster: clusterName, user: "aws" },
            name: "aws",
        }],
        "current-context": "aws",
        kind: "Config",
        users: [{
            name: "aws",
            user: { exec: {
                apiVersion: "client.authentication.k8s.io/v1beta1",
                command: "aws",
                args: ["eks", "get-token", "--cluster-name", clusterName]
            }},
        }],
    };
});

//export const kubeconfig = (mykubeconfig);
export const kubeconfig = pulumi.secret(mykubeconfig);

// create the k8s provider
const k8sProvider = new k8s.Provider(`${my_name}-k8sprovider`, {
    kubeconfig: kubeconfig.apply(JSON.stringify),
  });

// create the namespace for poddisruption budget
const mynamespace = new k8s.core.v1.Namespace(
`${my_name}-namespace`,
    {},
  
    //{dependsOn: [mycluster] }  // Use this for ~/.kube/config
    { provider: k8sProvider } // Use this for ~/.kube/config
);

// export the namespace name
export const mynamespace_name = mynamespace.metadata.name;

// create the poddisruption budget.  This is where the magic will happen where we create the error in pulumi up.
const pdb = new k8s.policy.v1.PodDisruptionBudget(`${my_name}-pdb`, {
    
    metadata: { namespace: mynamespace.metadata.name,  },
    spec: {
        //minAvailable: "101%", // To trigger an error in the launch template, set this to 101 via uncommenting this line.  This will make the pdb update fail.
        minAvailable: "100%",// Set this the first time you run the code.

        selector: {
            matchLabels: {
                app: "myapp",
            },
        },
    },
  }, { dependsOn: [mycluster], provider: k8sProvider}); // Comment out this line after the first run when you are trying to create the issue.
  
  // export the poddisruption budget name
  export const pdb_name = pdb.metadata.name;
