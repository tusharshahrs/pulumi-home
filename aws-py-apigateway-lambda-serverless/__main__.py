"""An AWS Python Pulumi program"""

import pulumi
import pulumi_aws as aws
import iam
import json
from pulumi import Output, ResourceOptions

custom_stage_name = 'dev'

# We will add one path at a time
custom_url_path_1 = "/test1"
custom_url_path_2 = "/pets2"
custom_url_path_3 = "/pets3"
##################
## Lambda Function
##################

# Create a Lambda function, using code from the `./hello_lambda` folder.
lambda_func = aws.lambda_.Function("demo-lambda-hello",
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

# Validator for the open api code: https://apitools.dev/swagger-parser/online/
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
    x-amazon-apigateway-api-key-source: HEADER
    x-amazon-apigateway-auth: NONE
    x-amazon-apigateway-integration:
      httpMethod: "POST"
      passthroughBehavior: "when_no_match"
      type: "AWS_PROXY"
      uri: """

open_api_uri_1 = lambda_func.invoke_arn
# Create the uri.  Combining the openapi spec and the lambda function
final_openapi_spec_1 = Output.concat(f'{first_part_1}', '"', open_api_uri_1, '"')

header_part= """
openapi: 3.0.0
info:
  version: "1"
  title: marv
security: [{}]
paths:
"""

path1 = """
 /test1:
   post:
    responses: {
        "200": {
          description: "200 ok response"}
    }
    x-amazon-apigateway-api-key-source: HEADER
    x-amazon-apigateway-auth: NONE
    x-amazon-apigateway-integration:
      httpMethod: "POST"
      passthroughBehavior: "when_no_match"
      type: "AWS_PROXY"
      uri: """

path2 = """
 /pets2:
   post:
    responses: {
        "200": {
          description: "200 ok response"}
    }
    x-amazon-apigateway-api-key-source: HEADER
    x-amazon-apigateway-auth: NONE
    x-amazon-apigateway-integration:
      httpMethod: "POST"
      passthroughBehavior: "when_no_match"
      type: "AWS_PROXY"
      uri: """

path3 = """
 /pets3:
   post:
    responses: {
        "200": {
          description: "200 ok response"}
    }
    x-amazon-apigateway-api-key-source: HEADER
    x-amazon-apigateway-auth: NONE
    x-amazon-apigateway-integration:
      httpMethod: "POST"
      passthroughBehavior: "when_no_match"
      type: "AWS_PROXY"
      uri: """

path1_combine = Output.concat(f'{path1}', '"', open_api_uri_1, '"')
path2_combine = Output.concat(f'{path2}', '"', open_api_uri_1, '"')
path3_combine = Output.concat(f'{path3}', '"', open_api_uri_1, '"')

# Note, that we start with only 1 path.  Then we can keep adding paths
combined_open_spec = Output.concat(header_part, path1_combine)
#combined_open_spec = Output.concat(header_part, path1_combine, path2_combine)
#combined_open_spec = Output.concat(header_part, path1_combine, path2_combine, path3_combine)

# Create the API Gateway Rest API, using a swagger spec.
rest_api_swagger = aws.apigateway.RestApi("swagger-apigateway-restapi",
    body=lambda_func.arn.apply(lambda arn: json.dumps({
        "swagger": "2.0",
        "info": {"title": "api", "version": "1.0"},
        "paths": {
            "/{proxy+}": swagger_route_handler(arn),
        },
    }))    
)

# Create the API Gateway Rest API, using the openapi spec.
api_gateway_restapi_openapi = aws.apigateway.RestApi('demo-openapi-api-gateway-restapi',
    description="This is the hello python apigateway with lambda integration",
    tags= {
            "env": "dev",
            "team": "support",
    },
    api_key_source='HEADER',
    #body=final_openapi_spec_1
    body=combined_open_spec
    )

# Create a deployment of the Rest API.
deployment_swagger = aws.apigateway.Deployment("swagger-api-gateway-deployment",
    rest_api=rest_api_swagger.id,
    # Note: Set to empty to avoid creating an implicit stage, we'll create it
    # explicitly below instead.
    #stage_name="",
    opts=ResourceOptions(parent=rest_api_swagger)
)

# Create a deployment of the Rest API for openapi.
deployment_openapi = aws.apigateway.Deployment("demo-openapi-gateway-deployment",
    rest_api=api_gateway_restapi_openapi.id,
    # Note: Set to empty to avoid creating an implicit stage, we'll create it
    # explicitly below instead.
    #stage_name="",
    # We must use triggers to allow us to add paths so that path gets added to Stage.
    # https://www.pulumi.com/docs/reference/pkg/aws/apigateway/deployment/#triggers_python
    triggers={"redeployment":combined_open_spec },
    opts=ResourceOptions(parent=api_gateway_restapi_openapi)
)

# Create a stage, which is an addressable instance of the Rest API. Set it to point at the latest deployment.
stage_swagger = aws.apigateway.Stage("swagger-api-gateway-stage",
    rest_api=rest_api_swagger.id,
    deployment=deployment_swagger.id,
    stage_name=custom_stage_name,
    opts=ResourceOptions(parent=rest_api_swagger)
)

# Create a stage, which is an addressable instance of the Rest API. Set it to point at the latest deployment. openapi
stage_openapi = aws.apigateway.Stage("demo-openapi-gateway-stage",
    rest_api=api_gateway_restapi_openapi.id,
    deployment=deployment_openapi.id,
    stage_name=custom_stage_name,
    opts=ResourceOptions(parent=api_gateway_restapi_openapi)
)

# Give permissions from API Gateway to invoke the Lambda
invoke_permission_swagger = aws.lambda_.Permission("swagger-api-lambda-permission",
    action="lambda:invokeFunction",
    function=lambda_func.name,
    principal="apigateway.amazonaws.com",
    source_arn=deployment_swagger.execution_arn.apply(lambda arn: arn + "*/*"),
    opts=ResourceOptions(parent=rest_api_swagger)
)

# Give permissions from API Gateway to invoke the Lambda
invoke_permission_openapi = aws.lambda_.Permission("demo-openapi-lambda-permission",
    action="lambda:invokeFunction",
    function=lambda_func.name,
    principal="apigateway.amazonaws.com",
    source_arn=deployment_openapi.execution_arn.apply(lambda arn: arn + "*/*"),
    opts=ResourceOptions(parent=api_gateway_restapi_openapi)
)

# Export the https endpoint of the running Rest API
pulumi.export("apigateway-rest-endpoint", deployment_swagger.invoke_url.apply(lambda url: url + custom_stage_name))

# As we add more paths, we can uncomment out each line below
pulumi.export("apigateway-rest-endpoint_openapi_custom_path_1", stage_openapi.invoke_url.apply(lambda url: url + custom_url_path_1))
#pulumi.export("apigateway-rest-endpoint_openapi_custom_path_2", stage_openapi.invoke_url.apply(lambda url: url + custom_url_path_2))
#pulumi.export("apigateway-rest-endpoint_openapi_custom_path_3", stage_openapi.invoke_url.apply(lambda url: url + custom_url_path_3))

# Helpful for debugging below
#pulumi.export("open_api_uri_1", open_api_uri_1)
#pulumi.export("final_openapi_spec_1", final_openapi_spec_1)
