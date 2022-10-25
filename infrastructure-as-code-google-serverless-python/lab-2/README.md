# Lab 2: Resources, Resource Providers, and Language Hosts

Let's talk about resources, resource providers, and language hosts.

## Set the configuration for the environment
```bash
pulumi config
```

Results
```bash
KEY          VALUE
gcp:project
```

The value for `gcp:project` could be set or empty.  First we will set a bunch of variables via
[pulumi config set](https://www.pulumi.com/docs/reference/cli/pulumi_config_set/).
```bash
pulumi config set gcp:region us-central1 # Set the gcp region
pulumi config set errorDocument  error.html
pulumi config set indexDocument  index.html
pulumi config set appPath ./app
pulumi config set sitePath ./www
```

Next, we set the `gcp:project`
```bash
pulumi config set gcp:project pulumi-ce-team # This will be your PROJECT. If you use this, your lab will NOT WORK
```

Validate that the all the values are set.
```bash
pulumi config
```

Results
```bash
KEY            VALUE
gcp:project    pulumi-ce-team
gcp:region     us-central1
appPath        ./app
errorDocument  error.html
indexDocument  index.html
sitePath       ./www
```

**Note:** The *`Pulumi.dev.yaml`* contains all the values that we set via `pulumi config`