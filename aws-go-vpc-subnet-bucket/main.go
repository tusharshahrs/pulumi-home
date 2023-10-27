package main

import (
	"fmt"

	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/ec2"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/s3"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/s3control"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Create a new VPC
		myvpc, err := ec2.NewVpc(ctx, "shaht-myVpc", &ec2.VpcArgs{
			CidrBlock: pulumi.String("10.0.0.0/16"),
			Tags: pulumi.StringMap{
				"Name": pulumi.String("shaht-myVpc"),
			},
		})
		if err != nil {
			return err
		}

		// Create a subnet1 in the VPC
		mysubnet1, err := ec2.NewSubnet(ctx, "shaht-subnet1", &ec2.SubnetArgs{
			VpcId:     myvpc.ID(),
			CidrBlock: pulumi.String("10.0.1.0/24"),
			Tags: pulumi.StringMap{
				"Name": pulumi.String("shaht-subnet1"),
			},
		})
		if err != nil {
			return err
		}

		// Create another subnet2 in the VPC
		mysubnet2, err := ec2.NewSubnet(ctx, "shaht-subnet2", &ec2.SubnetArgs{
			VpcId:     myvpc.ID(),
			CidrBlock: pulumi.String("10.0.2.0/24"),
			Tags: pulumi.StringMap{
				"Name": pulumi.String("shaht-subnet2"),
			},
		})
		if err != nil {
			return err
		}

		// Create a security group allows outbound access to the VPC
		mysg, err := ec2.NewSecurityGroup(ctx, "sg", &ec2.SecurityGroupArgs{
			VpcId: myvpc.ID(),
		})
		if err != nil {
			return err
		}

		// Create a VPC Endpoint for S3
		myvpcEndpoint, err := ec2.NewVpcEndpoint(ctx, "shahtmyS3Endpoint", &ec2.VpcEndpointArgs{
			VpcId:             myvpc.ID(),
			ServiceName:       pulumi.String("com.amazonaws.east-us-2.s3"),
			VpcEndpointType:   pulumi.String("Interface"),
			PrivateDnsEnabled: pulumi.Bool(true),
		})
		if err != nil {
			return err
		}

		// Create an AWS resource (S3 Bucket)
		mybucket, err := s3.NewBucket(ctx, "shahtmy-bucket", &s3.BucketArgs{
			Tags: pulumi.StringMap{
				"Name": pulumi.String("shaht-subnet1"),
			},
		})
		if err != nil {
			return err
		}

		// Create a policy document that allows endpoint to access our bucket
		mybucketPolicyDocument := fmt.Sprintf(`{
			"Version": "2012-10-17",
			"Statement": [{
				"Effect": "Allow",
				"Principal": "*",
				"Action": "s3:*",
				"Resource": ["arn:aws:s3:::%s/*"],
				"Condition": {
					"StringEquals": {
						"aws:sourceVpce": "%s"
					}
				}
			}]
		}`, mybucket.ID(), myvpcEndpoint.ID())

		// Attach the bucket policy to the S3 bucket.
		_, err = s3control.NewBucketPolicy(ctx, "shahtmyBucketPolicy", &s3control.BucketPolicyArgs{
			Bucket: mybucket.ID(),
			Policy: pulumi.String(mybucketPolicyDocument),
		})
		if err != nil {
			return err
		}

		// Export the name of the bucket
		ctx.Export("vpcId", myvpc.ID())
		ctx.Export("subnet1Id", mysubnet1.ID())
		ctx.Export("subnet2Id", mysubnet2.ID())
		ctx.Export("vpcEndpointId", myvpcEndpoint.ID())
		ctx.Export("bucketName", mybucket.ID())
		ctx.Export("s3EndpointId", myvpcEndpoint.ID())
		ctx.Export("securityGroupId", mysg.ID())
		return nil
	})
}
