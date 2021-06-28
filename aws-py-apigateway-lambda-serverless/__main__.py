"""An AWS Python Pulumi program"""

import pulumi
import pulumi_aws as aws
import iam
import json
from pulumi import Output

custom_stage_name = 'dev'

##################
## Lambda Function
##################

# Create a Lambda function, using code from the `./app` folder.

lambda_func = aws.lambda_.Function("demo-lamba-hello",
    role=iam.lambda_role.arn,
    runtime="python3.8",
    handler="hello.handler",
    code=pulumi.AssetArchive({
        '.': pulumi.FileArchive('./hello_lambda')
    }),
    timeout=30,
    memory_size=512,
)

###################################################################
##
## API Gateway REST API (API Gateway V1 / original)
##    /{proxy+} - passes all requests through to the lambda function
##
####################################################################

# Create a single Swagger spec route handler for a Lambda function.
def swagger_route_handler(arn):
    return ({
        "x-amazon-apigateway-any-method": {
            "x-amazon-apigateway-integration": {
                "uri": f'arn:aws:apigateway:{aws.config.region}:lambda:path/2015-03-31/functions/{arn}/invocations',
                "passthroughBehavior": "when_no_match",
                "httpMethod": "POST",
                "type": "aws_proxy",
            },
        },
    })

# Create a openapi spec 1st part
first_part_1 = """
openapi: 3.0.0
info:
  version: "1"
  title: marv
security: [{}]
paths:
 /test1:
   post:
    responses: {
        "200": {
          description: "200 ok response"}
    }
    x-amazon-apigateway-integration:
      httpMethod: "POST"
      passthroughBehavior: "when_no_match"
      type: "AWS_PROXY"
      uri: """

open_api_uri_1 = lambda_func.invoke_arn
final_openapi_spec_1 = Output.concat(f'{first_part_1}', '"', open_api_uri_1, '"')

# Create the API Gateway Rest API, using a swagger spec.
rest_api = aws.apigateway.RestApi("api",
    body=lambda_func.arn.apply(lambda arn: json.dumps({
        "swagger": "2.0",
        "info": {"title": "api", "version": "1.0"},
        "paths": {
            "/{proxy+}": swagger_route_handler(arn),
        },
    })))

api_gateway_restapi = aws.apigateway.RestApi('demo-api-gateway-restapi',
    description="This is the hello python apigateway with lambda integration",
    tags= {
            "env": "dev",
            "team": "support",
    },
    api_key_source='HEADER',
    body=final_openapi_spec_1)

# Create a deployment of the Rest API.
deployment = aws.apigateway.Deployment("demo-api-gateway-deployment",
    rest_api=rest_api.id,
    # Note: Set to empty to avoid creating an implicit stage, we'll create it
    # explicitly below instead.
    stage_name="",
)

# Create a deployment of the Rest API.
deployment2 = aws.apigateway.Deployment("demo-api-gateway-deployment2",
    rest_api=api_gateway_restapi.id,
    # Note: Set to empty to avoid creating an implicit stage, we'll create it
    # explicitly below instead.
    stage_name="",
)

# Create a stage, which is an addressable instance of the Rest API. Set it to point at the latest deployment.
stage = aws.apigateway.Stage("api-gateway-stage",
    rest_api=rest_api.id,
    deployment=deployment.id,
    stage_name=custom_stage_name,
)

# Create a stage, which is an addressable instance of the Rest API. Set it to point at the latest deployment.
stage2 = aws.apigateway.Stage("demo-api-gateway-stage2",
    rest_api=api_gateway_restapi.id,
    deployment=deployment2.id,
    stage_name=custom_stage_name,
)

# Give permissions from API Gateway to invoke the Lambda
invoke_permission = aws.lambda_.Permission("api-lambda-permission",
    action="lambda:invokeFunction",
    function=lambda_func.name,
    principal="apigateway.amazonaws.com",
    source_arn=deployment.execution_arn.apply(lambda arn: arn + "*/*")
)

# Give permissions from API Gateway to invoke the Lambda
invoke_permission2 = aws.lambda_.Permission("demo-api-lambda-permission2",
    action="lambda:invokeFunction",
    function=lambda_func.name,
    principal="apigateway.amazonaws.com",
    source_arn=deployment2.execution_arn.apply(lambda arn: arn + "*/*")
)

# Export the https endpoint of the running Rest API
pulumi.export("apigateway-rest-endpoint", deployment.invoke_url.apply(lambda url: url + custom_stage_name))
pulumi.export("apigateway-rest-endpoint2", deployment2.invoke_url.apply(lambda url: url + custom_stage_name))
pulumi.export("open_api_uri_1", open_api_uri_1)
pulumi.export("final_openapi_spec_1", final_openapi_spec_1)