# Examples

This repo is essentially a staging ground for pulumi examples. As I learn more about using Pulumi in all the different languages, this may graduate to [pulumi examples](https://github.com/pulumi/examples)

## Definitions
ts = typescript

py = python

## AWS
Example   | Description |
--------- | ----------- |
[aws-ts-vpc-with-ecs-fargate-py](aws-ts-vpc-with-ecs-fargate-py)| vpc built in typescript - independent from ecs, ecs uses vpc via stackreferences
[aws-sshkey-ts](aws-sshkey-ts)| ssh key

## Pulumi Github Actions Setup (Optional)
We have setup [Pulumi Github Actions](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#pulumi-github-actions). 

 1. Pulumi’s [GitHub Actions](https://docs.github.com/en/actions) help you deploy apps and infrastructure to your cloud of choice, using nothing but code in your favorite language and GitHub. This includes previewing, validating, and collaborating on proposed deployments in the context of Pull Requests, and triggering deployments or promotions between different environments by merging or directly committing changes.

 1. Located in [.github/workflows](.github/workflows)

 1. Pull WorkFlow File for Python
    - [pull_request.yml with comments by github actions](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#comments-by-github-actions)

 1. Push WorkFlow File
    - [push.yml](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/#the-push-workflow-file)

 1. SuperLinter setup
    - [super-linter](https://github.com/github/super-linter) setup
    - superlinter.yml - `.github/workflows/superlinter.yml`
    - [slim image](https://github.com/github/super-linter#slim-image)
    - VALIDATE_PYTHON_BLACK turned OFF
    - VALIDATE_PYTHON_FLAKE8 turned OFF
    - VALIDATE_PYTHON_ISORT turned OFF
    - VALIDATE_TYPESCRIPT_STANDARD turned OFF
    - VALIDATE_ALL_CODEBASE turned OFF   - Will parse the entire repository and find all files to validate across all types. NOTE: When set to false, only new or edited files will be parsed for validation.