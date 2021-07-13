from pulumi import ComponentResource, ResourceOptions
from pulumi_google_native.compute.v1 import Network, NetworkRoutingConfigArgs
from pulumi_google_native.compute.v1.router import Router, RouterNatArgs
from pulumi_google_native.compute.v1.subnetwork import Subnetwork

class VpcArgs:

    def __init__(self,
                 subnet_cidr_blocks=None,
                 project = None,
                 region = None,
                 ):
        self.subnet_cidr_blocks = subnet_cidr_blocks
        self.project = project
        self.region = region

class Vpc(ComponentResource):

    def __init__(self,
                 name: str,
                 args: VpcArgs,
                 opts: ResourceOptions = None):

        super().__init__("custom:network:VPC", name, {}, opts)

        child_opts = ResourceOptions(parent=self)

        self.network = Network(f"{name}-vpc", 
                               project=args.project, 
                               auto_create_subnetworks = False, 
                               routing_config=NetworkRoutingConfigArgs(routing_mode="REGIONAL"),
                               description="vpc network via pulumi component resources", 
                               opts=ResourceOptions(parent=self)
                              )

        self.subnets = []

        for i, ip_cidr_range_block in enumerate(args.subnet_cidr_blocks):
            subnet = Subnetwork(f"{name}-subnet-{i}",
                                project=args.project,
                                region=args.region,
                                description=f"{name}-subnet-{i} description field",
                                network=self.network.self_link,
                                enable_flow_logs = True,
                                ip_cidr_range=ip_cidr_range_block,
                                opts=ResourceOptions(parent=self.network)
                                )
            self.subnets.append(subnet)
        
        self.router = Router(f"{name}-router", 
                             project=args.project,
                             region=args.region,
                             description=f"{name}-router description field",
                             network=self.network.self_link,
                             nats=[RouterNatArgs(name=f"{name}-router-nat",
                                                 nat_ip_allocate_option="AUTO_ONLY",
                                                 source_subnetwork_ip_ranges_to_nat="ALL_SUBNETWORKS_ALL_IP_RANGES")],
                                        
                             opts=ResourceOptions(parent=self.network, depends_on=self.subnets)
                             )

        self.register_outputs({"network": self.network,
                               "router" : self.router,
                               "subnets": self.subnets })