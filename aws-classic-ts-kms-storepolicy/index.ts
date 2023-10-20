import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const name = "shaht"
// Define a new IAM Policy
const config = new pulumi.Config();
// reading in stackreference
const kmsstack = new pulumi.StackReference(config.require("configKmsKeyCmk"));
export const stackKmsKeyCmk = kmsstack.requireOutput("KmsPolicyArn");

export const stackKmsKeyCmkinfo2 = kmsstack.getOutputDetails("KmsPolicyArn");

// With apply on the entire policy
const parameterStorePolicy = new aws.iam.Policy(`parameterStorePolicy-${name}`, {
    path: "/",
    description: "Parameter Store access policy and filter",
    policy: stackKmsKeyCmk.apply(mykmskeyinfo => JSON.stringify({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "",
                "Effect": "Allow",
                "Action": "kms:Decrypt",
                "Resource": mykmskeyinfo,

            }
        ]
    }))
});

// With pulumi.jsonStringify and interpolation 
const parameterStorePolicy2 = new aws.iam.Policy(`parameterStorePolicy2-${name}`, {
    path: "/",
    description: "Parameter Store access policy and filter",
    policy: pulumi.jsonStringify({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "",
                "Effect": "Allow",
                "Action": "kms:Decrypt",
                "Resource": pulumi.interpolate`${stackKmsKeyCmk}`,

            }
        ]
    })
});

export const parameterStorePolicyArn = parameterStorePolicy.arn;
export const parameterStorePolicy2info = parameterStorePolicy2.arn;
