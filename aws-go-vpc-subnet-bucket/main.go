package main

import (
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/ec2"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/lb"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Create a new VPC
		myvpc, err := ec2.NewVpc(ctx, "shaht-vpc-endpoints", &ec2.VpcArgs{
			CidrBlock: pulumi.String("10.0.0.0/22"),
			Tags: pulumi.StringMap{
				"Name": pulumi.String("shaht-vpc-endpoints"),
			},
			EnableDnsHostnames: pulumi.Bool(true),
			EnableDnsSupport:   pulumi.Bool(true),
		})
		if err != nil {
			return err
		}

		// Create a subnet1 in the VPC
		mysubnet1, err := ec2.NewSubnet(ctx, "shaht-vpc-subnet1", &ec2.SubnetArgs{
			VpcId:            myvpc.ID(),
			AvailabilityZone: pulumi.String("us-east-2a"),
			//CidrBlock: pulumi.String("10.0.1.0/24"),
			CidrBlock: pulumi.String("10.0.0.0/23"),
			Tags: pulumi.StringMap{
				"Name": pulumi.String("shaht-vpc-subnet1"),
			},
		})
		if err != nil {
			return err
		}

		// Create another subnet2 in the VPC
		mysubnet2, err := ec2.NewSubnet(ctx, "shaht-vpc-subnet2", &ec2.SubnetArgs{
			VpcId:            myvpc.ID(),
			AvailabilityZone: pulumi.String("us-east-2b"),
			//CidrBlock: pulumi.String("10.0.2.0/24"),
			CidrBlock: pulumi.String("10.0.2.0/23"),
			Tags: pulumi.StringMap{
				"Name": pulumi.String("shaht-vpc-subnet2"),
			},
		})
		if err != nil {
			return err
		}

		// Create a security group allows outbound access to the VPC
		mysg, err := ec2.NewSecurityGroup(ctx, "shaht-shahtsg", &ec2.SecurityGroupArgs{
			VpcId: myvpc.ID(),
			Tags: pulumi.StringMap{
				"Name": pulumi.String("shaht-shahtsg"),
			},
		})
		if err != nil {
			return err
		}

		// Create a VPC Endpoint for S3
		myvpcEndpoint, err := ec2.NewVpcEndpoint(ctx, "shaht-myS3Endpoint", &ec2.VpcEndpointArgs{
			VpcId:             myvpc.ID(),
			SubnetIds:         pulumi.StringArray{mysubnet1.ID(), mysubnet2.ID()},
			ServiceName:       pulumi.String("com.amazonaws.us-east-2.s3"),
			VpcEndpointType:   pulumi.String("Interface"),
			PrivateDnsEnabled: pulumi.Bool(false),
			AutoAccept:        pulumi.Bool(true),
			Tags: pulumi.StringMap{
				"Name": pulumi.String("shaht-myS3Endpoint"),
			},
		})
		if err != nil {
			return err
		}

		// Create a alb
		myalb, err := lb.NewLoadBalancer(ctx, "shahtmyAlb", &lb.LoadBalancerArgs{
			Internal:                 pulumi.Bool(true),
			LoadBalancerType:         pulumi.String("application"),
			EnableDeletionProtection: pulumi.Bool(false),
			SecurityGroups:           pulumi.StringArray{mysg.ID()},
			Subnets:                  pulumi.StringArray{mysubnet1.ID(), mysubnet2.ID()},
			Tags: pulumi.StringMap{
				"Name": pulumi.String("shahtmyAlb"),
			},
		})

		/*
			// Create an AWS resource (S3 Bucket)
			mybucket, err := s3.NewBucket(ctx, "shahtmy-bucket", &s3.BucketArgs{
				Tags: pulumi.StringMap{
					"Name": pulumi.String("shaht-subnet1"),
				},
			})
			if err != nil {
				return err
			}
		*/
		/*
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
		*/
		// Export the name of the bucket
		ctx.Export("vpcId", myvpc.ID())
		ctx.Export("subnet1Id", mysubnet1.ID()) // You have to pass these in as inputs
		ctx.Export("subnet2Id", mysubnet2.ID()) // You have to pass these in as inputs
		ctx.Export("securityGroupId", mysg.ID())
		ctx.Export("vpcEndpointId", myvpcEndpoint.ID())
		ctx.Export("vpcEndpointId_networkinterfaces", myvpcEndpoint.NetworkInterfaceIds)
		ctx.Export("vpcEndpointId_subnetids", myvpcEndpoint.SubnetIds) // Shows up as empty, that is why apply will not work
		ctx.Export("myalbinfo", myalb.DnsName)
		//ctx.Export("bucketName", mybucket.ID())
		//ctx.Export("s3EndpointId", myvpcEndpoint.ID())
		//ctx.Export("securityGroupId", mysg.ID())
		//ctx.Export("vpcEndpointId2", myvpcEndpoint.SubnetIds)
		return nil
	})
}
