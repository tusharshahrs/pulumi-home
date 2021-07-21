"""An AWS Python Pulumi program"""

import pulumi
from pulumi import CustomTimeouts, ResourceOptions, get_project, get_stack
from pulumi_aws import s3, dynamodb
from pulumi_aws.dynamodb.table import TableArgs

# Creating Tags
# stackname for tags
stackName = get_stack()
# projectname for tags
projectName = get_project()
basetags = {"cost-center": projectName, "stack":stackName, "env":"dev","team":"engineering", "pulumi_cli":"yes", "console_aws":"no"}


test_table = dynamodb.Table("dev-test-table",
                billing_mode="PROVISIONED",
                attributes=[dynamodb.TableAttributeArgs(
                    name="databaseName",
                    type="S"
                )],
                read_capacity=1,
                write_capacity=1,
                hash_key="databaseName",
                name="dev-test-table",
                tags=basetags,
                stream_enabled=True,
                stream_view_type="NEW_IMAGE",
                opts=ResourceOptions(
                    custom_timeouts=CustomTimeouts(
                        create='5m',
                        update='5m',
                        delete='10m'
                    )
                ),
    
)

pulumi.export("dynamodb_name", test_table.name)
pulumi.export("dynamodb_read_capacity", test_table.read_capacity)
pulumi.export("dynamodb_write_capacity", test_table.write_capacity)
pulumi.export("dynamodb_point_in_time_recovery", test_table.point_in_time_recovery)
pulumi.export("dynamodb_billing_mode", test_table.billing_mode)
pulumi.export("dynamodb_hash_key", test_table.hash_key)