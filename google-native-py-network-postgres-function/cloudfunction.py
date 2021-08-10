from pulumi import ComponentResource, ResourceOptions
import pulumi
from pulumi_google_native.storage.v1 import Bucket, BucketObject
from pulumi_google_native.cloudfunctions.v1 import Function, FunctionIamPolicy


class FunctionArgs:
    def __init__(self,
                runtime = "python38",
                entrypoint = "handler",
                timeout = "60s",
                availableMemoryMb = 128,
                httpsTrigger = {},
                ingressSettings= "ALLOW_ALL",
                description = "Serverless Function in Google Native",
                region = None,
                tags = None,
                filearchivepath = None,
    ):
        self.runtime = runtime
        self.entrypoint = entrypoint
        self.timeout = timeout
        self.availableMemoryMb = availableMemoryMb
        self.httpsTrigger = httpsTrigger
        self.ingressSettings= ingressSettings
        self.description = description
        self.location = region
        self.tags = tags
        self.filearchivepath = filearchivepath

class Functions(ComponentResource):
    def __init__(self,
                 name: str,
                 args: FunctionArgs,
                 opts: ResourceOptions = None):

        super().__init__('custom:cloudfunctions:Function', name, {}, opts)

        self.buckets = Bucket(f"{name}-function-bucket",
                              labels=args.tags,
                              opts=ResourceOptions(parent=self))
        
        self.bucketsobject = BucketObject(f"{name}-function-bucketobject",
                                          bucket = self.buckets.name,
                                          source=pulumi.AssetArchive({".": pulumi.FileArchive(args.filearchivepath)}),
                                          metadata=args.tags,
                                          opts=ResourceOptions(parent=self.buckets)
        )

        self.cloudfunctions= Function(f"{name}-function",
                                      description=args.description,
                                      https_trigger=args.httpsTrigger,
                                      source_archive_url=pulumi.Output.concat("gs://",self.buckets.name,"/",self.bucketsobject.name),
                                      entry_point=args.entrypoint,
                                      timeout=args.timeout,
                                      available_memory_mb=args.availableMemoryMb,
                                      runtime=args.runtime,
                                      ingress_settings=args.ingressSettings,
                                      labels=args.tags,
                                      opts=ResourceOptions(parent=self.bucketsobject, depends_on=[self.buckets])
                                      )

        self.invoker = FunctionIamPolicy(f"{name}-function-iam",
                                         function_id = self.cloudfunctions.name.apply(lambda functioname: functioname.split("/")[-1]),
                                         bindings=[
                                                    {
                                                    "members":"allUsers", 
                                                    "role":"roles/cloudfunctions.invoker"
                                                    },
                                                  ],
                                         opts=ResourceOptions(parent=self.cloudfunctions, depends_on=[self.cloudfunctions])
                                         )

        self.register_outputs({"buckets": self.buckets,
                               "bucketsobject": self.bucketsobject,
                               "cloudfunctions": self.cloudfunctions,
                               "cloudfunctioniampolicy": self.invoker
                              })