# AWS Get Region in python

AWS get region from pulumi config

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Create a Python virtualenv, activate it, and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip3 install -r requirements.txt
   ```

1. View the current config settings. This will be empty.

   ```bash
   pulumi config
   ```

   ```bash
   KEY                     VALUE
   ```

1. Populate the config.  Here are aws [endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html)

   ```bash
   pulumi config set aws:region us-east-1 # any valid aws region, that is NOT us-east-2.  Mainly to trigger the error.
   ```

1. Launch

   ```bash
   pulumi up
   ```

   Results
   ```bash
    ..
    ..
    raise ValueError("provider has bad region")
    ValueError: provider has bad region
   ```

1. Update the region to `us-east-2`
   ```bash
   pulumi config set aws:region us-east-2
   ```

1. Run `pulumi up`
   ```bash
   pulumi up
   ```

   Results
   ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-classic-py-get-regions/dev/updates/1

        Type                 Name                            Status      
    +   pulumi:pulumi:Stack  aws-classic-py-get-regions-dev  created     
    
    Outputs:
        aws_region_selected: "us-east-2"

    Resources:
        + 1 created

    Duration: 2s
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (1):
    OUTPUT               VALUE
    aws_region_selected  us-east-2
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```