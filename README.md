# Examples

This repo is essentially a staging ground for pulumi examples. As I learn more about using Pulumi in all the different languages, this may graduate to [pulumi examples](https://github.com/pulumi/examples)

## Examples are in different languages

**ts** = `typescript`

**py** = `python`

**go** = `go`

## AWS
Example   | Description |
--------- | ----------- |
[aws-ts-vpc-with-ecs-fargate-py](aws-ts-vpc-with-ecs-fargate-py)| vpc built in typescript - independent from ecs, ecs uses vpc via stackreferences
[aws-ts-sshkey](aws-ts-sshkey)| ssh key
[aws-ts-vpc-crosswalk](aws-ts-vpc-crosswalk)| vpc built in typescript via [crosswalk](https://www.pulumi.com/docs/guides/crosswalk/aws/vpc/)
[aws-ts-acm-awsguard](aws-ts-acm-awsguard) | tls private key, aws self signed certificate and acm created. Running awsguard. Calling [pulumi-policy-aws](https://github.com/pulumi/pulumi-policy-aws)
[aws-ts-launchtemplate](aws-ts-launchtemplate) | ec2 via launchtemplate.  also has vpc, securitygroup, & ssh keypair. Calls **then**
[aws-ts-vpc-ecs-autoscaling-lt](aws-ts-vpc-ecs-autoscaling-lt)| vpc, ecs, autoscaling groups, and launchtemplate in typescript. This creates a new vpc
[aws-ts-existingvpc-ecs-autoscaling-lt](aws-ts-existingvpc-ecs-autoscaling-lt)| existing vpc, ecs, autoscaling groups, and launchtemplate in typescript. Calls **then** creates a new vpc
[aws-ts-ecs-awsx](aws-ts-ecs-awsx) | uses an existing vpc, creates ecs via awsx, loadbalancer via aws.  no targetgroup or targetlistener created.  next stack is [aws-ts-get-ecs](aws-ts-get-ecs)
[aws-ts-get-ecs](aws-ts-get-ecs)| uses an existing vpc, calls the existing ecs created via [aws-ts-ecs-awsx](aws-ts-ecs-awsx)
[aws-ts-eks-spot-mg](aws-ts-eks-spot-mg) | eks cluster with spot managednode instance with vpc via [awsx](https://www.pulumi.com/docs/reference/pkg/nodejs/pulumi/awsx/ec2/#custom-vpcs)
[aws-ts-lakeformation](aws-ts-lakeformation) | aws lakeformation permissions
[aws-ts-eks-different-awsprofile](aws-ts-eks-different-awsprofile) | aws eks cluster with awsx vpc with different aws config profile, not using default
[aws-py-ecs-fargate](aws-py-ecs-fargate)| Deploys your own ECS Fargate cluster with tags and uses the vpc via [stackreferences](https://www.pulumi.com/docs/intro/concepts/stack/#stackreferences)
[aws-py-s3-staticwebsite](aws-py-s3-staticwebsite) | Deploy you own static website in s3
[aws-py-apigateway-lambda-serverless](aws-py-apigateway-lambda-serverless)| api gateway with lambda. swagger and openapi apigateways.  Using the [triggers](https://www.pulumi.com/docs/reference/pkg/aws/apigateway/deployment/#triggers_python) option. added multiple paths
[aws-py-dynamodb](aws-py-dynamodb)| dynamodb table
[aws-py-vpc](aws-py-vpc) | creates aws vpc, subnet, igw, nat-gateway(1-3), & route tables all in python. no awsx package
[aws-py-eks-spot-mg](aws-py-eks-spot-mg) | eks cluster with spot managednode instance.  Creates own vpc based on [aws-py-vpc](aws-py-vpc) that is in vpc.ts
[aws-py-eks-spot-nodegroups](aws-py-eks-spot-nodegroups)| aws eks cluster with no managednode group and fixed and spot node groups
[aws-py-beanstalk](aws-py-beanstalk )| aws beanstalk application


## Azure
Example   | Description |
--------- | ----------- |
[azure-classic-py-insights](azure-classic-py-insights) | azure classic resource group, workspace & insights.  azure native resource group & workspace mixed with azure classic insights
[azure-py-vnet](azure-py-vnet)| azure virtual network with 2 subnets.
[azure-py-databricks](azure-py-databricks)| azure databricks.  Also retrieving subscription id and using Output.concat
[azure-py-subscriptionid-from-resourcegroup](azure-py-subscriptionid-from-resourcegroup) | azure resource group creating and retrieving subscriptionId
[azure-ts-sqlserver-loganalytics](azure-ts-sqlserver-loganalytics/) | sql server database with sql auditing at the database level sent to log analytics in typescript
[azure-ts-keyvault](azure-ts-keyvault) | create and destroy azure keyvault in typescript
[azure-ts-consumption-budget](azure-ts-consumption-budget) | azure consumption budget and switching languages from German to English
[azure-ts-datalakegen2](azure-ts-datalakegen2) | azure native resource group, storage account, azure classic datalakegen2 path and datalakegen2 filesystem
[azure-ts-iac-workshop-lab1](azure-ts-iac-workshop-lab1) | azure workshop lab 1, creates resourceg group, storage account, and blob container. Code works independently, doesn't require workshop
[azure-ts-serveless-http-trigger](azure-ts-serveless-http-trigger)| azure workshop lab 2, azure serverless http trigger function workshop code. Code works independently, doesn't require workshop
[azure-ts-resourcegroup-fixname](azure-ts-resourcegroup-fixname) | azure resource group fixed name
[azure-ts-subscriptionid-from-resourcegroup](azure-ts-subscriptionid-from-resourcegroup) | azure resource group creating and retrieving subscriptionId
[azure-go-subscriptionid-from-resourcegroup](azure-go-subscriptionid-from-resourcegroup) | azure resource group creating and retrieving subscriptionId
[azure-go-sqlserver-loganalytics](azure-go-sqlserver-loganalytics/) | sql server database with sql auditing at the database level sent to log analytics in go.

## Google
Example   | Description |
--------- | ----------- |
[google-native-py-network-postgres-function](google-native-py-network-postgres-function) | google cloud native - storage bucket & vpc & postgres

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