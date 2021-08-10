from pulumi import ComponentResource, ResourceOptions
from pulumi_google_native.sqladmin.v1beta4 import Instance, Database, SettingsArgs
import pulumi_random as random # Used for password generation https://www.pulumi.com/docs/reference/pkg/random/
from pulumi_gcp import sql as classic_sql

class DatabaseArgs:
    def __init__(self,
                database_version="POSTGRES_13",
                activation_policy = "ALWAYS",
                availability_type = "REGIONAL",
                data_disk_size_gb = "20",
                data_disk_type = "PD_SSD",
                tier="db-f1-micro",
                backup_configuration_enabled = True,
                backup_configuration_point_in_time_recovery_enabled = True,
                charset = "UTF8",
                #project = None,
                region = None,
                tags = None,
                ):
        
        self.database_version = database_version
        self.activation_policy = activation_policy
        self.availability_type = availability_type
        self.data_disk_size_gb = data_disk_size_gb
        self.data_disk_type = data_disk_type
        self.tier = tier
        #self.project = project
        self.region = region
        self.tags = tags
        self.enabled = backup_configuration_enabled
        self.backup_point_in_time_recovery_enabled = backup_configuration_point_in_time_recovery_enabled
        self.charset = charset

class Databases(ComponentResource):
    def __init__(self,
                 name: str,
                 args: DatabaseArgs,
                 opts: ResourceOptions = None):

        super().__init__('custom:database:Postgres', name, {}, opts)

        self.sqlinstance = Instance(f"{name}-sqlinstance",
                            #project=args.project,
                            database_version=args.database_version,
                            region=args.region,
                            settings=SettingsArgs(activation_policy = args.activation_policy,
                                                  availability_type = args.availability_type,
                                                  data_disk_size_gb = args.data_disk_size_gb,
                                                  data_disk_type = args.data_disk_type,
                                                  tier = args.tier,
                                                  user_labels = args.tags,
                                                  backup_configuration= {"enabled": args.enabled, "point_in_time_recovery_enabled": args.backup_point_in_time_recovery_enabled}
                                                 ),
                            opts=ResourceOptions(parent=self))

        self.sqldatabase = Database(f"{name}-sqldatabase",
                                    instance = self.sqlinstance.name,
                                    #project = args.project,
                                    charset =args.charset,
                                    opts=ResourceOptions(parent=self.sqlinstance),
                                    )

        mypassword = random.RandomPassword(f'{name}-sqluser-password',
            length=12,
            special=False,
            lower = True,
            min_lower = 4,
            min_numeric = 4,
            min_upper = 4,
            number = True)

        # Create a user with the configured credentials to use.
        # TODO: Switch to google native version when User is supported:
        # https://github.com/pulumi/pulumi-google-native/issues/47
        self.sqluser = classic_sql.User(f"{name}-sql-user",
            instance=self.sqlinstance.name,
            name = "pulumiadmin",
            password=mypassword.result,
            project = self.sqlinstance.project,
            opts=ResourceOptions(parent=self.sqlinstance)
        )

        self.register_outputs({"sqlinstance": self.sqlinstance,
                               "sqldatabase": self.sqldatabase,
                               "sqluser": self.sqluser
                             })
