# CHANGELOG

## (2022-10-31)
- added azure-py-storage-account-networkrulesetresponseargs
## (2022-10-27)
- added azure-py-keyvault-appserviceplan-webservice
## (2022-10-19)
- added pulumi-ts-map-string-string
- added azure-ts-aks-managed-profile
## (2022-10-05)
- added aws-classic-ts-vpc-routetables-no-loops
## (2022-10-04)
- added aws-classic-ts-vpc-routetables
## (2022-09-26)
- added aws-classic-ts-vpc-rds-postgres
## (2022-09-22)
- added aws-classic-ts-securitygroup-vs-securitygrouprules

## (2022-09-13)
- added aws-classic-py-securitygroup-vs-securitygrouprules
## (2022-09-01)
- added aws-classic-py-vpc-get-zones-awsx
## (2022-08-30)
- added aws-classic-ts-vpc-get-zones-awsx
## (2022-08-22)
- added aws-classic-py-vpc-awsx-natgateway-strategy
- added aws-classic-ts-vpc-natgatway-strategy
## (2022-08-19)
- added aws-classic-ts-vpc-peeringconnectionoption-providers
## (2022-08-18)

- added aws-classic-ts-vpc-peeringconnectionoption
## (2022-08-17)

- added azure-py-redis

## (2022-08-16)

- added azure-ts-synapse-bigdatapool

## (2022-07-28)

- added aws-classic-py-multiple-ec2-ebs

## (2022-07-26)

- added aws-classic-ts-eks-vpc-sg-default-rules
- added aws-classic-ts-vpc-get-zones-awsx

## (2022-07-08)

- added google-native-py-bigquerydatatransfer
- added aws-classic-py-vpc-msk-kafka-client
- added aws-classic-py-vpc-msk-kafka-client-part2

## (2022-06-06)

- updated the helm3 release for certmanager for crds for aws-classic-ts-eks-cert-manager
- updated the GitHub actions for pull_request_python_aws.yml and pull_request_typescript_aws.yml to use sso [token](https://github.com/aws-actions/configure-aws-credentials/blob/master/action.yml#L19)

## (2022-03-22)

- updated GitHub Actions to remove extra clouds, bumped githubactions to v3
- removed the following from githubactions due service principal issue in pipeline error even though preview and up work via cli
  - azure-ts-keyvault, azure-classic-ts-datalakegen2, azure-classic-ts-datafactory
  - azure-py-insights, azure-classic-py-insights, azure-py-aks-diagnosticsetting

## (2022-03-21)

- added azure-py-insights

## (2022-03-18)

- added azure-go-aks-diagnosticsetting

## (2022-03-17)

- added azure-py-rg-storageaccounts
- added azure-py-aks-diagnosticsetting
- added azure-ts-keyvault-appservice
- added pull_request_typescript_azure_azuread.yml for GitHub actions for azuread in TypeScript
- added pull_request_python_azure_azuread.yml for GitHub actions for azuread in python

## (2022-03-03)

- added azure-go-resourcegroup

## (2022-03-02)

- added datadog-py-monitorjson

## (2022-03-01)

- fixed and added back in aws-classic-py-aws-load-balancer-controller-helm-release

## (2022-02-24)

- added aws-classic-py-eks, aws-classic-ts-eks, aws-classic-ts-eks-cert-manager
- busted azure-go-sqlserver-loganalytics due to "STATE" issue due to [typo](https://github.com/pulumi/pulumi-azure-native/pull/1490)

## (2022-02-03)

- added aws-classic-py-vpc-quickstart

## (2022-02-02)

- added aws-classic-ts-vpc-quickstart

## (2022-01-26)

- added azure-ts-synapse-workspace

## (2022-01-20)

- added azure-ts-sqlserver

## (2021-12-16)

- added aws-classic-ts-eks-awsx-spot

## (2021-11-18)

- added aws-classic-py-aws-load-balancer-controller-helm-release

## (2021-11-16)

- added azure-classic-ts-datafactory

## (2021-11-15)

- added azure-ts-datafactory

## (2021-11-10)

- added azure-ts-managedinstance

## (2021-11-02)

- added azure-ts-serverless-www-HTML
- renamed azure-ts-serveless-www-HTML to azure-ts-serverless-www-HTML. Added the `r` at the end of `serve` to get `server`

## (2021-10-18)

- added azure-go-sqlserver-servervulnerabilityassessment

## (2021-10-14)

- added azure-ts-sqlserver-servervulnerabilityassessment

## (2021-10-06)

- added aws-classic-ts-eks-node-alltaints

## (2021-10-05)

- added aws-classic-py-get-regions
- added aws-classic-py-get-ami
- added aws-classic-ts-ebs-volume-snapshot
- added aws-classic-ts-ec2-instance-with-ebs-volume

## (2021-10-04)

- added aws-classic-ts-eks-nodetaint

## (2021-10-01)

- renamed aws-ts-acm-awsguard to aws-classic-ts-acm-awsguard
- renamed aws-ts-ecs-awsx to aws-classic-ts-ecs-awsx
- renamed aws-ts-eks-different-awsprofile to aws-classic-ts-eks-different-awsprofile
- renamed aws-ts-eks-spot-mg to aws-classic-ts-eks-spot-mg
- renamed aws-ts-existingvpc-ecs-autoscaling-lt to aws-classic-ts-existingvpc-ecs-autoscaling-lt
- renamed aws-ts-get-ecs to aws-classic-ts-get-ecs
- renamed aws-ts-lakeformation to aws-classic-ts-lakeformation
- renamed aws-ts-launchtemplate to aws-classic-ts-launchtemplate
- renamed aws-ts-sshkey to aws-classic-ts-sshkey
- renamed aws-ts-vpc-crosswalk to aws-classic-ts-vpc-crosswalk
- renamed aws-ts-vpc-ecs-autoscaling-lt to aws-classic-ts-vpc-ecs-autoscaling-lt
- renamed aws-ts-vpc-with-ecs-fargate-py to aws-classic-ts-vpc-with-ecs-fargate-py
- renamed azure-ts-datalakegen2 to azure-classic-ts-datalakegen2
- updated the badge for aws-python to aws-classic-python & aws-typescript to aws-classic-typescript

## (2021-09-30)

- renamed aws-py-apigateway-lambda-serverless to aws-classic-py-apigateway-lambda-serverless
- renamed aws-py-beanstalk to aws-classic-py-beanstalk
- renamed aws-py-dynamodb to aws-classic-py-dynamodb
- renamed aws-py-ecs-fargate to aws-classic-py-ecs-fargate
- renamed aws-py-eks-spot-mg to aws-classic-py-eks-spot-mg
- renamed aws-py-eks-spot-nodegroups to aws-classic-py-eks-spot-nodegroups
- renamed aws-py-s3-staticwebsite to aws-classic-py-s3-staticwebsite
- renamed aws-py-vpc to aws-classic-py-vpc

## (2021-09-28)

- added azure-ts-jenkins

## (2021-09-27)

- added language and cloud images, updated the GitHub actions links

## (2021-09-23)

- aws-py-beanstalk

## (2021-09-22)

- aws-ts-eks-different-awsprofile

## (2021-09-16)

- azure-go-subscriptionid-from-resourcegroup

## (2021-09-14)

- azure-classic-py-insights

## (2021-09-13)

- aws-py-eks-spot-nodegroups

## (2021-09-03)

- aws-ts-lakeformation
- azure-ts-datalakegen2

## (2021-08-31)

- aws-ts-eks-spot-mg

## (2021-08-30)

- aws-py-vpc

aws-py-vpc

## (2021-08-26)

- azure-ts-subscriptionid-from-resourcegroup
- azure-ts-consumption-budget

## (2021-08-24)

- added aws-ts-get-ecs
- added aws-ts-ecs-awsx

## (2021-08-20)

- added aws-ts-vpc-ecs-autoscaling-lt
- added aws-ts-existingvpc-ecs-autoscaling-lt

## (2021-08-19)

- added azure-ts-keyvault

## (2021-08-06)

- added aws-ts-launchtemplate

## (2021-07-29)

- added azure-go-sqlserver-loganalytics.

## (2021-07-26)

- added azure-ts-sqlserver-loganalytics

## (2021-07-21)

- added aws-py-dynamodb

## (2021-07-15)

- storage bucket & vpc & postgres & serverless work for google-native-py-network-postgres-function

## (2021-07-14)

- storage bucket & vpc & postgres work for google-native-py-network-postgres-function

## (2021-07-13)

- storage bucket & vpc work for google-native-py-network-postgres-function

## (2021-07-12)

- storage bucket works for google-native-py-network-postgres-function

## (2021-07-05)

- Updated aws-ts-acm-awsguard for acm certification policy

## (2021-06-29)

- Added aws-py-apigateway-lambda-serverless
- removed broken code aws-py-apigateway-lambda

## (2021-06-25)

- Added aws-py-apigateway-lambda

## (2021-06-24)

- Added azure-py-vnet
- Added azure-py-databricks
- removed the push_ts and push_python GitHub actions

## (2021-06-23)

- Added azure-workshop-ts
- renamed and moved aws-ts-vpc-with-ecs-fargate-py/vpc-crosswalk-ts to aws-ts-vpc-crosswalk
- renamed and moved aws-ts-vpc-with-ecs-fargate-py/ecs-fargate-python/ to aws-py-ecs-fargate
- added aws-ts-acm-awsguard

## (2021-06-22)

- Added azure-ts-resourcegroup-fixname
- Added azure-ts-iac-workshop-lab1

## (2021-06-21)

- Added azure-ts-serveless-http-trigger
- Fixed [pulumi GitHub actions v3](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/) for azure for service principal.

## (2021-06-09)

- added [pulumi GitHub actions v3](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/) for aws.
- Added aws-ts-vpc-with-ecs-fargate-py/ecs-fargate-python
- Added aws-ts-vpc-with-ecs-fargate-py/vpc-crosswalk-ts
- Added aws-ts-sshkey
