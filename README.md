# Pulumi Examples - Infrastructure as Code
[![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)      [![AZURE TYPESCRIPT](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)    [![AZURE GO](https://img.shields.io/badge/AZURE-GO-red)](https://www.pulumi.com/docs/reference/pkg/azure-native/)
[![AZURE CLASSIC TYPESCRIPT](https://img.shields.io/badge/AZURE--CLASSIC-TYPESCRIPT-orange)](https://www.pulumi.com/docs/reference/pkg/azure/)

[![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)             [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)  

[![GOOGLE-NATIVE PYTHON](https://img.shields.io/badge/GOOGLE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/google-native/)

This repo contains [Pulumi](https://www.pulumi.com/) examples for aws, azure, and gcp. The examples are in typescript, python, and go.

## Examples are in different languages & different clouds

**ts** = `typescript`,  **py** = `python`,  **go** = `go`


## Prerequisite - How to Get Started with Pulumi - skip if you have already done this
[![PREREQ](https://img.shields.io/badge/PREREQUISITE-SETUP-red)](https://www.pulumi.com/docs/get-started/)

CLOUD     |   STEPS | COMMENTS |
--------- | ----------- | --------|
AWS | 1. Getting Started with [AWS](https://www.pulumi.com/docs/get-started/aws/begin/) | Start with 1 cloud only.  Then when you need to, configure the next cloud. |
AWS | 2. Configure your [AWS account](https://www.pulumi.com/docs/get-started/aws/begin/#configure-pulumi-to-access-your-aws-account) | Start with 1 cloud only.  Then when you need to, configure the next cloud. |
AZURE | 1. Getting Started with [AZURE](https://www.pulumi.com/docs/get-started/azure/begin/) | Start with 1 cloud only.  Then when you need to, configure the next cloud. |
AZURE | 2. Configure your [Azure account](https://www.pulumi.com/docs/get-started/azure/begin/#configure-pulumi-to-access-your-microsoft-azure-account) | Start with 1 cloud only.  Then when you need to, configure the next cloud. |
GOOGLE | 1.Getting Started with [GOOGLE](https://www.pulumi.com/docs/get-started/gcp/begin/) | Start with 1 cloud only.  Then when you need to, configure the next cloud. |
GOOGLE | 2.Configure your [Google account](https://www.pulumi.com/docs/get-started/gcp/begin/#configure-pulumi-to-access-your-google-cloud-account) | Start with 1 cloud only.  Then when you need to, configure the next cloud. |


[![PULUMI AccessToken](https://img.shields.io/badge/PULUMI-ACCESS--TOKEN-purple)](https://www.pulumi.com/docs/intro/console/accounts/#access-tokens)

How to setup your **ACCESS TOKEN**  - Only need to do this once, no need to do it for each cloud.
1. Navigate to **Profile Settings** by selecting your avatar, then [Settings](https://www.pulumi.com/docs/intro/console/accounts/#editing-your-profile).
1. Click on [Access Tokens](https://www.pulumi.com/docs/intro/console/accounts/#access-tokens) on the left side.
1. Create a new *AccessToken*. Copy the AccessToken to your clipboard to use in the next step. Enter your *AccessToken* on the next step after
1. On your cli: pulumi login


## AWS
Example| Description | Cloud & Language   |
------| ------ | ---------------- |
[aws-classic-ts-vpc-with-ecs-fargate-py](aws-classic-ts-vpc-with-ecs-fargate-py)| vpc built in typescript - independent from ecs, ecs uses vpc via stackreferences | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-sshkey](aws-classic-ts-sshkey)| ssh key | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-vpc-crosswalk](aws-classic-ts-vpc-crosswalk)| vpc built in typescript via [crosswalk](https://www.pulumi.com/docs/guides/crosswalk/aws/vpc/) | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-acm-awsguard](aws-classic-ts-acm-awsguard) | tls private key, aws self signed certificate and acm created. Running awsguard. Calling [pulumi-policy-aws](https://github.com/pulumi/pulumi-policy-aws) | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-launchtemplate](aws-classic-ts-launchtemplate) | ec2 via launchtemplate.  also has vpc, securitygroup, & ssh keypair. Addd tags.ts for tags. Calls **then** | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-vpc-ecs-autoscaling-lt](aws-classic-ts-vpc-ecs-autoscaling-lt)| vpc, ecs, autoscaling groups, and launchtemplate in typescript. This creates a new vpc | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-ts-existingvpc-ecs-autoscaling-lt](aws-classic-ts-existingvpc-ecs-autoscaling-lt)| existing vpc, ecs, autoscaling groups, and launchtemplate in typescript. Calls **then** creates a new vpc | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-ecs-awsx](aws-classic-ts-ecs-awsx) | uses an existing vpc, creates ecs via awsx, loadbalancer via aws.  no targetgroup or targetlistener created.  next stack is [aws-classic-ts-get-ecs](aws-ts-get-ecs) | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-get-ecs](aws-classic-ts-get-ecs)| uses an existing vpc, calls the existing ecs created via [aws-ts-ecs-awsx](aws-ts-ecs-awsx) | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-eks-spot-mg](aws-classic-ts-eks-spot-mg) | eks cluster with spot managednode instance with vpc via [awsx](https://www.pulumi.com/docs/reference/pkg/nodejs/pulumi/awsx/ec2/#custom-vpcs) | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-lakeformation](aws-classic-ts-lakeformation) | aws lakeformation permissions | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-eks-different-awsprofile](aws-classic-ts-eks-different-awsprofile) | aws eks cluster with awsx vpc with different aws config profile, not using default | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-eks-nodetaint](aws-classic-ts-eks-nodetaint)| aws eks cluster with awsx vpc with no managednodegroup, one fixed nodegroup, and on spot nodegroup.  The spot nodegroup has **taints**. |  [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-eks-node-alltaints](aws-classic-ts-eks-node-alltaints)| aws eks cluster with awsx vpc with no managednodegroup, fixed & spot nodegroup both have **taints**. |  [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-ebs-volume-snapshot](aws-classic-ts-ebs-volume-snapshot )| aws ebs volume with multiple snapshots.  **then** used, for loop used, and [protect](https://www.pulumi.com/docs/intro/concepts/resources/#protect) |  [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-ts-ec2-instance-with-ebs-volume](aws-classic-ts-ec2-instance-with-ebs-volume)| aws vpc with awsx package, ec2 instance with encrypted storage and 2 ebs volumes added that are encrypted. Call **then** on getAmi and on the subnet id to use.  Also call [interpolate](https://www.pulumi.com/docs/intro/concepts/inputs-outputs/#outputs-and-strings) |  [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-py-ecs-fargate](aws-classic-py-ecs-fargate)| Deploys your own ECS Fargate cluster with tags and uses the vpc via [stackreferences](https://www.pulumi.com/docs/intro/concepts/stack/#stackreferences) | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-py-s3-staticwebsite](aws-classic-py-s3-staticwebsite) | Deploy you own static website in s3 | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-py-apigateway-lambda-serverless](aws-classic-py-apigateway-lambda-serverless)| api gateway with lambda. swagger and openapi apigateways.  Using the [triggers](https://www.pulumi.com/docs/reference/pkg/aws/apigateway/deployment/#triggers_python) option. added multiple paths | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-py-dynamodb](aws-classic-py-dynamodb)| dynamodb table | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-py-vpc](aws-classic-py-vpc) | creates aws vpc, subnet, igw, nat-gateway(1-3), & route tables all in python. no awsx package | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-py-eks-spot-mg](aws-classic-py-eks-spot-mg) | eks cluster with spot managednode instance.  Creates own vpc based on [aws-py-vpc](aws-py-vpc) that is in vpc.ts | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-py-eks-spot-nodegroups](aws-classic-py-eks-spot-nodegroups)| aws eks cluster with no managednode group and fixed and spot node groups | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-py-beanstalk](aws-classic-py-beanstalk )| aws beanstalk application | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-py-get-ami](aws-classic-py-get-ami) | aws get ami | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) |
[aws-classic-py-get-regions](aws-classic-py-get-regions/)| aws get regions | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) |

## Azure
Example| Description | Cloud & Language   |
------| ------ | ---------------- |
[azure-classic-py-insights](azure-classic-py-insights) | azure classic resource group, workspace & insights.  azure native resource group & workspace mixed with azure classic insights | [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-py-vnet](azure-py-vnet)| azure virtual network with 2 subnets. | [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-py-databricks](azure-py-databricks)| azure databricks.  Also retrieving subscription id and using Output.concat | [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-py-subscriptionid-from-resourcegroup](azure-py-subscriptionid-from-resourcegroup) | azure resource group creating and retrieving subscriptionId | [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-ts-sqlserver-loganalytics](azure-ts-sqlserver-loganalytics/) | sql server database with sql auditing at the database level sent to log analytics in typescript | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-ts-keyvault](azure-ts-keyvault) | create and destroy azure keyvault in typescript | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-ts-consumption-budget](azure-ts-consumption-budget) | azure consumption budget and switching languages from German to English | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-classic-ts-datalakegen2](azure-classic-ts-datalakegen2) | azure native resource group, storage account, azure classic datalakegen2 path and datalakegen2 filesystem | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) [![AZURE CLASSIC TYPESCRIPT](https://img.shields.io/badge/AZURE--CLASSIC-TYPESCRIPT-orange)](https://www.pulumi.com/docs/reference/pkg/azure/) |
[azure-ts-iac-workshop-lab1](azure-ts-iac-workshop-lab1) | azure workshop lab 1, creates resourceg group, storage account, and blob container. Code works independently, doesn't require workshop | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-ts-serveless-http-trigger](azure-ts-serveless-http-trigger)| azure workshop lab 2, azure serverless http trigger function workshop code. Code works independently, doesn't require workshop | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-ts-resourcegroup-fixname](azure-ts-resourcegroup-fixname) | azure resource group fixed name | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-ts-subscriptionid-from-resourcegroup](azure-ts-subscriptionid-from-resourcegroup) | azure resource group creating and retrieving subscriptionId |[![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-go-subscriptionid-from-resourcegroup](azure-go-subscriptionid-from-resourcegroup) | azure resource group creating and retrieving subscriptionId | [![AZURE GO](https://img.shields.io/badge/AZURE-GO-red)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-ts-jenkins](azure-ts-jenkins) | jenkins deployed on azure function with docker image in ts. | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-ts-sqlserver-servervulnerabilityassessment](azure-ts-sqlserver-servervulnerabilityassessment) | azure sql server with vulnerability assessment requires that [Azure Defender for SQL Server](https://docs.microsoft.com/en-us/azure/azure-sql/database/azure-defender-for-sql) turned on at *subscription* level. Due to Azure Consistency issues, we have to uncomment out code and the run *pulumi up* a couple of minutes after the sql database has been created. | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |
[azure-go-sqlserver-loganalytics](azure-go-sqlserver-loganalytics/) | sql server database with sql auditing at the database level sent to log analytics in go. | [![AZURE GO](https://img.shields.io/badge/AZURE-GO-red)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |

## Google
Example   | Description | Cloud & Language   |
--------- | -------- | -------------- |
[google-native-py-network-postgres-function](google-native-py-network-postgres-function) | google cloud native - storage bucket & vpc & postgres |[![GOOGLE PYTHON](https://img.shields.io/badge/GOOGLE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/google-native/)|

## Workshops
Example   | Description | Cloud & Language   |
--------- | ----------- | ------------------ |
[azure-workshop-ts](azure-workshop-ts)| azure serverless http trigger function workshop in typescript |[![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |


[![PULUMI GITHUB ACTIONS](https://img.shields.io/badge/GITHUB-ACTIONS-lightgrey)](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/)
## Pulumi Github Actions Setup (Optional)
We have setup [Pulumi Github Actions](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#pulumi-github-actions).

 1. Located in [.github/workflows](.github/workflows)

 1. Pull WorkFlow Files for Python with comments by github actions
    - aws [pull_request_python_aws.yml](.github/workflows/pull_request_python_aws.yml)
    - azure [pull_request_python_azure.yml](.github/workflows/pull_request_python_azure.yml)
    - gcp [pull_request_python_gcp.yml](.github/workflows/pull_request_python_gcp.yml)

 1. Pull WorkFlow Files for Typescript with comments by github actions
    - aws [pull_request_typescript_aws.yml](.github/workflows/pull_request_typescript_aws.yml)
    - azure [pull_request_typescript_azure.yml](.github/workflows/pull_request_typescript_azure.yml)

 1. Pull WorkFlow Files for Go with comments by github actions
    - aws, azure, & gcp [pull_request_go.yml](.github/workflows/pull_request_go.yml)

 1. SuperLinter setup
    - [super-linter](https://github.com/github/super-linter) setup
    - superlinter.yml - `.github/workflows/superlinter.yml`
    - [slim image](https://github.com/github/super-linter#slim-image)
    - VALIDATE_PYTHON_BLACK turned OFF
    - VALIDATE_PYTHON_FLAKE8 turned OFF
    - VALIDATE_PYTHON_ISORT turned OFF
    - VALIDATE_TYPESCRIPT_STANDARD turned OFF

## License
[![license](https://img.shields.io/badge/license-MIT-green)](https://tldrlegal.com/license/mit-license)