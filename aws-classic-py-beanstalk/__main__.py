"""An AWS Python Pulumi program"""

import pulumi
import pulumi_aws as aws

name = "demo"
default_bucket = aws.s3.Bucket(f'{name}-beanstalk-bucket')
default_bucket_object = aws.s3.BucketObject(f'{name}-beanstalk-bucketobject',
    bucket=default_bucket.id,
    key="beanstalk/go-v1.zip",
    source=pulumi.FileAsset("beanstalk/python.zip"))

default_application = aws.elasticbeanstalk.Application(f'{name}-beanstalk-application', description="elastic beanstalk application")
default_application_version = aws.elasticbeanstalk.ApplicationVersion(f'{name}-beanstalk-applicationversion',
    application=default_application.id,
    description="application version",
    bucket=default_bucket.id,
    key=default_bucket_object.id)

pulumi.export("elastic_beanstalk_s3_bucket", default_bucket.id)
pulumi.export("elastic_beanstalk_application_name", default_application.name)
pulumi.export("elastic_beanstalk_applicationversions", default_application_version.name)