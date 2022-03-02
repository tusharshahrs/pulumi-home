# Datadog monitorjson

[Datadog](https://www.pulumi.com/registry/packages/datadog/api-docs/) [monitorjson](https://www.pulumi.com/registry/packages/datadog/api-docs/monitorjson) in python

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

1. Populate the config.

   ```bash
   pulumi config set datadog:apiKey --secret XXXXXXXXXXXXXX 
   pulumi config set datadog:appKey --secret YYYYYYYYYYYYYY
   ```

1. Changes to `__main__.py` to make it work. 
    - Updated boolean values to `True` & `False`.
    - Updated `priority` to a number, randomly selecting`1`. 
    - Removed`restricted_roles` due to following error:  `400 Bad Request: {"errors": ["Missing Roles set(['U', 'L', 'N'])"]}` on running `pulumi up` any time after the inital one.

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
   Updating (dev)

    View Live: https://app.pulumi.com/shaht/datadog-py-monitorjson/dev/updates/9

        Type                          Name                        Status      
    +   pulumi:pulumi:Stack           datadog-py-monitorjson-dev  created     
    +   └─ datadog:index:MonitorJson  monitorJson                 created     
    
    Outputs:
        monitor_json_name: "65178665"

    Resources:
        + 2 created

   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (1):
    OUTPUT             VALUE
    monitor_json_name  6517866
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```