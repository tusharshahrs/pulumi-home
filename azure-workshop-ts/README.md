# Azure Native Workshop with Pulumi

This hands-on workshop will walk you through various tasks of managing Azure infrastructure with the focus on setting up python and managed Azure services. All the resources are provisioned with [Pulumi](https://www.pulumi.com/) in the infrastructure-as-code fashion. You will be using Pulumi's [Azure Native](https://www.pulumi.com/docs/intro/cloud-providers/azure/) provider

## What are Native Providers
Native Providers for [Azure](https://www.pulumi.com/blog/pulumi-3-0/#native-providers-for-azure-and-google-cloud).
- They give you the most complete and consistent interface for the modern cloud. 
- These native providers are automatically generated from cloud provider APIs and resource models that are maintained directly by cloud provider service teams. 
- This enables native providers to offer 100% API coverage, same-day support for new features, the exact same API designed by the provider service team, and fewer bugs and reliability issues. 
- This makes native providers the best way to manage infrastructure in the supported cloud platforms, combining the benefits of Pulumi Infrastructure as Code with the resource models and pace of delivery of the cloud provider themselves.

## Prerequisities

Before Proceeding, ensure your machine is ready to go:
* [Installing Prerequisites](./00-installing-prerequisites.md)

### Lab 1 — Modern Infrastructure as Code

The first lab takes you on a tour of infrastructure as code concepts:
1. [Creating a New Project](./01-iac/01-creating-a-new-project.md)
2. [Configuring Azure](./01-iac/02-configuring-azure.md)
3. [Provisioning Infrastructure](./01-iac/03-provisioning-infrastructure.md)
4. [Updating your Infrastructure](./01-iac/04-updating-your-infrastructure.md)
5. [Making Your Stack Configurable](./01-iac/05-making-your-stack-configurable.md)
6. [Creating a Second Stack](./01-iac/06-creating-a-second-stack.md)
7. [Destroying Your Infrastructure](./01-iac/07-destroying-your-infrastructure.md)

In this lab, you deploy an Azure Function App with HTTP-triggered serverless functions.

1. [Creating a New Project](./02-serverless/01-creating-a-new-project.md)
2. [Configuring Azure](./02-serverless/02-configuring-azure.md)
3. [Creating a Resource Group](./02-serverless/03-provisioning-infrastructure.md)
4. [Creating a Storage Account](./02-serverless/03-provisioning-infrastructure.md#step-2--add-a-storage-account)
5. [Creating a Consumption Plan](./02-serverless/03-provisioning-infrastructure.md#step-3--define-a-consumption-plan)
6. [Retrieve Storage Account Keys and Build Connection String](./02-serverless/03-provisioning-infrastructure.md#step-4--retrieve-storage-account-keys-and-build-connection-string)
7. [Creating a Function App](./02-serverless/03-provisioning-infrastructure.md#step-5--create-a-function-app)
8. [Export the Function App endpoint](./02-serverless/03-provisioning-infrastructure.md#step-6--export-the-function-app-endpoint)
9. [Provision the Function App](./02-serverless/03-provisioning-infrastructure.md#step-7--provision-the-function-app)
10. [Destroy Everything](./02-serverless/03-provisioning-infrastructure.md#step-8--destroy-everything)
