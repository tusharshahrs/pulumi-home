# AWS Get AMI in python

AWS get ami function in python

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
   pulumi config set aws:region us-east-2 # any valid aws region
   ```

1. Run `pulumi up`
   ```bash
   pulumi up
   ```

   Results
   ```bash
   Updating (dev)

   View Live: https://app.pulumi.com/shaht/aws-classic-py-get-ami/dev/updates/1

      Type                 Name                        Status      
   +   pulumi:pulumi:Stack  aws-classic-py-get-ami-dev  created     
   
   Outputs:
      my_ami: "amzn2-ami-hvm-2.0.20190618-x86_64-gp2"

   Resources:
      + 1 created

   Duration: 4s
   ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (1):
    OUTPUT  VALUE
    my_ami  amzn2-ami-hvm-2.0.20190618-x86_64-gp2
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```