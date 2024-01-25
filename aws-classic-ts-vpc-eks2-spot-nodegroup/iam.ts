import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as iam from "./iam";

// Added AmazonEBSCSIDriverPolicy for aws ebs csi driver helm3 chart since it is required after k8s 1.23
// Added AmazonEKSClusterPolicy for eks cluster
// https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKSVPCResourceController.html
let managedPolicyArns: string[] = [
    "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy",
];

//     "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
//https://antonputra.com/kubernetes/add-iam-user-and-iam-role-to-eks/#add-iam-user-to-eks-cluster
// Create IAM policy to let users view nodes and workloads for all clusters in the AWS Management Console. Give it a name AmazonEKSViewNodesAndWorkloadsPolicy.
const AmazonEKSViewNodesAndWorkloadsPolicy= `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "eks:DescribeNodegroup",
                "eks:ListNodegroups",
                "eks:DescribeCluster",
                "eks:ListClusters",
                "eks:AccessKubernetesApi",
                "ssm:GetParameter",
                "eks:ListUpdates",
                "eks:ListFargateProfiles"
            ],
            "Resource": "*"
        }
    ]
}`

// Create IAM policy to let users view nodes and workloads for all clusters in the AWS Management Console
// Give it a name AmazonEKSViewNodesAndWorkloadsPolicy.
const my_custom_policy_AmazonEKSViewNodesAndWorkloadsPolicy= new aws.iam.Policy("AmazonEKSViewNodesAndWorkloadsPolicy", {
    description: "Let users view nodes and workloads for all clusters in the AWS Management Console",
    path: "/",
    policy: `${AmazonEKSViewNodesAndWorkloadsPolicy}`,
});

// Create IAM policy with admin access to EKS clusters. Give it a name AmazonEKSAdminPolicy.
const AmazonEKSAdminPolicy= `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "eks:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "iam:PassedToService": "eks.amazonaws.com"
                }
            }
        }
    ]
}`

// Create IAM policy with admin access to EKS clusters. Give it a name AmazonEKSAdminPolicy.
// Give it a name AmazonEKSAdminPolicy.
const my_custom_policy_AmazonEKSAdminPolicy= new aws.iam.Policy("AmazonEKSAdminPolicy", {
    description: "Let users have admin access to EKS clusters.",
    path: "/",
    policy: `${AmazonEKSAdminPolicy}`,
});

// https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#iam-policy
// Creates a eks cluster autoscale policy json for cluster-autoscaler  helm3 chart
const eks_cluster_autoscale_policy = `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "autoscaling:DescribeAutoScalingGroups",
          "autoscaling:DescribeAutoScalingInstances",
          "autoscaling:DescribeLaunchConfigurations",
          "autoscaling:DescribeScalingActivities",
          "autoscaling:DescribeTags",
          "ec2:DescribeInstanceTypes",
          "ec2:DescribeLaunchTemplateVersions"
        ],
        "Resource": ["*"]
      },
      {
        "Effect": "Allow",
        "Action": [
          "autoscaling:SetDesiredCapacity",
          "autoscaling:TerminateInstanceInAutoScalingGroup",
          "ec2:DescribeImages",
          "ec2:GetInstanceTypesFromInstanceRequirements",
          "eks:DescribeNodegroup"
        ],
        "Resource": ["*"]
      }
    ]
  }`

// Creates a eks cluster autoscale policy json
// https://artifacthub.io/packages/helm/cluster-autoscaler/cluster-autoscaler#aws---iam
const my_custom_policy_eksclusterautoscalePolicy = new aws.iam.Policy("EKSClusterAutoscalePolicy", {
    //name: "EKSClusterAutoscalePolicy",
    description: "EKS Cluster Autoscale Policy for cluster-autoscaler helm3 chart",
    path: "/",
    policy: `${eks_cluster_autoscale_policy}`,
});

// The AWS Load Balancer Controller helm3 chart: https://artifacthub.io/packages/helm/aws/aws-load-balancer-controller
// requires the following iam policy: https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html
const eks_aws_load_balancer_controller_policy = `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateServiceLinkedRole",
                "ec2:DescribeAccountAttributes",
                "ec2:DescribeAddresses",
                "ec2:DescribeInternetGateways",
                "ec2:DescribeVpcs",
                "ec2:DescribeSubnets",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeInstances",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DescribeTags",
                "ec2:GetCoipPoolUsage",
                "ec2:DescribeCoipPools",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeLoadBalancerAttributes",
                "elasticloadbalancing:DescribeListeners",
                "elasticloadbalancing:DescribeListenerCertificates",
                "elasticloadbalancing:DescribeSSLPolicies",
                "elasticloadbalancing:DescribeRules",
                "elasticloadbalancing:DescribeTargetGroups",
                "elasticloadbalancing:DescribeTargetGroupAttributes",
                "elasticloadbalancing:DescribeTargetHealth",
                "elasticloadbalancing:DescribeTags"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:DescribeUserPoolClient",
                "acm:ListCertificates",
                "acm:DescribeCertificate",
                "iam:ListServerCertificates",
                "iam:GetServerCertificate",
                "waf-regional:GetWebACL",
                "waf-regional:GetWebACLForResource",
                "waf-regional:AssociateWebACL",
                "waf-regional:DisassociateWebACL",
                "wafv2:GetWebACL",
                "wafv2:GetWebACLForResource",
                "wafv2:AssociateWebACL",
                "wafv2:DisassociateWebACL",
                "shield:GetSubscriptionState",
                "shield:DescribeProtection",
                "shield:CreateProtection",
                "shield:DeleteProtection"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:RevokeSecurityGroupIngress"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateSecurityGroup"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateTags"
            ],
            "Resource": "arn:aws:ec2:*:*:security-group/*",
            "Condition": {
                "StringEquals": {
                    "ec2:CreateAction": "CreateSecurityGroup"
                },
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateTags",
                "ec2:DeleteTags"
            ],
            "Resource": "arn:aws:ec2:*:*:security-group/*",
            "Condition": {
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:RevokeSecurityGroupIngress",
                "ec2:DeleteSecurityGroup"
            ],
            "Resource": "*",
            "Condition": {
                "Null": {
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:CreateLoadBalancer",
                "elasticloadbalancing:CreateTargetGroup"
            ],
            "Resource": "*",
            "Condition": {
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:CreateListener",
                "elasticloadbalancing:DeleteListener",
                "elasticloadbalancing:CreateRule",
                "elasticloadbalancing:DeleteRule"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:AddTags",
                "elasticloadbalancing:RemoveTags"
            ],
            "Resource": [
                "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
                "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
                "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*"
            ],
            "Condition": {
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:ModifyLoadBalancerAttributes",
                "elasticloadbalancing:SetIpAddressType",
                "elasticloadbalancing:SetSecurityGroups",
                "elasticloadbalancing:SetSubnets",
                "elasticloadbalancing:DeleteLoadBalancer",
                "elasticloadbalancing:ModifyTargetGroup",
                "elasticloadbalancing:ModifyTargetGroupAttributes",
                "elasticloadbalancing:DeleteTargetGroup"
            ],
            "Resource": "*",
            "Condition": {
                "Null": {
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:RegisterTargets",
                "elasticloadbalancing:DeregisterTargets"
            ],
            "Resource": "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:SetWebAcl",
                "elasticloadbalancing:ModifyListener",
                "elasticloadbalancing:AddListenerCertificates",
                "elasticloadbalancing:RemoveListenerCertificates",
                "elasticloadbalancing:ModifyRule"
            ],
            "Resource": "*"
        }
    ]
}`


// Creates a eks cluster AWSLoadBalancerControllerIAMPolicy
// https://artifacthub.io/packages/helm/aws/aws-load-balancer-controller#setup-iam-for-serviceaccount
// Step 3: Create an IAM policy called AWSLoadBalancerControllerIAMPolicy
const my_custom_policyAWSLoadBalancerControllerIAMPolicy = new aws.iam.Policy("AWSLoadBalancerControllerIAMPolicy", {
    //name: "AWSLoadBalancerControllerIAMPolicy",
    description: "The controller runs on the worker nodes, so it needs access to the AWS ALB/NLB resources via IAM permissions. The IAM permissions can either be setup via IAM roles for ServiceAccount or can be attached directly to the worker node IAM roles.  EKS Cluster for AWS Load Balancer Controller helm3 chart",
    path: "/",
    policy: `${eks_aws_load_balancer_controller_policy}`,
});

// Creates a role and attaches the EKS worker node IAM managed policies
export function createRole(name: string): aws.iam.Role {
    const role = new aws.iam.Role(`${name}-iamrole`, {
        assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
            Service: "ec2.amazonaws.com",
        }),
    });

    let counter = 0;
    for (const policy of managedPolicyArns) {
        // Create RolePolicyAttachment without returning it.
        const rpa = new aws.iam.RolePolicyAttachment(`${name}-rpa_policy-${counter++}`,
            { policyArn: policy, role: role },
        );
    }

    // Adding Custom Policy for AmazonEKSViewNodesAndWorkloadsPolicy
    const rpa1 = new aws.iam.RolePolicyAttachment(`${name}-rpa_my_custom_policy_AmazonEKSViewNodesAndWorkloadsPolicy-${counter++}`,
        { policyArn: my_custom_policy_AmazonEKSViewNodesAndWorkloadsPolicy.arn, role: role },
        { dependsOn: my_custom_policy_AmazonEKSViewNodesAndWorkloadsPolicy });

    const rpa2 = new aws.iam.RolePolicyAttachment(`${name}-rpa_my_custom_policy_AmazonEKSAdminPolicy-${counter++}`,
        { policyArn: my_custom_policy_AmazonEKSAdminPolicy.arn, role: role },
        { dependsOn: my_custom_policy_AmazonEKSAdminPolicy });

    // Adding Custom Policy for cluster autoscale
    const rpa3 = new aws.iam.RolePolicyAttachment(`${name}-rpa_my_custom_policy_eksclusterautoscalePolicy-${counter++}`,
        { policyArn: my_custom_policy_eksclusterautoscalePolicy.arn, role: role },
        { dependsOn: my_custom_policy_eksclusterautoscalePolicy });

    // Adding Custom Policy for my_custom_policyAWSLoadBalancerControllerIAMPolicy
    const rpa4 = new aws.iam.RolePolicyAttachment(`${name}-rpa_my_custom_policyAWSLoadBalancerControllerIAMPolicy-${counter++}`,
    { policyArn: my_custom_policyAWSLoadBalancerControllerIAMPolicy.arn, role: role },
    { dependsOn: my_custom_policyAWSLoadBalancerControllerIAMPolicy });

    return role;
}

// Creates a collection of IAM roles.
export function createRoles(name: string, quantity: number): aws.iam.Role[] {
    const roles: aws.iam.Role[] = [];

    for (let i = 0; i < quantity; i++) {
        roles.push(iam.createRole(`${name}-role-${i}`));
    }

    return roles;
}

// Creates a collection of IAM instance profiles from the given roles.
export function createInstanceProfiles(name: string, roles: aws.iam.Role[]): aws.iam.InstanceProfile[] {
    const profiles: aws.iam.InstanceProfile[] = [];

    for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        profiles.push(new aws.iam.InstanceProfile(`${name}-instanceProfile-${i}`, {role: role}));
    }

    return profiles;
}