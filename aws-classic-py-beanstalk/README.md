# AWS Beanstalk in python

AWS Beanstalk in python

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
   pulumi config set aws:region us-east-2 # any valid aws region
   ```

1. Launch

   ```bash
   pulumi up -y
   ```

   Results
   ```bash
   Previewing update (dev)

    View Live: https://app.pulumi.com/myuser/aws-py-beanstalk/dev/updates/1

        Type                                        Name                               Status      
    +   pulumi:pulumi:Stack                         aws-py-beanstalk-dev               created     
    +   ├─ aws:elasticbeanstalk:Application         demo-beanstalk-application         created     
    +   ├─ aws:s3:Bucket                            demo-beanstalk-bucket              created     
    +   ├─ aws:s3:BucketObject                      demo-beanstalk-bucketobject        created     
    +   └─ aws:elasticbeanstalk:ApplicationVersion  demo-beanstalk-applicationversion  created     
    
    Outputs:
        elastic_beanstalk_application_name   : "demo-beanstalk-application-953cac1"
        elastic_beanstalk_applicationversions: "demo-beanstalk-applicationversion-bd2a93e"
        elastic_beanstalk_s3_bucket          : "demo-beanstalk-bucket-d8832e2"

    Resources:
        + 5 created

    Duration: 8s
   ```

1. View the outputs
   ```bash
   pulumi up -y
   ```

   Results
   ```bash
   Current stack outputs (3):
    OUTPUT                                 VALUE
    elastic_beanstalk_application_name     demo-beanstalk-application-953cac1
    elastic_beanstalk_applicationversions  demo-beanstalk-applicationversion-bd2a93e
    elastic_beanstalk_s3_bucket            demo-beanstalk-bucket-d8832e2
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```