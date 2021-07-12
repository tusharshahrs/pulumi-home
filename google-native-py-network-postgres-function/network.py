from pulumi import ComponentResource, ResourceOptions
#from pulumi_google_native.compute import v1 as compute
from pulumi_google_native.compute.v1 import Network as Network

class VpcArgs:

    def __init__(self,
                 subnet_cidr_blocks=None,
                 project = None,
                 ):
        self.subnet_cidr_blocks = subnet_cidr_blocks
        self.project = project

class Vpc(ComponentResource):

    def __init__(self,
                 name: str,
                 args: VpcArgs,
                 opts: ResourceOptions = None):

        super().__init__("custom:network:VPC", name, {}, opts)

        child_opts = ResourceOptions(parent=self)

        #self.network = compute.Network(name, project=args.project, auto_create_subnetworks = False, description="vpc network via pulumi component resources", opts=ResourceOptions(parent=self))
        self.network = Network(name, project=args.project, auto_create_subnetworks = False, description="vpc network via pulumi component resources", opts=ResourceOptions(parent=self))

        self.register_outputs({})