# Examples

This repo is essentially a staging ground for pulumi examples. As I learn more about using Pulumi in all the different languages, this may graduate to [pulumi examples](https://github.com/pulumi/examples)

## Examples are in different languages

**ts** = `typescript`

**py** = `python`

## AWS
Example   | Description |
--------- | ----------- |
[aws-ts-vpc-with-ecs-fargate-py](aws-ts-vpc-with-ecs-fargate-py)| vpc built in typescript - independent from ecs, ecs uses vpc via stackreferences
[aws-ts-sshkey](aws-ts-sshkey)| ssh key
[aws-ts-vpc-crosswalk](aws-ts-vpc-crosswalk)| vpc built in typescript via [crosswalk](https://www.pulumi.com/docs/guides/crosswalk/aws/vpc/)
[aws-py-ecs-fargate](aws-py-ecs-fargate)| Deploys your own ECS Fargate cluster with tags and uses the vpc via [stackreferences](https://www.pulumi.com/docs/intro/concepts/stack/#stackreferences)
[aws-py-s3-staticwebsite](aws-py-s3-staticwebsite) | Deploy you own static website in s3
[aws-ts-acm-awsguard](aws-ts-acm-awsguard) | tls private key, aws self signed certificate and acm created. Running awsguard. Calling [pulumi-policy-aws](https://github.com/pulumi/pulumi-policy-aws)
[aws-py-apigateway-lambda-serverless](aws-py-apigateway-lambda-serverless)| api gateway with lambda. swagger and openapi apigateways.  Using the [triggers](https://www.pulumi.com/docs/reference/pkg/aws/apigateway/deployment/#triggers_python) option. added multiple paths


## Azure
Example   | Description |
--------- | ----------- |
[azure-ts-iac-workshop-lab1](azure-ts-iac-workshop-lab1) | azure workshop lab 1, creates resourceg group, storage account, and blob container. Code works independently, doesn't require workshop
[azure-ts-serveless-http-trigger](azure-ts-serveless-http-trigger)| azure workshop lab 2, azure serverless http trigger function workshop code. Code works independently, doesn't require workshop
[azure-ts-resourcegroup-fixname](azure-ts-resourcegroup-fixname) | azure resource group fixed name
[azure-py-vnet](azure-py-vnet)| azure virtual network with 2 subnets.
[azure-py-subscriptionid-from-resourcegroup](azure-py-subscriptionid-from-resourcegroup) | azure resource group creating and retrieving subscriptionId
[azure-py-databricks](azure-py-databricks)| azure databricks.  Also retrieving subscription id and using Output.concat

## Google
Example   | Description |
--------- | ----------- |
[google-native-py-network-postgres-function](google-native-py-network-postgres-function) | google cloud native - storage bucket only so far

## Workshops
Example   | Description |
--------- | ----------- |
[azure-workshop-ts](azure-workshop-ts)| azure serverless http trigger function workshop in typescript

## Pulumi Github Actions Setup (Optional)
We have setup [Pulumi Github Actions](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#pulumi-github-actions).

 1. Located in [.github/workflows](.github/workflows)

 1. Pull WorkFlow Files for Python with comments by github actions
    - [pull_request_python.yml](.github/workflows/pull_request_python.yml)

 1. Pull WorkFlow Files for Typescript with comments by github actions
    - [pull_request_ts.yml](.github/workflows/pull_request_typescript.yml)

 1. SuperLinter setup
    - [super-linter](https://github.com/github/super-linter) setup
    - superlinter.yml - `.github/workflows/superlinter.yml`
    - [slim image](https://github.com/github/super-linter#slim-image)
    - VALIDATE_PYTHON_BLACK turned OFF
    - VALIDATE_PYTHON_FLAKE8 turned OFF
    - VALIDATE_PYTHON_ISORT turned OFF
    - VALIDATE_TYPESCRIPT_STANDARD turned OFF