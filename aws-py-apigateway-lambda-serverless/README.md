# AWS apigateway with lambda in python

Set up two lambda-backed API Gateways: an API Gateway V1 (REST).  Both are in python.
One of them uses swagger and the other one uses openapi.

*Note*:  We use [triggers](https://www.pulumi.com/docs/reference/pkg/aws/apigateway/deployment/#triggers_python) on the deployment so that we can add routes and they
automatically are authenticated and we avoid the **Missing Authentication Token** errors
## Lambda-backed API Gateway
- [Amazon API Gateway with Swagger](https://aws.amazon.com/api-gateway/) is used as an API proxy.
- [Amazon API Gateway with Openapi](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-open-api.html)

## Prerequisites
- [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
- [Configure AWS](https://www.pulumi.com/docs/get-started/aws/begin/#configure-pulumi-to-access-your-aws-account)

## Deploying and running the program

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
    +   pulumi:pulumi:Stack              aws-py-apigateway-lambda-serverless-dev  create     
    +   ├─ aws:iam:Role                  demo-lambda-role                         create     
    +   ├─ aws:iam:RolePolicy            demo-lambda-rolepolicy                   create     
    +   ├─ aws:lambda:Function           demo-lambda-hello                        create     
    +   ├─ aws:apigateway:RestApi        swagger-apigateway-restapi               create     
    +   │  ├─ aws:apigateway:Deployment  swagger-api-gateway-deployment           create     
    +   │  ├─ aws:apigateway:Stage       swagger-api-gateway-stage                create     
    +   │  └─ aws:lambda:Permission      swagger-api-lambda-permission            create     
    +   └─ aws:apigateway:RestApi        demo-openapi-api-gateway-restapi         create     
    +      ├─ aws:apigateway:Deployment  demo-openapi-gateway-deployment          create     
    +      ├─ aws:apigateway:Stage       demo-openapi-gateway-stage               create     
    +      └─ aws:lambda:Permission      demo-openapi-lambda-permission           create     
    
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

    View Live: https://app.pulumi.com/shaht/aws-py-apigateway-lambda-serverless/dev/updates/30

        Type                             Name                                     Status       
    +   pulumi:pulumi:Stack              aws-py-apigateway-lambda-serverless-dev  created     
    +   ├─ aws:iam:Role                  demo-lambda-role                         created     
    +   ├─ aws:iam:RolePolicy            demo-lambda-rolepolicy                   created     
    +   ├─ aws:lambda:Function           demo-lambda-hello                        created     
    +   ├─ aws:apigateway:RestApi        swagger-apigateway-restapi               created     
    +   │  ├─ aws:apigateway:Deployment  swagger-api-gateway-deployment           created     
    +   │  ├─ aws:apigateway:Stage       swagger-api-gateway-stage                created     
    +   │  └─ aws:lambda:Permission      swagger-api-lambda-permission            created     
    +   └─ aws:apigateway:RestApi        demo-openapi-api-gateway-restapi         created     
    +      ├─ aws:apigateway:Deployment  demo-openapi-gateway-deployment          created     
    +      ├─ aws:apigateway:Stage       demo-openapi-gateway-stage               created     
    +      └─ aws:lambda:Permission      demo-openapi-lambda-permission           created

    Outputs:
     + apigateway-rest-endpoint: "https://k4p4gv27x7.execute-api.us-east-2.amazonaws.com/dev"
     + apigateway-rest-endpoint_openapi_custom_path_1: "https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/test1"
    Resources:
        + 12 created   
    ```
1. To see the resources that were created, run `pulumi stack output`:

    ```bash
    pulumi stack output
    ```

    Result
    ```bash
    Current stack outputs (2):
    OUTPUT                                          VALUE
    apigateway-rest-endpoint                        https://k4p4gv27x7.execute-api.us-east-2.amazonaws.com/dev
    apigateway-rest-endpoint_openapi_custom_path_1  https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/test1
    ```
1. Validate via curl
    ```bash
    curl -X POST $(pulumi stack output apigateway-rest-endpoint_openapi_custom_path_1)
    ```
    Results
    **Hello World from Pulumi in python via AWS Lambda!!!**

1. Validate via Postman

   - Screen shot of [apigateway invoke url](https://share.getcloudapp.com/v1uYEvXv)
   - Generated code for **Postman**
        ```bash
        curl --location --request POST 'https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/test1'
        ```
1. Add a new route in the `__main__.py` doing the following, commenting out the **combined_open_spec** that only has **path1_combine** and adding the one with **path2_combine**

    BEFORE
    ```bash
    combined_open_spec = Output.concat(header_part, path1_combine)
    #combined_open_spec = Output.concat(header_part, path1_combine, path2_combine)
    #combined_open_spec = Output.concat(header_part, path1_combine, path2_combine, path3_combine)
    ```

    AFTER
    ```bash
    #combined_open_spec = Output.concat(header_part, path1_combine)
    combined_open_spec = Output.concat(header_part, path1_combine, path2_combine)
    #combined_open_spec = Output.concat(header_part, path1_combine, path2_combine, path3_combine)
    ```
   Also uncomment the following line at the bottom of the `__main__.py`
   ```bash
   pulumi.export("apigateway-rest-endpoint_openapi_custom_path_2", stage_openapi.invoke_url.apply(lambda url: url + custom_url_path_2))
   ```

1. Run `pulumi up` and the results will be
   ```bash
   pulumi up
   ```

   Results
   ```bash
   Previewing update (dev)

    View Live: https://app.pulumi.com/myuser/aws-py-apigateway-lambda-serverless/dev/previews/0a8e79c2-de1b-4235-a176-06ac5cec9aed

        Type                             Name                                     Plan        Info
        pulumi:pulumi:Stack              aws-py-apigateway-lambda-serverless-dev              
    ~   └─ aws:apigateway:RestApi        demo-openapi-api-gateway-restapi         update      [diff: ~body]
    +-     ├─ aws:apigateway:Deployment  demo-openapi-gateway-deployment          replace     [diff: ~triggers]
    ~      ├─ aws:apigateway:Stage       demo-openapi-gateway-stage               update      [diff: ~deployment]
    +-     └─ aws:lambda:Permission      demo-openapi-lambda-permission           replace     [diff: ~sourceArn]
    
    Resources:
        ~ 2 to update
        +-2 to replace
        4 changes. 8 unchanged

    Do you want to perform this update?  [Use arrows to move, enter to select, type to filter]
    yes
    > no
    details
   ```
1. Select **yes**

   Results
   ```bash
   View Live: https://app.pulumi.com/myuser/aws-py-apigateway-lambda-serverless/dev/updates/32

        Type                             Name                                     Status       Info
        pulumi:pulumi:Stack              aws-py-apigateway-lambda-serverless-dev               
    ~   └─ aws:apigateway:RestApi        demo-openapi-api-gateway-restapi         updated      [diff: ~body]
    +-     ├─ aws:apigateway:Deployment  demo-openapi-gateway-deployment          replaced     [diff: ~triggers]
    ~      └─ aws:apigateway:Stage       demo-openapi-gateway-stage               updated      [diff: ~deployment]
    Resources:
        ~ 2 updated
        +-1 replaced
        3 changes. 9 unchanged
    Outputs:
    + apigateway-rest-endpoint_openapi_custom_path_2: "https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/pets2"

   ```

1. Check the outputs
    ```bash
    pulumi stack output
    ```
    Results
    ```bash
    Current stack outputs (3):
    OUTPUT                                          VALUE
    apigateway-rest-endpoint                        https://k4p4gv27x7.execute-api.us-east-2.amazonaws.com/dev
    apigateway-rest-endpoint_openapi_custom_path_1  https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/test1
    apigateway-rest-endpoint_openapi_custom_path_2  https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/pets2
    ```

1. Validate via curl the 2nd url
    ```bash
    curl -X POST $(pulumi stack output apigateway-rest-endpoint_openapi_custom_path_2)
    ```
    Results
    **Hello World from Pulumi in python via AWS Lambda!!!**

1. Add a new route in the `__main__.py` doing the following, commenting out the **combined_open_spec** that only has **path1_combine & path2_combine** and adding the one with **path3_combine**

    BEFORE
    ```bash
    #combined_open_spec = Output.concat(header_part, path1_combine)
    combined_open_spec = Output.concat(header_part, path1_combine, path2_combine)
    #combined_open_spec = Output.concat(header_part, path1_combine, path2_combine, path3_combine)
    ```

    AFTER
    ```bash
    #combined_open_spec = Output.concat(header_part, path1_combine)
    #combined_open_spec = Output.concat(header_part, path1_combine, path2_combine)
    combined_open_spec = Output.concat(header_part, path1_combine, path2_combine, path3_combine)
    ```
   Also uncomment the following line at the bottom of the `__main__.py`
   ```bash
   pulumi.export("apigateway-rest-endpoint_openapi_custom_path_3", stage_openapi.invoke_url.apply(lambda url: url + custom_url_path_3))
   ```
1. Run `pulumi up` and the results will be
   ```bash
   pulumi up
   ```

   Results
   ```bash
   Previewing update (dev)
    View Live: https://app.pulumi.com/myuser/aws-py-apigateway-lambda-serverless/dev/previews/9f39651f-71a1-4708-8024-4233b0087f25

        Type                             Name                                     Plan        Info
        pulumi:pulumi:Stack              aws-py-apigateway-lambda-serverless-dev              
    ~   └─ aws:apigateway:RestApi        demo-openapi-api-gateway-restapi         update      [diff: ~body]
    +-     ├─ aws:apigateway:Deployment  demo-openapi-gateway-deployment          replace     [diff: ~triggers]
    ~      ├─ aws:apigateway:Stage       demo-openapi-gateway-stage               update      [diff: ~deployment]
    +-     └─ aws:lambda:Permission      demo-openapi-lambda-permission           replace     [diff: ~sourceArn]
    
    Outputs:
    + apigateway-rest-endpoint_openapi_custom_path_3: "https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/pets3"

    Resources:
        ~ 2 to update
        +-2 to replace
        4 changes. 8 unchanged

    Do you want to perform this update?  [Use arrows to move, enter to select, type to filter]
    yes
    > no
    details
   ```

1. Select **yes** and the

   Results
   ```bash
   Updating (dev)

    View Live: https://app.pulumi.com/myuser/aws-py-apigateway-lambda-serverless/dev/updates/34

        Type                             Name                                     Status       Info
        pulumi:pulumi:Stack              aws-py-apigateway-lambda-serverless-dev               
    ~   └─ aws:apigateway:RestApi        demo-openapi-api-gateway-restapi         updated      [diff: ~body]
    +-     ├─ aws:apigateway:Deployment  demo-openapi-gateway-deployment          replaced     [diff: ~triggers]
    ~      └─ aws:apigateway:Stage       demo-openapi-gateway-stage               updated      [diff: ~deployment]
    
    Outputs:
        apigateway-rest-endpoint                      : "https://k4p4gv27x7.execute-api.us-east-2.amazonaws.com/dev"
        apigateway-rest-endpoint_openapi_custom_path_1: "https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/test1"
        apigateway-rest-endpoint_openapi_custom_path_2: "https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/pets2"
    + apigateway-rest-endpoint_openapi_custom_path_3: "https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/pets3"

    Resources:
        ~ 2 updated
        +-1 replaced
        3 changes. 9 unchanged

    Duration: 7s
   ```
1. Check the outputs
    ```bash
    pulumi stack output
    ```
    Results
    ```bash
    Current stack outputs (4):
    OUTPUT                                          VALUE
    apigateway-rest-endpoint                        https://k4p4gv27x7.execute-api.us-east-2.amazonaws.com/dev
    apigateway-rest-endpoint_openapi_custom_path_1  https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/test1
    apigateway-rest-endpoint_openapi_custom_path_2  https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/pets2
    apigateway-rest-endpoint_openapi_custom_path_3  https://62zlkrwz60.execute-api.us-east-2.amazonaws.com/dev/pets3
    ```
1. Validate via curl the 3rd url
    ```bash
    curl -X POST $(pulumi stack output apigateway-rest-endpoint_openapi_custom_path_3)
    ```
    Results
    **Hello World from Pulumi in python via AWS Lambda!!!*

1. To clean up resources, run **pulumi destroy**

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