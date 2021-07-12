# Google Native with VPC, Postgres Server, and Cloud Function in Python

A Google Native stack with a vpc, postgres server, and cloud function in python.

## Prerequisites

Before trying to deploy this example, please make sure you have performed all of the following tasks:
- [Downloaded & installed the Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Signed up for Google Cloud](https://cloud.google.com/free/)
- [Connect Pulumi to your Google Cloud Account](https://www.pulumi.com/docs/intro/cloud-providers/gcp/setup/)

## Running the Example

1. Create a new stack, which is an isolated deployment target for this example:
    ```bash
    pulumi stack init dev
    ```

2. Set the required configuration variables for this program:

    ```bash
    pulumi config set google-native:project [your-gcp-project-here]
    pulumi config set google-native:region us-central1 # any valid region
    ```
