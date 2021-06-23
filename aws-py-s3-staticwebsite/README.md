# Host a Static Website on Amazon S3
[![Deploy](https://get.pulumi.com/new/button.svg)](https://app.pulumi.com/new)

A static website that uses [S3's website support](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).
For a detailed walkthrough of this example, see the tutorial [Static Website on AWS S3](https://www.pulumi.com/docs/tutorials/aws/s3-website/).

## Deploying and running the program

Note: some values in this example will be different from run to run.  These values are indicated
with `***`.

1. Create a new stack:

    ```bash
    pulumi stack init website-testing
    ```

1. Set the AWS region:

    ```bash
    pulumi config set aws:region us-west-2
    ```

1. Create a Python virtualenv, activate it, and install dependencies:

    This installs the dependent packages [needed](https://www.pulumi.com/docs/intro/concepts/how-pulumi-works/) for our Pulumi program.

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

    Result:
    ```
    Updating (dev)

    View Live: https://app.pulumi.com/myuser/aws-py-s3-staticwebsite/dev/updates/1

        Type                    Name                         Status      
    +   pulumi:pulumi:Stack     aws-py-s3-staticwebsite-dev  created     
    +   ├─ aws:s3:Bucket        s3-website-bucket            created     
    +   ├─ aws:s3:BucketObject  index.html                   created     
    +   ├─ aws:s3:BucketObject  favicon.png                  created     
    +   ├─ aws:s3:BucketObject  python.png                   created     
    +   └─ aws:s3:BucketPolicy  bucket-policy                created     
    
    Outputs:
        bucket_name: "s3-website-bucket-249d39a"
        website_url: "s3-website-bucket-249d39a.s3-website.us-east-2.amazonaws.com"

    Resources:
        + 6 created

    Duration: 9s
    ```

1. To see the resources that were created, run `pulumi stack output`:

    ```bash
    pulumi stack output
    ```

    Result
    ```
    Current stack outputs (2):
    OUTPUT       VALUE
    bucket_name  s3-website-bucket-249d39a
    website_url  s3-website-bucket-249d39a.s3-website.us-east-2.amazonaws.com
    ```

1. To see that the S3 objects exist, you can either use the AWS Console or the AWS CLI:

    ```bash
    aws s3 ls $(pulumi stack output bucket_name)
    ```

    Result
    ```
    2021-06-23 11:11:13      13731 favicon.png
    2021-06-23 11:11:13        271 index.html
    2021-06-23 11:11:14      83564 python.png
    ```

1. Open the site URL in a browser to see both the rendered HTML, the favicon, and Python splash image:

    ```bash
    pulumi stack output website_url
    ```

    Result
    ```
    s3-website-bucket-249d39a.s3-website.us-east-2.amazonaws.com
    ```

1. To clean up resources, run **pulumi destroy**
   ```bash
   pulumi destroy -y
   ```