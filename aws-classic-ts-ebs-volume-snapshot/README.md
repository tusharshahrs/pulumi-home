# AWS EBS Volume Snapshot Creation

AWS ebs volume created with multiple snapshots taken with a for loop

## Deployment

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

    View Live: https://app.pulumi.com/shaht/aws-classic-ts-ebs-volume-snapshot/dev/updates/18

     Type                 Name                                    Status      
    +   pulumi:pulumi:Stack  aws-classic-ts-ebs-volume-snapshot-dev  created     
    +   ├─ aws:ebs:Volume    demo-ebs-volume                         created     
    +   ├─ aws:ebs:Snapshot  demo-snapshot-0                         created     
    +   └─ aws:ebs:Snapshot  demo-snapshot-1                         created     
    
    Outputs:
        availability_zone_used   : "us-east-1a"
        ebs_snapshots_id         : [
            [0]: "snap-0318191a81be67a1d"
            [1]: "snap-07188e473127b39e8"
        ]
        number_of_snapshots_taken: 2

    Resources:
        + 4 created

    Duration: 3m25s
    ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (3):
    OUTPUT                     VALUE
    availability_zone_used     us-east-1a
    ebs_snapshots_id           ["snap-0318191a81be67a1d","snap-07188e473127b39e8"]
    number_of_snapshots_taken  2
   ```

1. When you destroy this Pulumi program, that the snapshots **WILL BE DESTROYED**, *UNLESS* you enable
[protection](https://www.pulumi.com/docs/intro/concepts/resources/#protect).  The code shows how to `protect` and `unprotect`
the resource

1. Destroy the stack
    ```bash
    pulumi stack destroy -y
    ```

1. Remove the stack.  This will remove the *Pulumi.dev.yaml* file
   ```bash
   pulumi stack rm
   ```