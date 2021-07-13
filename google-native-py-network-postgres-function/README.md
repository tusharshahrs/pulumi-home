# Google Native with VPC, Postgres Server, and Cloud Function in Python

A Google Native stack with a vpc, postgres server, and cloud function in python.

## Prerequisites

Before trying to deploy this example, please make sure you have performed all of the following tasks:
- [Downloaded & installed the Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Signed up for Google Cloud](https://cloud.google.com/free/)
- [Connect Pulumi to your Google Cloud Account](https://www.pulumi.com/docs/intro/cloud-providers/gcp/setup/)

## Running the Example

1. Create a new stack, which is an isolated deployment target for this example.
    ```bash
    pulumi stack init dev
    ```

1. Set the required configuration variables for this program such as **project**, **region**, & **subnet cidr blocks**.

    ```bash
    pulumi config set google-native:project [your-gcp-project-here]
    pulumi config set google-native:region us-central1 # any valid region
    pulumi config set subnet_cidr_blocks '["10.0.0.0/25","10.0.0.128/26","10.0.0.192/26"]'
    ```

1. Create a Python virtualenv, activate it, and install dependencies:

    This installs the dependent packages for our Pulumi program.

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip3 install -r requirements.txt
    ```

1. Run `pulumi up` to preview and deploy changes.  After the preview is shown you will be
    prompted if you want to continue or not.

    ```bash
    pulumi up
    ```
    
    Results