import pulumi

config = pulumi.Config()

# retrieving the project name
projectName = pulumi.get_project()

# retrieving the stack name
stackName = pulumi.get_stack()

# Restriction on passing name with project that has google in it.
def getResourceName(resourceName=""):
    if resourceName == "":
        return f"{'pulumi-gcp-native'}"
    else:
        return f"{'pulumi-gcp-native'}-{resourceName}"