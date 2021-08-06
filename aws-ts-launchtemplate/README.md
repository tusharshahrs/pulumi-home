# AWS EC2 instance launched via launchtemplate

AWS EC2 instance launched via launchtemplate. The following resources are created:  vpc, securitygroup, sshkeypair,ami, role, instanceprofile, & ec2 instance is launched via a function that returns a launchtemplate.

## Requirements

pulumi 3.0 & node 14.

## Running the App

1. Create a new stack

    ```bash
    pulumi stack init dev
    ```

1. Restore NPM dependencies

    ```bash
    npm install
    ```
1. Set the AWS region location to use
    ```bash
    pulumi config set aws:region us-east-2
    ```

1. Run **pulumi up** to preview and deploy changes via selecting **y**
    ```bash
    pulumi up
    Previewing update (dev)
    ```
1. Run **pulumi stack** since we need the part appended to the pulumi console url.
    ```bash
    pulumi stack
    More information at: https://app.pulumi.com/myuser/aws-ts-launchtemplate/dev
    ```
    We will need this: `myuser/aws-ts-launchtemplate/dev`

1. Destroy the stack
    ```bash
    pulumi stack destroy -y
    ```