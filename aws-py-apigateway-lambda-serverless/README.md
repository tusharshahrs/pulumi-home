# AWS apigateway with lambda in python

Set up two lambda-backed API Gateways: an API Gateway V1 (REST).  Both are in python.
One of them uses swagger and the other one uses openapi.

## Lambda-backed API Gateway
- [Amazon API Gateway with Swagger](https://aws.amazon.com/api-gateway/) is used as an API proxy.
- [Amazon API Gateway with Openapi](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-open-api.html)

## Prerequisites
- [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
- [Configure AWS](https://www.pulumi.com/docs/get-started/aws/begin/#configure-pulumi-to-access-your-aws-account)

## Deploying and running the program

Note: some values in this example will be different from run to run.  These values are indicated
with `***`.

1. Create a new stack

    ```bash
    pulumi stack init dev
    ```

1. Set the AWS region

    ```bash
    pulumi config set aws:region us-east-2
    ```

1. Create a Python virtualenv, activate it, and install dependencies:

    This installs the dependent packages [needed](https://www.pulumi.com/docs/intro/concepts/how-pulumi-works/) for our Pulumi program.

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip3 install -r requirements.txt
    ```

1. Run `pulumi up` to preview and deploy changes.

    ```bash
    pulumi up
    ```

    Results
    ```bash
    Previewing update (dev)

    View Live: https://app.pulumi.com/myuser/aws-py-apigateway-lambda-serverless/dev/previews/ba90036a-d9a8-4610-9fd1-632cec7743b9

        Type                             Name                                     Plan       
    +   pulumi:pulumi:Stack              aws-py-apigateway-lambda-serverless-dev  create...  
    +   pulumi:pulumi:Stack              aws-py-apigateway-lambda-serverless-dev  create     
    +   ├─ aws:iam:RolePolicy            demo-lambda-rolepolicy                   create     
    +   ├─ aws:lambda:Function           demo-lambda-hello                        create     
    +   ├─ aws:apigateway:RestApi        api                                      create     
    +   │  ├─ aws:apigateway:Deployment  api-gateway-deployment                   create     
    +   │  ├─ aws:apigateway:Stage       api-gateway-stage                        create     
    +   │  └─ aws:lambda:Permission      api-lambda-permission                    create     
    +   └─ aws:apigateway:RestApi        demo-api-gateway-restapi                 create     
    +      ├─ aws:apigateway:Deployment  demo-api-gateway-deployment              create     
    +      ├─ aws:apigateway:Stage       demo-api-gateway-stage                   create     
    +      └─ aws:lambda:Permission      demo-api-lambda-permission               create     
    
    Resources:
        + 12 to create

    Do you want to perform this update?  [Use arrows to move, enter to select, type to filter]
    yes
    > no
    details
    ```

1. Select **yes** and the resources will be created
    Results
    ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/myuser/aws-py-apigateway-lambda-serverless/dev/updates/67

        Type                             Name                                     Status       
    +   pulumi:pulumi:Stack              aws-py-apigateway-lambda-serverless-dev  creating     
    +   ├─ aws:iam:Role                  demo-lambda-role                         created     
    +   ├─ aws:iam:RolePolicy            demo-lambda-rolepolicy                   created     
    +   ├─ aws:lambda:Function           demo-lambda-hello                        created     
    +   ├─ aws:apigateway:RestApi        api                                      created     
    +   │  ├─ aws:apigateway:Deployment  api-gateway-deployment                   created     
    +   │  ├─ aws:apigateway:Stage       api-gateway-stage                        created     
    +   │  └─ aws:lambda:Permission      api-lambda-permission                    created     
    +   └─ aws:apigateway:RestApi        demo-api-gateway-restapi                 created     
    +      ├─ aws:apigateway:Deployment  demo-api-gateway-deployment              created     
    +      ├─ aws:apigateway:Stage       demo-api-gateway-stage                   created     
    +      └─ aws:lambda:Permission      demo-api-lambda-permission               created     
    
    Outputs:
    apigateway-rest-endpoint                      : "https://0mv9g2w9lc.execute-api.us-east-2.amazonaws.com/dev"
    apigateway-rest-endpoint_openapi_custom_path_1: "https://jyv5mkmtee.execute-api.us-east-2.amazonaws.com/dev/test1"

    Resources:
        + 12 created

    Duration: 28s
    ```
1. To see the resources that were created, run `pulumi stack output`:

    ```bash
    pulumi stack output
    ```

    Result
    ```bash
    Current stack outputs (2):
    OUTPUT                                          VALUE
    apigateway-rest-endpoint                        https://0mv9g2w9lc.execute-api.us-east-2.amazonaws.com/dev
    apigateway-rest-endpoint_openapi_custom_path_1  https://jyv5mkmtee.execute-api.us-east-2.amazonaws.com/dev/test1
    ```
1.  Validate via curl
    ```bash
    curl -X POST $(pulumi stack output apigateway-rest-endpoint_openapi_custom_path_1)
    ```
    Results
    **Hello World from Pulumi in python via AWS Lambda!!!**

1. Validate via Postman

   - Screen shot of [apigateway invoke url](https://share.getcloudapp.com/04u2Wqyg)
   -  Generated code for **Postman**
        ```bash
        curl --location --request POST 'https://jyv5mkmtee.execute-api.us-east-2.amazonaws.com/dev/test1'
        ```

1.  To clean up resources, run **pulumi destroy**

    ```bash
    pulumi destroy -y
    ```

    Result
    ```bash
    Destroying (dev)

    View Live: https://app.pulumi.com/myuser/aws-py-apigateway-lambda-serverless/dev/updates/68

        Type                             Name                                     Status       
        pulumi:pulumi:Stack              aws-py-apigateway-lambda-serverless-dev               
    -   ├─ aws:apigateway:RestApi        api                                      deleted     
    -   │  ├─ aws:lambda:Permission      api-lambda-permission                    deleted     
    -   │  ├─ aws:apigateway:Stage       api-gateway-stage                        deleted     
    -   │  └─ aws:apigateway:Deployment  api-gateway-deployment                   deleted     
    -   ├─ aws:apigateway:RestApi        demo-api-gateway-restapi                 deleted     
    -   │  ├─ aws:lambda:Permission      demo-api-lambda-permission               deleted     
    -   │  ├─ aws:apigateway:Stage       demo-api-gateway-stage                   deleted     
    -   │  └─ aws:apigateway:Deployment  demo-api-gateway-deployment              deleted     
    -   ├─ aws:iam:RolePolicy            demo-lambda-rolepolicy                   deleted     
    -   ├─ aws:lambda:Function           demo-lambda-hello                        deleted     
    -   └─ aws:iam:Role                  demo-lambda-role                         deleted     
    
    Outputs:
    - apigateway-rest-endpoint                      : "https://0mv9g2w9lc.execute-api.us-east-2.amazonaws.com/dev"
    - apigateway-rest-endpoint_openapi_custom_path_1: "https://jyv5mkmtee.execute-api.us-east-2.amazonaws.com/dev/test1"

    Resources:
        - 12 deleted

    Duration: 6s
    ```