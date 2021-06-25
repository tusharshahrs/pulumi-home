# AWS apigateway with lambda in python

Create an apigatway with lambda in python.

## Deploying and running the program

Note: some values in this example will be different from run to run.  These values are indicated
with `***`.

1. Create a new stack:

    ```bash
    pulumi stack init dev
    ```

1. Set the AWS region:

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

    Result:
    ```bash
    Previewing update (dev)

    View Live: https://app.pulumi.com/myuser/aws-py-apigateway-lambda/dev/previews/3d8befe8-4911-452b-8ca0-789d4a0a8192

        Type                          Name                          Plan       
    +   pulumi:pulumi:Stack           aws-py-apigateway-lambda-dev  create..   
    +   pulumi:pulumi:Stack           aws-py-apigateway-lambda-dev  create     
    +   ├─ aws:iam:Role               demo-lambdaRole               create     
    +   ├─ aws:apigateway:ApiKey      demo-marv-internal            create     
    +   ├─ aws:iam:RolePolicy         demo-lambda-api-iam-policy    create     
    +   ├─ aws:s3:BucketObject        demo-hello                    create     
    +   ├─ aws:lambda:Function        demo-api-airtable             create     
    +   ├─ aws:lambda:Permission      demo-api-lambda-permission    create     
    +   ├─ aws:apigateway:RestApi     demo-api-gateway              create     
    +   ├─ aws:apigateway:Deployment  demo-api-gateway-deployment   create     
    +   └─ aws:apigateway:Stage       demo-api-gateway-stage        create     
    
    Resources:
        + 11 to create

    Do you want to perform this update?  [Use arrows to move, enter to select, type to filter]
    yes
    > no
    details
    ```

1. Select **yes** and the resources will be created
    Results
    ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/myuser/aws-py-apigateway-lambda/dev/updates/1

        Type                          Name                          Status       
    +   pulumi:pulumi:Stack           aws-py-apigateway-lambda-dev  creating     
    +   ├─ aws:s3:Bucket              demo-artifacts                created     
    +   ├─ aws:iam:Role               demo-lambdaRole               created     
    +   ├─ aws:apigateway:ApiKey      demo-marv-internal            created     
    +   ├─ aws:iam:RolePolicy         demo-lambda-api-iam-policy    created     
    +   ├─ aws:lambda:Function        demo-api-airtable             created     
    +   ├─ aws:s3:BucketObject        demo-hello                    created     
    +   ├─ aws:lambda:Permission      demo-api-lambda-permission    created     
    +   ├─ aws:apigateway:RestApi     demo-api-gateway              created     
    +   ├─ aws:apigateway:Deployment  demo-api-gateway-deployment   created     
    +   └─ aws:apigateway:Stage       demo-api-gateway-stage        created     
    
    Outputs:
        api_airtable.invoke_arn             : "arn:aws:apigateway:us-east-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-2:052848974346:function:demo-api-airtable-57e9bb1/invocations"
        api_airtable_id                     : "demo-api-airtable-57e9bb1"
        api_airtable_layer_zip_id__s3_object: "demo-hello"
        api_airtable_name                   : "demo-api-airtable-57e9bb1"
        api_gateway_deployment_id           : "28k4di"
        api_gateway_deployment_invoke_url   : "https://x9x67i4m00.execute-api.us-east-2.amazonaws.com/"
        api_gateway_restapi_excution_arn    : "arn:aws:execute-api:us-east-2:1234556789:x9x67i4m00"
        api_gateway_restapi_id              : "x9x67i4m00"
        api_gateway_stage_excution_arn      : "arn:aws:execute-api:us-east-2:1234556789:x9x67i4m00/dev"
        api_gateway_stage_id                : "ags-x9x67i4m00-dev"
        api_lambda_permission_name          : "demo-api-lambda-permission-41fffc4"
        api_lambda_role_arn                 : "arn:aws:iam::1234556789:role/demo-lambdaRole-f97a747"
        api_lambda_role_id                  : "demo-lambdaRole-f97a747"
        api_lambda_role_name                : "demo-lambdaRole-f97a747"
        api_lambda_role_policy_id           : "demo-lambdaRole-f97a747:demo-lambda-api-iam-policy-1d5fea5"
        api_lambda_role_policy_name         : "demo-lambda-api-iam-policy-1d5fea5"
        bucket_name                         : "demo-artifacts-6f40742"
        marv_api_key_id                     : "cc0auh204h"
        marv_api_key_name                   : "demo-marv-internal-970b238"

    Resources:
        + 11 created

    Duration: 24s
    ```
1. To see the resources that were created, run `pulumi stack output`:

    ```bash
    pulumi stack output
    ```

    Result
    ```bash
    Current stack outputs (19):
    OUTPUT                                VALUE
    api_airtable.invoke_arn               arn:aws:apigateway:us-east-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-2:052848974346:function:demo-api-airtable-57e9bb1/invocations
    api_airtable_id                       demo-api-airtable-57e9bb1
    api_airtable_layer_zip_id__s3_object  demo-hello
    api_airtable_name                     demo-api-airtable-57e9bb1
    api_gateway_deployment_id             28k4di
    api_gateway_deployment_invoke_url     https://x9x67i4m00.execute-api.us-east-2.amazonaws.com/
    api_gateway_restapi_excution_arn      arn:aws:execute-api:us-east-2:123456789:x9x67i4m00
    api_gateway_restapi_id                x9x67i4m00
    api_gateway_stage_excution_arn        arn:aws:execute-api:us-east-2:123456789:x9x67i4m00/dev
    api_gateway_stage_id                  ags-x9x67i4m00-dev
    api_lambda_permission_name            demo-api-lambda-permission-41fffc4
    api_lambda_role_arn                   arn:aws:iam::123456789:role/demo-lambdaRole-f97a747
    api_lambda_role_id                    demo-lambdaRole-f97a747
    api_lambda_role_name                  demo-lambdaRole-f97a747
    api_lambda_role_policy_id             demo-lambdaRole-f97a747:demo-lambda-api-iam-policy-1d5fea5
    api_lambda_role_policy_name           demo-lambda-api-iam-policy-1d5fea5
    bucket_name                           demo-artifacts-6f40742
    marv_api_key_id                       cc0auh204h
    marv_api_key_name                     demo-marv-internal-970b238
    ```

1.  To clean up resources, run **pulumi destroy**
    ```bash
    pulumi destroy -y
    ```

    Results
    ```bash
    View Live: https://app.pulumi.com/myuser/aws-py-apigateway-lambda/dev/updates/2

        Type                          Name                          Status       
        pulumi:pulumi:Stack           aws-py-apigateway-lambda-dev               
    -   ├─ aws:apigateway:Stage       demo-api-gateway-stage        deleted     
    -   ├─ aws:apigateway:Deployment  demo-api-gateway-deployment   deleted     
    -   ├─ aws:lambda:Permission      demo-api-lambda-permission    deleted     
    -   ├─ aws:apigateway:RestApi     demo-api-gateway              deleted     
    -   ├─ aws:iam:RolePolicy         demo-lambda-api-iam-policy    deleted     
    -   ├─ aws:s3:BucketObject        demo-hello                    deleted     
    -   ├─ aws:lambda:Function        demo-api-airtable             deleted     
    -   ├─ aws:apigateway:ApiKey      demo-marv-internal            deleted     
    -   ├─ aws:s3:Bucket              demo-artifacts                deleted     
    -   └─ aws:iam:Role               demo-lambdaRole               deleted     
    
    Outputs:
    - api_airtable.invoke_arn             : "arn:aws:apigateway:us-east-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-2:052848974346:function:demo-api-airtable-57e9bb1/invocations"
    - api_airtable_id                     : "demo-api-airtable-57e9bb1"
    - api_airtable_layer_zip_id__s3_object: "demo-hello"
    - api_airtable_name                   : "demo-api-airtable-57e9bb1"
    - api_gateway_deployment_id           : "28k4di"
    - api_gateway_deployment_invoke_url   : "https://x9x67i4m00.execute-api.us-east-2.amazonaws.com/"
    - api_gateway_restapi_excution_arn    : "arn:aws:execute-api:us-east-2:1234556789:x9x67i4m00"
    - api_gateway_restapi_id              : "x9x67i4m00"
    - api_gateway_stage_excution_arn      : "arn:aws:execute-api:us-east-2:1234556789:x9x67i4m00/dev"
    - api_gateway_stage_id                : "ags-x9x67i4m00-dev"
    - api_lambda_permission_name          : "demo-api-lambda-permission-41fffc4"
    - api_lambda_role_arn                 : "arn:aws:iam::052848974346:role/demo-lambdaRole-f97a747"
    - api_lambda_role_id                  : "demo-lambdaRole-f97a747"
    - api_lambda_role_name                : "demo-lambdaRole-f97a747"
    - api_lambda_role_policy_id           : "demo-lambdaRole-f97a747:demo-lambda-api-iam-policy-1d5fea5"
    - api_lambda_role_policy_name         : "demo-lambda-api-iam-policy-1d5fea5"
    - bucket_name                         : "demo-artifacts-6f40742"
    - marv_api_key_id                     : "cc0auh204h"
    - marv_api_key_name                   : "demo-marv-internal-970b238"

    Resources:
        - 11 deleted

    Duration: 6s
    ```