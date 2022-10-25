# Lab 2: Setup the Configuration and Files needed for Serverless

## Configurations
In many cases, different stacks for a single project will need differing values..
The key-value pairs for any given stack are stored in your project’s stack settings file, which is automatically named **Pulumi.<stack-name>.yaml**. For example, 
`Pulumi.dev.yaml`

The values are set via [pulumi config set](https://www.pulumi.com/docs/reference/cli/pulumi_config_set/).

Here is information on [setting and getting configuration values](https://www.pulumi.com/docs/intro/concepts/config/#setting-and-getting-configuration-values)
## Set the configuration for the environment
```bash
pulumi config
```

Results
```bash
KEY          VALUE
gcp:project
```

The value for `gcp:project` could be set or empty.  First we set a bunch of variables via
`pulumi config set`
```bash
pulumi config set gcp:region us-central1 # Set the gcp region
pulumi config set errorDocument  error.html
pulumi config set indexDocument  index.html
pulumi config set appPath ./app
pulumi config set sitePath ./www
```

Next, we set the `gcp:project`
```bash
pulumi config set gcp:project pulumi-ce-team # This will be need to be your gcp project that you have access to. If you use pulumi-ce-team, your lab will NOT WORK
```

Validate that all the config values are set.
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

**Note:** The *`Pulumi.dev.yaml`* contains all the updated values that we set above.

## Create the index.html and error.html file
In the current location where the `Pulumi.dev.yaml` file resides we will perform the following:

```bash
mkdir www
cd www
touch index.html
touch error.html
```

Update the `index.html` with the following
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Serverless Example</title>
    <script>
        var config = {};

        document.addEventListener("DOMContentLoaded", async () => {
            const response = await fetch("config.json");
            config = await response.json();
        });

        async function getTheTime() {
            const response = await fetch(`${config.api}/data`);
            const data = await response.json();
            document.querySelector("#now").textContent = `The cloud says it's ${new Date(data.now).toLocaleTimeString()}.`;
        }
    </script>
</head>
<body>
    <h1>⌚ What time is it?</h1>
    <p>
        <button onclick="getTheTime()">Ask the cloud!</button>
        <span id="now"></span>
    </p>
    <p>Deployed with 💜 by <a href="https://pulumi.com/templates">Pulumi</a>.</p>
</body>
</html>
```

Update the `error.html` with the following:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Page not found</title>
</head>
<body>
    Oops! That page wasn't found. Try our <a href="/">home page</a> instead.
</body>
</html>
```