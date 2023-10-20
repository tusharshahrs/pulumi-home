import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const name = "shaht"
// Define a new IAM Policy
const kmsFullAccess = new aws.iam.Policy(`${name}-kmsFullAccess`, {
    policy: pulumi.output(JSON.stringify({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "kms:*",
                "Resource": "*"
            }
        ]
    })),
});

// Export the IAM Policy ARN
export const KmsPolicyArn = kmsFullAccess.arn;