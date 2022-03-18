# AWS EKS with Namespace and Cert-Manager Helm Release

AWS eks with namespace and cert-manager in helm release in TypeScript

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Install dependencies:
   ```bash
   npm install
   ```

1. View the current config settings. This will be empty.

   ```bash
   pulumi config
   ```

   ```bash
   KEY                     VALUE
   ```

1. Populate the config.  Here are aws [endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html)
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

    View Live: https://app.pulumi.com/shaht/aws-classic-ts-eks-cert-manager/dev/updates/12

        Type                                   Name                                  Status       
    +   pulumi:pulumi:Stack                    aws-classic-ts-eks-cert-manager-dev        creating..   
    +   └─ eks:index:Cluster                   democert-eks                               creating...  
    +   └─ eks:index:Cluster                   democert-eks                               creating...  
    +   └─ eks:index:Cluster                   democert-eks                               creating.    
    +      │  ├─ aws:iam:RolePolicyAttachment  democert-eks-instanceRole-e1b295bd         created      
    +      │  ├─ aws:iam:RolePolicyAttachment  democert-eks-instanceRole-03516f97         created      
    +      │  └─ aws:iam:RolePolicyAttachment  democert-eks-instanceRole-3eb088f2         created      
    +      ├─ eks:index:ServiceRole            democert-eks-eksRole                            created      
    +   └─ eks:index:Cluster                   democert-eks                                    creating     
    +   └─ eks:index:Cluster                   democert-eks                                    creating.    
    +      │  └─ aws:iam:RolePolicyAttachment  democert-eks-eksRole-4b490823                   created      
    +   └─ eks:index:Cluster                   democert-eks                                    creating...  
    +   pulumi:pulumi:Stack                    aws-classic-ts-eks-cert-manager-dev             creating     Warning: apiextensions.k8s.io/v1beta1 CustomRes
    +   └─ eks:index:Cluster                   democert-eks                                    creating..   
    +   │  ├─ aws:ec2:SecurityGroupRule        democert-eks-eksClusterInternetEgressRule       created      
    +   pulumi:pulumi:Stack                    aws-classic-ts-eks-cert-manager-dev             creating..   Warning: apiextensions.k8s.io/v1beta1 CustomRes
    +   │  ├─ aws:ec2:SecurityGroup            democert-eks-nodeSecurityGroup                  created     
    +   │  ├─ aws:ec2:SecurityGroupRule        democert-eks-eksNodeClusterIngressRule          created     
    +   │  ├─ aws:ec2:SecurityGroupRule        democert-eks-eksNodeInternetEgressRule          created     
    +   │  ├─ aws:ec2:SecurityGroupRule        democert-eks-eksClusterIngressRule              created     
    +   │  ├─ aws:ec2:SecurityGroupRule        democert-eks-eksNodeIngressRule                 created     
    +   │  ├─ aws:ec2:SecurityGroupRule        democert-eks-eksExtApiServerClusterIngressRule  created     
    +   │  ├─ aws:ec2:LaunchConfiguration      democert-eks-nodeLaunchConfiguration            created     
    +   │  ├─ pulumi:providers:kubernetes      democert-eks-eks-k8s                            created     
    +   │  ├─ eks:index:VpcCni                 democert-eks-vpc-cni                            created     
    +   │  ├─ kubernetes:core/v1:ConfigMap     democert-eks-nodeAccess                         created     
    +   │  ├─ aws:cloudformation:Stack         democert-eks-nodes                              created     
    +   │  └─ pulumi:providers:kubernetes      democert-eks-provider                           created     
    +   ├─ pulumi:providers:kubernetes         democert-k8sprovider                            created     
    +   └─ kubernetes:core/v1:Namespace        certmanager-ns                                  created     
    
    Diagnostics:
    pulumi:pulumi:Stack (aws-classic-ts-eks-cert-manager-dev):
        Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in v1.16+, unavailable in v1.22+; use apiextensions.k8s.io/v1 CustomResourceDefinition
    
    Outputs:
        certmanager_namespace_name: "certmanager-ns-toogcs4j"
        cluster_name              : "democert-eks-eksCluster-64d038f"
        k8sProvider_name          : "2662f822-90ca-4d9a-82a4-178ec74083d4"
        kubeconfig                : "[secret]"

    Resources:
        + 30 created

    Duration: 12m41s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (3):
    OUTPUT                VALUE
    awslb_namespace_name  awslb-controller-ns-im5wunlc
    cluster_name          demo-eks-eksCluster-35c9075
    kubeconfig            [secret]
   ```

   If you need to see the value in kubeconfig, you will have to do the following
   ```bash
   pulumi stack output --show-secrets
   ```

1. Uncomment the entire [coding block](https://github.com/tusharshahrs/pulumi-home/blob/master/aws-classic-ts-eks-cert-manager/index.ts#L21-L45) in the `index.ts` that start with `const certManager = new k8s.helm.v3.Release`

1. Run
    ```bash
    pulumi up -y --skip-preview --logtostderr -v=9 --debug --logflow 2>mylogs.txt
    ```

1. export the kubeconfig
    ```bash
    pulumi stack output --show-secrets kubeconfig > kubeconfig
    export KUBECONFIG=$PWD/kubeconfig
    kubectl version
    ```
1. get the cert-manager namespace
   ```bash
   kubectl get ns | pulumi stack output certmanager_namespace_name
   ```

1. The pods for the cert-manager will show the following
    ```bash
    kubectl -n certmanager-ns-toogcs4j get pods
    ```
    Result

    ```bash
    NAME                                                              READY   STATUS    RESTARTS   AGE
    democert-certmanager-z4h6fap0-cert-manager-7547568ccd-7qmmv       0/1     Pending   0          41m
    democert-certmanager-z4h6fap0-cert-manager-cainjector-668ctn469   1/1     Running   0          41m
    democert-certmanager-z4h6fap0-cert-manager-webhook-67447b86bxcc   1/1     Running   0          41m
    ```

1. Describe the error pod that shows `2 Too many pods`
   ```bash
   kubectl -n certmanager-ns-toogcs4j describe pods democert-certmanager-z4h6fap0-cert-manager-7547568ccd-7qmmv
   ```
  
   Result
   ```bash
   Events:
    Type     Reason            Age                 From               Message
    ----     ------            ----                ----               -------
    Warning  FailedScheduling  69s (x30 over 42m)  default-scheduler  0/2 nodes are available: 2 Too many pods
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```