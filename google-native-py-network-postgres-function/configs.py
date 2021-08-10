import pulumi
from pulumi_gcp.firebase import project

config = pulumi.Config()

# retrieving the project name for tags
project_name = pulumi.get_project()

# retrieving the stack name for tags
stack_name = pulumi.get_stack()

# retrieving vpc cidr blocks
subnet_cidr_blocks = config.require_object('subnet_cidr_blocks')


# Restriction on passing name with project that has google in it.
def getResourceName(resourceName=""):
    if resourceName == "":
        return f"{'gcp-native'}"
    else:
        return f"{'gcp-native'}-{resourceName}"