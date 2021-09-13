"""An AWS Python Pulumi program"""
import pulumi
import pulumi_aws as aws
from pulumi_aws.iam import role
import pulumi_eks as eks
from pulumi import export, Output, ResourceOptions, Config, StackReference, get_stack, get_project
import json
import vpc

# Per NodeGroup IAM: each NodeGroup will bring its own, specific instance role and profile.
managed_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"]

# Creates a role and attaches the EKS worker node IAM managed policies. Used a few times below,
# to create multiple roles, so we use a function to avoid repeating ourselves.
def create_role(name):
    role = aws.iam.Role(name,
        assume_role_policy = json.dumps({
            "Version": "2012-10-17",
            "Statement": [{
                "Sid": "AllowAssumeRole",
                "Effect": "Allow",
                "Principal": {"Service": "ec2.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }),
    )
    
    counter = 0
    for policy in managed_policy_arns:
        rpa = aws.iam.RolePolicyAttachment(f'{name}-policy-{counter}',
            aws.iam.RolePolicyAttachmentArgs(
                policy_arn = policy,
                role = role.id,
            )
        )
        counter = counter + 1
    return role

# Now create the roles and instance profiles for the two worker groups.
role1 = create_role('demo-my-worker-role1')
role2 = create_role('demo-my-worker-role2')

instance_profile_1 = aws.iam.InstanceProfile('demo-my-instance-profile1', role=role1)
instance_profile_2 = aws.iam.InstanceProfile('demo-my-instance-profile2', role=role2)

mycluster = eks.Cluster('demo-my-cluster',
        skip_default_node_group=True,
        instance_roles=[role1, role2],
        instance_type="t3a.medium",
        node_root_volume_size= 10,
        encrypt_root_block_device=True,
        version="1.21",
        vpc_id= vpc.vpc.id,
        public_subnet_ids=vpc.public_subnet_ids,
        private_subnet_ids=vpc.private_subnet_ids,
        enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"],
)

"""
managed_node_group = eks.ManagedNodeGroup("demo-my-managed-ng",
                                           cluster=mycluster.core, # TODO[pulumi/pulumi-eks#483]: Pass cluster directly.
                                           disk_size=10,
                                           instance_types=["t3a.small"],
                                           scaling_config=aws.eks.NodeGroupScalingConfigArgs(
                                              desired_size=1,
                                              min_size=1,
                                              max_size=3,
                                           ),
                                           capacity_type="SPOT",
                                           node_role=role1,
                                           tags={"env": "dev"},
                                           #opts=ResourceOptions(parent=mycluster),
                                           #opts=pulumi.ResourceOptions(parent=mycluster)
                                           )
"""

fixed_node_group = eks.NodeGroup('demo-my-ng-fixed',
                                 cluster=mycluster.core,
                                 instance_type='t3a.medium',
                                 desired_capacity=2,
                                 min_size=1,
                                 max_size=3,
                                 labels={'ondemand': 'true'},
                                 instance_profile=instance_profile_1,
                                 #opts=ResourceOptions(parent=mycluster)
                                 )

spot_node_group = eks.NodeGroup('demo-my-ng-spot',
                                cluster=mycluster.core,
                                instance_type='t3a.large',
                                desired_capacity=2,
                                spot_price='0.25',
                                min_size=1,
                                max_size=4,
                                labels={'preemptible': 'true'},
                                taints={
                                    'special': {
                                        'value': 'true',
                                        'effect': 'NoSchedule',
                                    },
                                },
                                instance_profile=instance_profile_2,
                                #opts=pulumi.ResourceOptions(parent=mycluster)
                                )

export("cluster_name", mycluster.core.cluster.name)
export("iam_role1", role1.name)
export("iam_role2", role2.name)
export("instance_profile1", instance_profile_1.name)
export("instance_profile2", instance_profile_2.name)
export("fixed_node_group_name", fixed_node_group.cfn_stack.name)
export("spot_node_group_name", spot_node_group.cfn_stack.name)
export("kubeconfig", Output.secret(mycluster.kubeconfig))