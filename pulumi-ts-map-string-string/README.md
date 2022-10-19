# Pulumi TypeScript Map Output Empty Issue

Pulumi TypeScript Output Map<string,string> Issue.  console.log shows map output in `Diagnostics` section

## Running the App

1. Create a new stack

    ```bash
    pulumi stack init dev
    ```

1. Restore npm dependencies

    ```bash
    npm install
    ```

1. Run **pulumi up** and deploy the changes by selecting **y**
    ```bash
    Updating (dev)

    View Live: https://app.pulumi.com/myuser/pulumi-ts-map-string-string/dev/updates/1

        Type                                        Name                             Status              
    +   pulumi:pulumi:Stack                         pulumi-ts-map-string-string-dev  created (0.45s)     
    +   └─ pkg:index:K8sExternalSecretsDeployments  foo-testtestest                  created (0.43s)     
    
    Resources:
        + 2 created

    Duration: 2s
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (1):
        OUTPUT      VALUE
        someMapVar  {}
   ```

   *Note* This is empty due to the following reason.

    For something to be used as an output, it’s `JSON.stringify’d`. For maps, this is always `{}` IIRC.
    When printing to the console, node uses some special formatters which intercepts map types and does a pretty print on them - which is different to serializing to JSON.

    When writing to an output .. just use
    `Object.fromEntries(map.entries())`
    This requires the *ES2019* lib in the **tsconfig** to work
   
    we don't support the JS container objects Map and Set for serialization. Likely easier to use this than remembering to convert:
    ```
    public readonly somethingMapVar: Record<string, string>;
    ```
   

1. Destroy the stack
    ```bash
    pulumi stack destroy -y
    ```

1. Remove the stack.  This will remove the *Pulumi.dev.yaml* file
   ```bash
   pulumi stack rm
   ```