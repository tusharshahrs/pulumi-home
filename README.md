# Examples

This repo is essentially a staging ground for pulumi examples. As I learn more about using Pulumi in all the different languages, this may graduate to [pulumi examples](https://github.com/pulumi/examples)

## Definitions
ts = typescript

py = python

## AWS
Example   | Description |
--------- | ----------- |
[aws-ts-vpc-with-ecs-fargate-py](aws-ts-vpc-with-ecs-fargate-py)| vpc built in typescript - independent from ecs, ecs uses vpc via stackreferences

## Pulumi Github Actions Setup
We have setup [Pulumi Github Actions](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#pulumi-github-actions). Pulumi’s [GitHub Actions](https://docs.github.com/en/actions) help you deploy apps and infrastructure to your cloud of choice, using nothing but code in your favorite language and GitHub. This includes previewing, validating, and collaborating on proposed deployments in the context of Pull Requests, and triggering deployments or promotions between different environments by merging or directly committing changes.

### Pull WorkFlow File
- pull_request with [comments by github actions](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#comments-by-github-actions)

### Push WorkFlow File
- [push.yaml](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#the-push-workflow-file)

### SuperLinter setup
 - superlinter.yml - `.github/workflows/superlinter.yml`
 - [super-linter](https://github.com/github/super-linter)
 - [slim image](https://github.com/github/super-linter#slim-image)
 - VALIDATE_PYTHON_BLACK turned OFF
 - VALIDATE_PYTHON_FLAKE8 turned OFF
 - VALIDATE_PYTHON_ISORT turned OFF
 - VALIDATE_TYPESCRIPT_STANDARD turned OFF