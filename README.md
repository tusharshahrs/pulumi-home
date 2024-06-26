# Pulumi Examples - Infrastructure as Code

[![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/) [![AZURE TYPESCRIPT](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) [![AZURE GO](https://img.shields.io/badge/AZURE-GO-red)](https://www.pulumi.com/docs/reference/pkg/azure-native/)
[![AZURE CLASSIC TYPESCRIPT](https://img.shields.io/badge/AZURE--CLASSIC-TYPESCRIPT-orange)](https://www.pulumi.com/docs/reference/pkg/azure/)

[![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)

[![GOOGLE-NATIVE PYTHON](https://img.shields.io/badge/GOOGLE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/google-native/)

This repository contains [Pulumi](https://www.pulumi.com/) examples for AWS, Azure, and Google Cloud Platform. The examples are in TypeScript, python, and go.

## Examples are in different languages & different clouds

**ts** = `typescript`, **py** = `python`, **go** = `go`

## Prerequisite - How to Get Started with Pulumi - skip if you have already done this

[![PREREQ](https://img.shields.io/badge/PREREQUISITE-SETUP-red)](https://www.pulumi.com/docs/get-started/)

| CLOUD  | STEPS  | COMMENTS |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| AWS    | 1. Getting Started with [AWS](https://www.pulumi.com/docs/get-started/aws/begin/)                                                               | Start with 1 cloud only. Then when you need to, configure the next cloud. |
| AWS    | 2. Configure your [AWS account](https://www.pulumi.com/docs/get-started/aws/begin/#configure-pulumi-to-access-your-aws-account)                 | Start with 1 cloud only. Then when you need to, configure the next cloud. |
| AZURE  | 1. Getting Started with [AZURE](https://www.pulumi.com/docs/get-started/azure/begin/)                                                           | Start with 1 cloud only. Then when you need to, configure the next cloud. |
| AZURE  | 2. Configure your [Azure account](https://www.pulumi.com/docs/get-started/azure/begin/#configure-pulumi-to-access-your-microsoft-azure-account) | Start with 1 cloud only. Then when you need to, configure the next cloud. |
| GOOGLE | 1.Getting Started with [GOOGLE](https://www.pulumi.com/docs/get-started/gcp/begin/)                                                             | Start with 1 cloud only. Then when you need to, configure the next cloud. |
| GOOGLE | 2.Configure your [Google account](https://www.pulumi.com/docs/get-started/gcp/begin/#configure-pulumi-to-access-your-google-cloud-account)      | Start with 1 cloud only. Then when you need to, configure the next cloud. |

[![PULUMI AccessToken]How to set up your **ACCESS** TOKEN** - Only need to do this once, no need to do it for each cloud.

1. Navigate to **Profile Settings** by selecting your avatar, then [Settings](https://www.pulumi.com/docs/intro/console/accounts/#editing-your-profile).
1. Click on [Access Tokens](https://www.pulumi.com/docs/intro/console/accounts/#access-tokens) on the left side.
1. Create a new _AccessToken_. Copy the AccessToken to your clipboard to use in the next step. Enter your _AccessToken_ on the next step after
1. On your cli: pulumi login

## AWS
Example| Description | Cloud & Language   |
------| ------ | ---------------- |
| [aws-classic-ts-vpc-with-ecs-fargate-py](aws-classic-ts-vpc-with-ecs-fargate-py)| vpc built-in TypeScript - independent from ecs, ecs uses vpc via stackreferences| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/) [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-sshkey](aws-classic-ts-sshkey)| ssh key   | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-vpc-crosswalk](aws-classic-ts-vpc-crosswalk)| vpc built-in TypeScript via [crosswalk](https://www.pulumi.com/docs/guides/crosswalk/aws/vpc/)| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-acm-awsguard](aws-classic-ts-acm-awsguard)| tls private key, aws self signed certificate and acm created. Running awsguard. Calling [pulumi-policy-aws](https://github.com/pulumi/pulumi-policy-aws)| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-launchtemplate](aws-classic-ts-launchtemplate)| ec2 via launchtemplate. also has vpc, securitygroup, & ssh keypair. Addd tags.ts for tags. Calls **then**| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
| [aws-classic-ts-vpc-ecs-autoscaling-lt](aws-classic-ts-vpc-ecs-autoscaling-lt)| vpc, ecs, autoscaling groups, and launchtemplate in TypeScript. This creates a new vpc| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
| [aws-ts-existingvpc-ecs-autoscaling-lt](aws-classic-ts-existingvpc-ecs-autoscaling-lt)| existing vpc, ecs, autoscaling groups, and launchtemplate in TypeScript. Calls **then** creates a new vpc| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-ecs-awsx](aws-classic-ts-ecs-awsx)| uses an existing vpc, creates ecs via awsx, loadbalancer via aws. no targetgroup or targetlistener created. next stack is [aws-classic-ts-get-ecs](aws-classic-ts-get-ecs)| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
| [aws-classic-ts-get-ecs](aws-classic-ts-get-ecs) | uses an existing vpc, calls the existing ecs created via [aws-classic-ts-ecs-awsx](aws-classic-ts-ecs-awsx) | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-eks](aws-classic-ts-eks)| eks cluster with namespace | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
| [aws-classic-ts-eks-spot-mg](aws-classic-ts-eks-spot-mg)| eks cluster with spot managednode instance with vpc via [awsx](https://www.pulumi.com/docs/reference/pkg/nodejs/pulumi/awsx/ec2/#custom-vpcs) | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-eks-awsx-spot](aws-classic-ts-eks-awsx-spot)| eks cluster with no managed nodes, spot nodegroup, and interface nginx with provider with vpc via [awsx](https://www.pulumi.com/docs/reference/pkg/nodejs/pulumi/awsx/ec2/#custom-vpcs) | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-lakeformation](aws-classic-ts-lakeformation)| aws lakeformation permissions | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/) |
| [aws-classic-ts-eks-different-awsprofile](aws-classic-ts-eks-different-awsprofile)| aws eks cluster with awsx vpc with different aws config profile, not using default | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-eks-nodetaint](aws-classic-ts-eks-nodetaint)| aws eks cluster with awsx vpc with no managednodegroup, one fixed nodegroup, and on spot nodegroup. The spot nodegroup has **taints**.| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-eks-node-alltaints](aws-classic-ts-eks-node-alltaints)| aws eks cluster with awsx vpc with no managednodegroup, fixed & spot nodegroup both have **taints**.| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-ebs-volume-snapshot](aws-classic-ts-ebs-volume-snapshot)| aws ebs volume with multiple snapshots. **then** used, for loop used, and [protect](https://www.pulumi.com/docs/intro/concepts/resources/#protect) | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-ec2-instance-with-ebs-volume](aws-classic-ts-ec2-instance-with-ebs-volume)| aws vpc with awsx package, ec2 instance with encrypted storage and 2 ebs volumes added that are encrypted. Call **then** on getAmi and on the subnet ID to use. Also call [interpolate](https://www.pulumi.com/docs/intro/concepts/inputs-outputs/#outputs-and-strings) | [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-vpc-quickstart](aws-classic-ts-vpc-quickstart)| aws vpc with [aws quickstart vpc](https://www.pulumi.com/registry/packages/aws-quickstart-vpc/api-docs/)| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-eks-vpc-sg-default-rules](aws-classic-ts-eks-vpc-sg-default-rules)| aws vpc with EKS with no security group rule passed in [aws quickstart vpc](https://www.pulumi.com/registry/packages/aws-quickstart-vpc/api-docs/)| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-vpc-peeringconnectionoption](aws-classic-ts-vpc-peeringconnectionoption)| 2 vpcs in SAME regions connecting them via [vpcpeeringconnection](https://www.pulumi.com/registry/packages/aws/api-docs/ec2/vpcpeeringconnection/)| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-vpc-peeringconnectionoption](aws-classic-ts-vpc-peeringconnectionoption)| 2 vpcs in different regions via providers and then connecting them via [vpcpeeringconnection](https://www.pulumi.com/registry/packages/aws/api-docs/ec2/vpcpeeringconnection/) cross account| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-ts-vpc-natgatway-strategy](aws-classic-ts-vpc-natgatway-strategy)| awsx multilang vpc with single nat gateway strategy| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/registry/packages/awsx/)|
| [aws-classic-ts-vpc-get-zones-awsx](aws-classic-ts-vpc-get-zones-awsx)| awsx multilang vpc with single nat gateway strategy, availability zones, public and private subnets, NO APPLY| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/registry/packages/awsx/)|
| [aws-classic-ts-securitygroup-vs-securitygrouprules](aws-classic-ts-securitygroup-vs-securitygrouprules)| multilang vpc with single nat gateway strategy, availability zones, public and private subnets,  securitygroup vs securitygroup rules.  Also call self on securitygroup| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/registry/packages/awsx/)|
| [aws-classic-ts-vpc-rds-postgres](aws-classic-ts-vpc-rds-postgres)| multilang vpc with single nat gateway strategy, availability zones, public and private subnets, rds, & [programtically creating secrets](https://www.pulumi.com/docs/intro/concepts/secrets/#programmatically-creating-secrets).| [![AWS TYPESCRIPT](https://img.shields.io/badge/AWS--CLASSIC-TYPESCRIPT-blue)](https://www.pulumi.com/registry/packages/awsx/)|
| [aws-py-ecs-fargate](aws-classic-py-ecs-fargate)| Deploys your own ECS Fargate cluster with tags and uses the vpc via [stackreferences](https://www.pulumi.com/docs/intro/concepts/stack/#stackreferences)| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-s3-staticwebsite](aws-classic-py-s3-staticwebsite)| Deploy you own static site in s3| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-apigateway-lambda-serverless](aws-classic-py-apigateway-lambda-serverless)| API Gateway with lambda. swagger and openapi apigateways. Using the [triggers](https://www.pulumi.com/docs/reference/pkg/aws/apigateway/deployment/#triggers_python) option. added multiple paths| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-dynamodb](aws-classic-py-dynamodb)| dynamodb table| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-vpc](aws-classic-py-vpc)| creates aws vpc, subnet, igw, nat-gateway(1-3), & route tables all in python. no awsx package| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-eks-spot-mg](aws-classic-py-eks-spot-mg)| eks cluster with spot managednode instance. Creates own vpc based on [aws-classic-py-vpc](aws-classic-py-vpc) that is in vpc.py| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-aws-load-balancer-controller-helm-release](aws-classic-py-aws-load-balancer-controller-helm-release)| eks cluster with spot managednode instance. Creates own vpc based on [aws-classic-py-vpc](aws-classic-py-vpc) that is in vpc.py. Installs [aws-load-balancer-controller](https://artifacthub.io/packages/helm/aws/aws-load-balancer-controller) as helm [release](https://www.pulumi.com/registry/packages/kubernetes/api-docs/helm/v3/release/). Also pass in the `cluster` as a `provider` | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-eks](aws-classic-py-eks)| aws eks cluster with namespace| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-eks-spot-nodegroups](aws-classic-py-eks-spot-nodegroups)| aws eks cluster with no managednode group and fixed and spot nodegroups| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-beanstalk](aws-classic-py-beanstalk)| aws beanstalk application| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-get-ami](aws-classic-py-get-ami)| aws get ami| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-get-regions](aws-classic-py-get-regions/)| aws get regions| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-vpc-quickstart](aws-classic-py-vpc-quickstart)| aws vpc with [aws quickstart vpc](https://www.pulumi.com/registry/packages/aws-quickstart-vpc/api-docs/)| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-vpc-msk-kafka-client](aws-classic-py-vpc-msk-kafka-client)| [awsx vpc](https://www.pulumi.com/registry/packages/awsx/api-docs/ec2/vpc/) with kinesis firehose, individual az via apply, msk kafka cluster| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-vpc-msk-kafka-client-part2](aws-classic-py-vpc-msk-kafka-client-part2)| [awsx vpc](https://www.pulumi.com/registry/packages/awsx/api-docs/ec2/vpc/) keypair, ami, ec2 instance as a client | [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-multiple-ec2-ebs](aws-classic-py-multiple-ec2-ebs)| multilanguage [awsx vpc](https://www.pulumi.com/registry/packages/awsx/api-docs/ec2/vpc/) keypair, ami, multiple ec2s with ebs block, with apply| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-vpc-awsx-natgateway-strategy](aws-classic-py-vpc-awsx-natgateway-strategy)| multilanguage [awsx vpc](https://www.pulumi.com/registry/packages/awsx/api-docs/ec2/vpc/) vpc, natgateway single zone strategy, igw, public and private subnets| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-vpc-awsx-natgateway-strategy](aws-classic-py-vpc-awsx-natgateway-strategy)| [awsx vpc](https://www.pulumi.com/registry/packages/awsx/api-docs/ec2/vpc/) multilang vpc with single nat gateway strategy, availability zones, public and private subnets, NO APPLY| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|
| [aws-classic-py-securitygroup-vs-securitygrouprules](aws-classic-py-securitygroup-vs-securitygrouprules)| [awsx vpc](https://www.pulumi.com/registry/packages/awsx/api-docs/ec2/vpc/) multilang vpc with single nat gateway strategy, availability zones, public and private subnets,  securitygroups vs securitygroup rules| [![AWS PYTHON](https://img.shields.io/badge/AWS--CLASSIC-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/aws/)|

## Azure
Example| Description | Cloud & Language   |
------| ------ | ---------------- |
| [azure-classic-py-insights](azure-classic-py-insights)| azure classic resource group, workspace & insights. azure native resource group & workspace mixed with azure classic insights| [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-py-insights](azure-py-insights)| azure native resource group, workspace & azure classic insights. azure native resource group & workspace mixed with azure classic insights| [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-py-vnet](azure-py-vnet)| azure virtual network with 2 subnets.| [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-py-databricks](azure-py-databricks)                                                           | azure databricks. Also retrieving subscription ID and using Output.concat                                                                                                                                                                                                                                                                                                                                                                                                           | [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)                                                                                                                                                       |
| [azure-py-subscriptionid-from-resourcegroup](azure-py-subscriptionid-from-resourcegroup)             | azure resource group creating and retrieving subscriptionId                                                                                                                                                                                                                                                                                                                                                                                                                         | [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)                                                                                                                                                       |
| [azure-py-rg-storageaccounts](azure-py-rg-storageaccounts)                                           | azure resource group and storage account with secret outputs                                                                                                                                                                                                                                                                                                                                                                                                                        | [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)                                                                                                                                                       |
| [azure-py-aks](azure-py-aks)                                                                         | azure resource group, azuread service principal pinned to 4.3.0, aks, and outputs with secret outputs                                                                                                                                                                                                                                                                                                                                                                               | [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)                                                                                                                                                       |
| [azure-py-aks-diagnosticsetting](azure-py-aks-diagnosticsetting)| azure resource group, azuread service principal pinned to 4.3.0, aks, and diagnostic settings and outputs with secret outputs| [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)
| [azure-py-redis](azure-py-redis)| azure resource group, storage account, redis cache, apply, call the [listrediskeys](https://www.pulumi.com/registry/packages/azure-native/api-docs/cache/listrediskeys/) function| [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-py-keyvault-appserviceplan-webservice](azure-py-keyvault-appserviceplan-webservice)| azure resource group, appserviceplan, webapp,keyvault, tenant ID, subscription ID, object ID, replaced `VaultPropertiesResponseArgs` with `VaultPropertiesArgs`| [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-py-storage-account-networkrulesetresponseargs](azure-py-storage-account-networkrulesetresponseargs)| azure resource group, storage account, replaced `NetworkRuleSetResponseArgs` with `NetworkRuleSetArgs`| [![AZURE PYTHON](https://img.shields.io/badge/AZURE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-sqlserver-loganalytics](azure-ts-sqlserver-loganalytics/)| SQL Server database with SQL auditing at the database level sent to log analytics in TypeScript | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)
| [azure-ts-keyvault](azure-ts-keyvault)| create and destroy azure keyvault in TypeScript| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-consumption-budget](azure-ts-consumption-budget)| azure consumption budget and switching languages from German to English| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-classic-ts-datalakegen2](azure-classic-ts-datalakegen2)| azure native resource group, storage account, azure classic datalakegen2 path and datalakegen2 filesystem| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) [![AZURE CLASSIC TYPESCRIPT](https://img.shields.io/badge/AZURE--CLASSIC-TYPESCRIPT-orange)](https://www.pulumi.com/docs/reference/pkg/azure/) |
| [azure-ts-iac-workshop-lab1](azure-ts-iac-workshop-lab1)| azure workshop lab 1, creates resourceg group, storage account, and blob container. Code works independently, does not require workshop| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-serverless-http-trigger](azure-ts-serverless-http-trigger)| azure workshop lab 2, azure serverless http trigger function workshop code. Code works independently, does not require workshop| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-resourcegroup-fixname](azure-ts-resourcegroup-fixname)| azure resource group fixed names| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-subscriptionid-from-resourcegroup](azure-ts-subscriptionid-from-resourcegroup)| azure resource group creating and retrieving subscriptionId| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-jenkins](azure-ts-jenkins)| jenkins deployed on azure function with docker image in ts| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-sqlserver-servervulnerabilityassessment](azure-ts-sqlserver-servervulnerabilityassessment) | azure sql server with vulnerability assessment requires that [Azure Defender for SQL Server](https://docs.microsoft.com/en-us/azure/azure-sql/database/azure-defender-for-sql) turned on at _subscription_ level. Due to Azure Consistency issues, we have to uncomment out code and the run _pulumi up_ a couple of minutes after the sql database has been created| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-sqlserver](azure-ts-sqlserver)| azure sql server with firewall rule that toggles Allow Azure services from `No` to `Yes`| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-synapse-workspace](azure-ts-synapse-workspace)| azure datalakestore with synapse sqlpool| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-synapse-bigdatapool](azure-ts-synapse-bigdatapool)| azure synapse workspace with synapse bigdatapool| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-serverless-www-HTML](azure-ts-serverless-www-html)| azure static site with [StorageAccountStaticWebsite](https://www.pulumi.com/registry/packages/azure-native/api-docs/storage/storageaccountstaticwebsite/)| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-managedinstance](azure-ts-managedinstance)| azure resource group, vnet, subnet1/2 with delegation created. Code for managedinstance is there, do NOT use it when standing up intital stack. Main reason, is that managedinstance takes [3+ hours](azure-ts-managedinstance/images/sqlmanagedinstance_creation_time.png) to stand up. Create managedinstance in [azure portal](https://portal.azure.com/#home) and then [import](https://www.pulumi.com/registry/packages/azure-native/api-docs/sql/managedinstance/#import) it. | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-datafactory](azure-ts-datafactory)| azure datafactory with identity set to SystemAssigned| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-ts-aks-managed-profile](azure-ts-aks-managed-profile)| azure aks with aadprofile input `enableAzureRBAC` toggled| [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-classic-ts-datafactory](azure-classic-ts-datafactory)| azure **classic** datafactory with identity set to SystemAssigned | [![AZURE CLASSIC TYPESCRIPT](https://img.shields.io/badge/AZURE--CLASSIC-TYPESCRIPT-orange)](https://www.pulumi.com/docs/reference/pkg/azure/)|
| [azure-go-aks-diagnosticsetting](azure-go-aks-diagnosticsetting)| azure resource group, azuread service principal pinned to 4.3.0, aks, and diagnostic settings and outputs with secret outputs | [![AZURE GO](https://img.shields.io/badge/AZURE-GO-red)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-go-resourcegroup](azure-go-resourcegroup)| azure resource group and storage account| [![AZURE GO](https://img.shields.io/badge/AZURE-GO-red)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-go-subscriptionid-from-resourcegroup](azure-go-subscriptionid-from-resourcegroup)| azure resource group creating and retrieving subscriptionId| [![AZURE GO](https://img.shields.io/badge/AZURE-GO-red)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-go-sqlserver-loganalytics](azure-go-sqlserver-loganalytics/)| sql server database with sql auditing at the database level sent to log analytics in go. Busted due to [typo](https://github.com/pulumi/pulumi-azure-native/pull/1490)| [![AZURE GO](https://img.shields.io/badge/AZURE-GO-red)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|
| [azure-go-sqlserver-servervulnerabilityassessment](azure-go-sqlserver-servervulnerabilityassessment) | azure sql server with vulnerability assessment requires that [Azure Defender for SQL Server](https://docs.microsoft.com/en-us/azure/azure-sql/database/azure-defender-for-sql) turned on at _subscription_ level. Due to Azure Consistency issues, we have to uncomment out code and the run _pulumi up_ a couple of minutes after the sql database has been created.| [![AZURE GO](https://img.shields.io/badge/AZURE-GO-red)](https://www.pulumi.com/docs/reference/pkg/azure-native/)|

## Google

| Example                                                                                  | Description                                                                                                  | Cloud & Language                                                                                                               |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| [google-native-py-network-postgres-function](google-native-py-network-postgres-function) | google cloud native - storage bucket & vpc & postgres | [![GOOGLE PYTHON](https://img.shields.io/badge/GOOGLE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/google-native/) |
| [google-native-py-bigquerydatatransfer](google-native-py-bigquerydatatransfer)| google cloud native - storage bucket, google classic - bigquery and service account and data transfer config | [![GOOGLE PYTHON](https://img.shields.io/badge/GOOGLE-PYTHON-green)](https://www.pulumi.com/docs/reference/pkg/google-native/) |

## DataDog

| Example                                          | Description         | Cloud & Language                                                                                                                        |
| ------------------------------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [datadog-py-monitorjson](datadog-py-monitorjson) | datadog monitorjson | [![DATADOG PYTHON](https://img.shields.io/badge/DATADOG-Python-blueviolet)](https://www.pulumi.com/registry/packages/datadog/api-docs/) |

## Pulumi

| Example                                          | Description         | Cloud & Language                                                                                                                        |
| ------------------------------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [pulumi-ts-map-string-string](pulumi-ts-map-string-string) | pulumi with no cloud. output `Map<string,string>` is empty while console.log shows the value | [![DATADOG PYTHON](https://img.shields.io/badge/DATADOG-Python-blueviolet)](https://www.pulumi.com/registry/packages/datadog/api-docs/) |

## Workshops

| Example                                | Description                                                   | Cloud & Language                                                                                                                   |
| -------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [azure-workshop-ts](azure-workshop-ts) | azure serverless http trigger function workshop in TypeScript | [![AZURE typescript](https://img.shields.io/badge/AZURE-TYPESCRIPT-blue)](https://www.pulumi.com/docs/reference/pkg/azure-native/) |

[![PULUMI GITHUB ACTIONS](https://img.shields.io/badge/GITHUB-ACTIONS-lightgrey)](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/)

## Pulumi GitHub Actions Setup (Optional)

We have setup [Pulumi GitHub Actions](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#pulumi-github-actions).

1. Located in [.github/workflows](.github/workflows)

1. Pull WorkFlow Files for Python with comments by GitHub actions

    - aws [pull_request_python_aws.yml](.github/workflows/pull_request_python_aws.yml)
    - azure [pull_request_python_azure.yml](.github/workflows/pull_request_python_azure.yml)
    - gcp [pull_request_python_gcp.yml](.github/workflows/pull_request_python_gcp.yml)

1. Pull WorkFlow Files for TypeScript with comments by GitHub actions

    - aws [pull_request_typescript_aws.yml](.github/workflows/pull_request_typescript_aws.yml)
    - azure [pull_request_typescript_azure.yml](.github/workflows/pull_request_typescript_azure.yml)

1. Pull WorkFlow Files for Go with comments by GitHub actions

    - aws, azure, & gcp [pull_request_go.yml](.github/workflows/pull_request_go.yml)

1. SuperLinter setup

    - [super-linter](https://github.com/github/super-linter) setup
    - superlinter.yml - `.github/workflows/superlinter.yml`
    - [slim image](https://github.com/github/super-linter#slim-image)
    - VALIDATE_PYTHON_BLACK turned OFF
    - VALIDATE_PYTHON_FLAKE8 turned OFF
    - VALIDATE_PYTHON_ISORT turned OFF
    - VALIDATE_TYPESCRIPT_STANDARD turned OFF

1. AWS SSO login in for GitHub Actions

    - Set this[AWS SESSION TOKEN](https://github.com/aws-actions/configure-aws-credentials/blob/master/action.yml#L19) in pipeline
    - Set the token via [aws-sso-creds get](https://github.com/jaxxstorm/aws-sso-creds#get-credentials)

1. Removed from githubactions pipeline due to service principal issues even though preview and up work via cli
    - azure-ts-keyvault, azure-classic-ts-datalakegen2, azure-classic-ts-datafactory
    - azure-py-insights, azure-classic-py-insights, azure-py-aks-diagnosticsetting

## License

[![license](https://img.shields.io/badge/license-MIT-green)](https://tldrlegal.com/license/mit-license)
