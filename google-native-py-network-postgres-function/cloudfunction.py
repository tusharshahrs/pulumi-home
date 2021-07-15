from pulumi import ComponentResource, ResourceOptions, Output, asset
import pulumi
from pulumi_gcp.firebase import project
from pulumi_google_native import cloudfunctions
from pulumi_google_native.compute.v1 import network
from pulumi_google_native.storage.v1 import Bucket, BucketObject, bucket
from pulumi_google_native.cloudfunctions.v1 import Function, FunctionIamPolicy
import pulumi_random as random # Used for function name generation https://www.pulumi.com/docs/reference/pkg/random/


class FunctionArgs:
    def __init__(self,
                runtime = "python38",
                entrypoint = "handler",
                timeout = "60s",
                availableMemoryMb = 128,
                httpsTrigger = {},
                ingressSettings= "ALLOW_ALL",
                description = "Serverless Function in Google Native",
                project = None,
                region = None,
                tags = None,
    ):
        self.runtime = runtime
        self.entrypoint = entrypoint
        self.timeout = timeout
        self.availableMemoryMb = availableMemoryMb
        self.httpsTrigger = httpsTrigger
        self.ingressSettings= ingressSettings
        self.description = description
        self.project = project
        self.location = region
        self.tags = tags

class Functions(ComponentResource):
    def __init__(self,
                 name: str,
                 args: FunctionArgs,
                 opts: ResourceOptions = None):

        super().__init__('custom:cloudfunctions:Function', name, {}, opts)

        self.buckets = Bucket(f"{name}-function-bucket",
                              project=args.project,
                              labels=args.tags,
                              opts=ResourceOptions(parent=self))
        
        self.bucketsobject = BucketObject(f"{name}-function-bucketobject",
                                          bucket = self.buckets.name,
                                          source=pulumi.AssetArchive({".": pulumi.FileArchive('./pythonfunction')}),
                                          metadata=args.tags,
                                          opts=ResourceOptions(parent=self.buckets)
        )

        myrandomString = random.RandomString(f"{name}-function-random",
            length=6,
            special=False,
            min_lower = 2,
            min_numeric = 2,
            min_upper = 2,
            number = True)
        
        # There is a function naming issue(name being too long) that shows up in the FunctionIamPolicy.  That is why we must create a name.
        functionName = pulumi.Output.concat("func-",myrandomString.result)
        self.cloudfunctions= Function(f"{name}-function",
                                      project=args.project,
                                      location=args.location,
                                      description=args.description,
                                      name=pulumi.Output.concat("projects/",args.project,"/locations/",args.location,"/functions/",functionName),
                                      https_trigger=args.httpsTrigger,
                                      source_archive_url=pulumi.Output.concat("gs://",self.buckets.name,"/",self.bucketsobject.name),
                                      entry_point=args.entrypoint,
                                      timeout=args.timeout,
                                      available_memory_mb=args.availableMemoryMb,
                                      runtime=args.runtime,
                                      ingress_settings=args.ingressSettings,
                                      labels=args.tags,
                                      opts=ResourceOptions(parent=self)
                                      )

        self.invoker = FunctionIamPolicy(f"{name}-function-iampolicy",
                                         project=args.project,
                                         location=args.location,
                                         function_id=functionName, # func.name returns the long `projects/foo/locations/bat/functions/reallylongname` name which doesn't suit here, due to some 63 character limit from google
                                         bindings=[
                                                    {
                                                    "members":"allUsers", 
                                                    "role":"roles/cloudfunctions.invoker"
                                                    },
                                                  ],
                                         opts=ResourceOptions(parent=self.cloudfunctions)
                                         )

        self.register_outputs({"buckets": self.buckets,
                               "bucketsobject": self.bucketsobject,
                               "cloudfunctions": self.cloudfunctions,
                               "cloudfunctioniampolicy": self.invoker
                              })