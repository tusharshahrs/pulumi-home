import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const name = "demo";
const myaccount = new gcp.serviceaccount.Account(`${name}-serviceaccount`, {
    accountId: `${name}-serviceaccount`,
    displayName: "My Test Service Account",
});

export const myaccountName = pulumi.secret(myaccount.name);

const mykey = new gcp.serviceaccount.Key(`${name}-Key`, {
    serviceAccountId: myaccount.name,
    publicKeyType: "TYPE_X509_PEM_FILE",
});

export const mykeyName = pulumi.secret(mykey.name);
export const mykeyPrivateKey = pulumi.secret(mykey.privateKey);
export const mykeyPublicKey = pulumi.secret(mykey.publicKey);

export const privateKey_decoded = pulumi.output(mykey.privateKey).apply((key) => Buffer.from(key, "base64").toString("utf8"));
  