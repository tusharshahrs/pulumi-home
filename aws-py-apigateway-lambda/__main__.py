"""An AWS Python Pulumi program"""

import pulumi
from pulumi_aws import s3, iam, lambda_, apigateway
import json
from jinja2 import Environment, FileSystemLoader
from pulumi import Output

######### IAM ###########
api_lambda_role = iam.Role("demo-lambdaRole",
                           assume_role_policy=json.dumps({
                               "Version": "2012-10-17",
                               "Statement": [{
                                   "Action": "sts:AssumeRole",
                                   "Principal": {
                                       "Service": "lambda.amazonaws.com",
                                   },
                                   "Effect": "Allow",
                                   "Sid": "",
                               }]
                           }))
 
api_lambda_role_policy = iam.RolePolicy('demo-lambda-api-iam-policy',
    role=api_lambda_role.id,
    policy=json.dumps({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                "Resource": "*"
            }
        ]
    })
)

######### LAYERS ###########
 
"""artifacts_bucket = s3.Bucket('demo-artifacts')
# Upload ffmpeg library to bucket
api_airtable_layer_zip = s3.BucketObject('demo-hello',
    bucket=artifacts_bucket.id,
    source=pulumi.FileAsset("./step_hello/hello.py")
)"""

######## LAMBDAS ###########
api_airtable = lambda_.Function('demo-api-airtable',
    role=api_lambda_role.arn,
    runtime="python3.8",
    handler="hello.handler",
    #layers=[api_airtable_layer.arn],
    code=pulumi.AssetArchive({
        '.': pulumi.FileArchive('./step_hello')
    }),
    timeout=30,
    memory_size=512,
)

env = Environment(loader=FileSystemLoader('./'), trim_blocks=True, lstrip_blocks=True)
openapi_spec_template = env.get_template('api.yaml')

marv_api_key = apigateway.ApiKey('demo-marv-internal')

first_part = """ 
swagger: "2.0"
info:
  version: "2021-03-29T15:07:58Z"
  title: "marv"
basePath: "/dev"
schemes:
  - "https"
paths:
  /test:
    post:
      responses: {}
      x-amazon-apigateway-integration:
        httpMethod: "POST"
        passthroughBehavior: "when_no_match"
        type: "AWS_PROXY"
        uri: """
       
final_output = Output.concat(f'{first_part}', api_airtable.invoke_arn)
api_gateway = apigateway.RestApi('demo-api-gateway',
    body=final_output,
    api_key_source='HEADER',
    description="This is the hello python apigateway with lambda integration",
)

api_gateway_deployment = apigateway.Deployment('demo-api-gateway-deployment',
    rest_api=api_gateway.id,
    opts=pulumi.ResourceOptions(depends_on=[api_gateway])
)
 
api_gateway_stage = apigateway.Stage('demo-api-gateway-stage',
    stage_name='dev',
    rest_api=api_gateway.id,
    deployment=api_gateway_deployment.id,
    opts=pulumi.ResourceOptions(depends_on=[api_gateway])
)

api_lambda_permission = lambda_.Permission('demo-api-lambda-permission',
    action="lambda:InvokeFunction",
    principal="apigateway.amazonaws.com",
    function=api_airtable.name,
    source_arn=api_gateway_deployment.execution_arn.apply(lambda arn: arn + "*/*"),
)


pulumi.export("api_lambda_role_name", api_lambda_role.name)
pulumi.export("api_lambda_role_id", api_lambda_role.id)
pulumi.export("api_lambda_role_arn", api_lambda_role.arn)

pulumi.export("api_lambda_role_policy_name", api_lambda_role_policy.name)
pulumi.export("api_lambda_role_policy_id", api_lambda_role_policy.id)
# Export the name of the bucket
#pulumi.export('bucket_name', artifacts_bucket.id)

#pulumi.export('api_airtable_layer_zip_id__s3_object', api_airtable_layer_zip.id)

#pulumi.export('api_airtable_layer_arn', api_airtable_layer.arn)
#pulumi.export('api_airtable_layer_id', api_airtable_layer.id)
pulumi.export('api_airtable_id', api_airtable.id)
pulumi.export('api_airtable_name', api_airtable.name)
pulumi.export('api_lambda_permission_name', api_lambda_permission.id)
pulumi.export('marv_api_key_name', marv_api_key.name)
pulumi.export('marv_api_key_id', marv_api_key.id)
pulumi.export('api_airtable.invoke_arn', api_airtable.invoke_arn)

pulumi.export('api_gateway_restapi_id', api_gateway.id)
pulumi.export('api_gateway_restapi_excution_arn', api_gateway.execution_arn)

pulumi.export('api_gateway_deployment_id', api_gateway_deployment.id)
pulumi.export('api_gateway_deployment_invoke_url', api_gateway_deployment.invoke_url)

pulumi.export('api_gateway_stage_id', api_gateway_stage.id)
pulumi.export('api_gateway_stage_excution_arn', api_gateway_stage.execution_arn)
