# AWS EKS with Namespace

AWS eks with namespace in TypeScript

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
         View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-eks/dev/previews/d62fd87f-7c68-4994-99c6-e369294ecf0e

         Type                                                  Name                                         Plan       
      +   pulumi:pulumi:Stack                                   aws-classic-ts-eks-dev                       create     
      +   ├─ eks:index:Cluster                                  shaht-eks                                    create     
      +   │  ├─ eks:index:ServiceRole                           shaht-eks-instanceRole                       create     
      +   │  │  ├─ aws:iam:Role                                 shaht-eks-instanceRole-role                  create     
      +   │  │  ├─ aws:iam:RolePolicyAttachment                 shaht-eks-instanceRole-e1b295bd              create     
      +   │  │  ├─ aws:iam:RolePolicyAttachment                 shaht-eks-instanceRole-3eb088f2              create     
      +   │  │  └─ aws:iam:RolePolicyAttachment                 shaht-eks-instanceRole-03516f97              create     
      +   │  ├─ eks:index:ServiceRole                           shaht-eks-eksRole                            create     
      +   │  │  ├─ aws:iam:Role                                 shaht-eks-eksRole-role                       create     
      +   │  │  └─ aws:iam:RolePolicyAttachment                 shaht-eks-eksRole-4b490823                   create     
      +   │  ├─ aws:ec2:SecurityGroup                           shaht-eks-eksClusterSecurityGroup            create     
      +   │  ├─ aws:ec2:SecurityGroupRule                       shaht-eks-eksClusterInternetEgressRule       create     
      +   │  ├─ aws:eks:Cluster                                 shaht-eks-eksCluster                         create     
      +   │  ├─ pulumi:providers:kubernetes                     shaht-eks-provider                           create     
      +   │  ├─ pulumi:providers:kubernetes                     shaht-eks-eks-k8s                            create     
      +   │  ├─ aws:ec2:SecurityGroup                           shaht-eks-nodeSecurityGroup                  create     
      +   │  ├─ kubernetes:core/v1:ConfigMap                    shaht-eks-nodeAccess                         create     
      +   │  ├─ aws:ec2:SecurityGroupRule                       shaht-eks-eksClusterIngressRule              create     
      +   │  ├─ eks:index:VpcCni                                shaht-eks-vpc-cni                            create     
      +   │  ├─ aws:ec2:SecurityGroupRule                       shaht-eks-eksNodeIngressRule                 create     
      +   │  ├─ aws:ec2:SecurityGroupRule                       shaht-eks-eksExtApiServerClusterIngressRule  create     
      +   │  ├─ aws:ec2:SecurityGroupRule                       shaht-eks-eksNodeInternetEgressRule          create     
      +   │  └─ aws:ec2:SecurityGroupRule                       shaht-eks-eksNodeClusterIngressRule          create     
      +   ├─ awsx:ec2:Vpc                                       shaht-vpc                                    create     
      +   │  └─ aws:ec2:Vpc                                     shaht-vpc                                    create     
      +   │     ├─ aws:ec2:Subnet                               shaht-vpc-public-2                           create     
      +   │     │  └─ aws:ec2:RouteTable                        shaht-vpc-public-2                           create     
      +   │     │     ├─ aws:ec2:RouteTableAssociation          shaht-vpc-public-2                           create     
      +   │     │     └─ aws:ec2:Route                          shaht-vpc-public-2                           create     
      +   │     ├─ aws:ec2:InternetGateway                      shaht-vpc                                    create     
      +   │     ├─ aws:ec2:Subnet                               shaht-vpc-public-3                           create     
      +   │     │  └─ aws:ec2:RouteTable                        shaht-vpc-public-3                           create     
      +   │     │     ├─ aws:ec2:Route                          shaht-vpc-public-3                           create     
      +   │     │     └─ aws:ec2:RouteTableAssociation          shaht-vpc-public-3                           create     
      +   │     ├─ aws:ec2:Subnet                               shaht-vpc-private-1                          create     
      +   │     │  └─ aws:ec2:RouteTable                        shaht-vpc-private-1                          create     
      +   │     │     ├─ aws:ec2:RouteTableAssociation          shaht-vpc-private-1                          create     
      +   │     │     └─ aws:ec2:Route                          shaht-vpc-private-1                          create     
      +   │     ├─ aws:ec2:Subnet                               shaht-vpc-private-2                          create     
      +   │     │  └─ aws:ec2:RouteTable                        shaht-vpc-private-2                          create     
      +   │     │     ├─ aws:ec2:RouteTableAssociation          shaht-vpc-private-2                          create     
      +   │     │     └─ aws:ec2:Route                          shaht-vpc-private-2                          create     
      +   │     ├─ aws:ec2:Subnet                               shaht-vpc-private-3                          create     
      +   │     │  └─ aws:ec2:RouteTable                        shaht-vpc-private-3                          create     
      +   │     │     ├─ aws:ec2:RouteTableAssociation          shaht-vpc-private-3                          create     
      +   │     │     └─ aws:ec2:Route                          shaht-vpc-private-3                          create     
      +   │     └─ aws:ec2:Subnet                               shaht-vpc-public-1                           create     
      +   │        ├─ aws:ec2:Eip                               shaht-vpc-1                                  create     
      +   │        ├─ aws:ec2:RouteTable                        shaht-vpc-public-1                           create     
      +   │        │  ├─ aws:ec2:Route                          shaht-vpc-public-1                           create     
      +   │        │  └─ aws:ec2:RouteTableAssociation          shaht-vpc-public-1                           create     
      +   │        └─ aws:ec2:NatGateway                        shaht-vpc-1                                  create     
      +   ├─ pulumi:providers:kubernetes                        shaht-k8sprovider                            create     
      +   ├─ eks:index:ManagedNodeGroup                         shaht-manangednodegroup-spot                 create     
      +   │  └─ aws:eks:NodeGroup                               shaht-manangednodegroup-spot                 create     
      +   ├─ kubernetes:core/v1:Namespace                       shaht-ns                                     create     
      +   ├─ kubernetes:helm.sh/v3:Release                      shaht-metricsserver                          create     
      +   ├─ kubernetes:apps/v1:Deployment                      shaht-nginx-deployment                       create     
      +   ├─ kubernetes:core/v1:Service                         shaht-service                                create     
      +   └─ kubernetes:autoscaling/v2:HorizontalPodAutoscaler  shaht-hpa                                    create     


      Outputs:
         cluster_name                : "shaht-eks-eksCluster-cd25a8b"
         horizontalpodautoscaler_name: output<string>
         kubeconfig                  : output<string>
         managed_node_group_spot_name: output<string>
         metrics_server_name         : output<string>
         myvpc_info                  : output<string>
         namespace_name              : output<string>
         nginx_deployment_name       : output<string>
         service_name                : output<string>
         service_url                 : output<string>

      Resources:
         + 60 to create

      Do you want to perform this update? yes
      Updating (tushar-pulumi-corp/dev)

      View in Browser (Ctrl+O): https://app.pulumi.com/tushar-pulumi-corp/aws-classic-ts-eks/dev/updates/56

         Type                                                  Name                                         Status              
      +   pulumi:pulumi:Stack                                   aws-classic-ts-eks-dev                       created (870s)      
      +   ├─ eks:index:Cluster                                  shaht-eks                                    created (715s)      
      +   │  ├─ eks:index:ServiceRole                           shaht-eks-instanceRole                       created (8s)        
      +   │  │  ├─ aws:iam:Role                                 shaht-eks-instanceRole-role                  created (0.80s)     
      +   │  │  ├─ aws:iam:RolePolicyAttachment                 shaht-eks-instanceRole-03516f97              created (0.45s)     
      +   │  │  ├─ aws:iam:RolePolicyAttachment                 shaht-eks-instanceRole-3eb088f2              created (0.61s)     
      +   │  │  └─ aws:iam:RolePolicyAttachment                 shaht-eks-instanceRole-e1b295bd              created (0.74s)     
      +   │  ├─ eks:index:ServiceRole                           shaht-eks-eksRole                            created (7s)        
      +   │  │  ├─ aws:iam:Role                                 shaht-eks-eksRole-role                       created (0.70s)     
      +   │  │  └─ aws:iam:RolePolicyAttachment                 shaht-eks-eksRole-4b490823                   created (0.69s)     
      +   │  ├─ aws:ec2:SecurityGroup                           shaht-eks-eksClusterSecurityGroup            created (1s)        
      +   │  ├─ aws:ec2:SecurityGroupRule                       shaht-eks-eksClusterInternetEgressRule       created (0.57s)     
      +   │  ├─ aws:eks:Cluster                                 shaht-eks-eksCluster                         created (572s)      
      +   │  ├─ aws:ec2:SecurityGroup                           shaht-eks-nodeSecurityGroup                  created (1s)        
      +   │  ├─ pulumi:providers:kubernetes                     shaht-eks-provider                           created (0.61s)     
      +   │  ├─ pulumi:providers:kubernetes                     shaht-eks-eks-k8s                            created (0.44s)     
      +   │  ├─ eks:index:VpcCni                                shaht-eks-vpc-cni                            created (3s)        
      +   │  ├─ aws:ec2:SecurityGroupRule                       shaht-eks-eksNodeIngressRule                 created (0.91s)     
      +   │  ├─ aws:ec2:SecurityGroupRule                       shaht-eks-eksExtApiServerClusterIngressRule  created (1s)        
      +   │  ├─ aws:ec2:SecurityGroupRule                       shaht-eks-eksClusterIngressRule              created (1s)        
      +   │  ├─ aws:ec2:SecurityGroupRule                       shaht-eks-eksNodeInternetEgressRule          created (1s)        
      +   │  ├─ aws:ec2:SecurityGroupRule                       shaht-eks-eksNodeClusterIngressRule          created (2s)        
      +   │  └─ kubernetes:core/v1:ConfigMap                    shaht-eks-nodeAccess                         created (0.54s)     
      +   ├─ awsx:ec2:Vpc                                       shaht-vpc                                    created (4s)        
      +   │  └─ aws:ec2:Vpc                                     shaht-vpc                                    created (1s)        
      +   │     ├─ aws:ec2:Subnet                               shaht-vpc-private-2                          created (0.82s)     
      +   │     │  └─ aws:ec2:RouteTable                        shaht-vpc-private-2                          created (0.84s)     
      +   │     │     ├─ aws:ec2:RouteTableAssociation          shaht-vpc-private-2                          created (0.45s)     
      +   │     │     └─ aws:ec2:Route                          shaht-vpc-private-2                          created (1s)        
      +   │     ├─ aws:ec2:Subnet                               shaht-vpc-public-2                           created (11s)       
      +   │     │  └─ aws:ec2:RouteTable                        shaht-vpc-public-2                           created (0.92s)     
      +   │     │     ├─ aws:ec2:RouteTableAssociation          shaht-vpc-public-2                           created (0.79s)     
      +   │     │     └─ aws:ec2:Route                          shaht-vpc-public-2                           created (1s)        
      +   │     ├─ aws:ec2:InternetGateway                      shaht-vpc                                    created (1s)        
      +   │     ├─ aws:ec2:Subnet                               shaht-vpc-public-1                           created (11s)       
      +   │     │  ├─ aws:ec2:Eip                               shaht-vpc-1                                  created (0.90s)     
      +   │     │  ├─ aws:ec2:RouteTable                        shaht-vpc-public-1                           created (0.99s)     
      +   │     │  │  ├─ aws:ec2:RouteTableAssociation          shaht-vpc-public-1                           created (1s)        
      +   │     │  │  └─ aws:ec2:Route                          shaht-vpc-public-1                           created (1s)        
      +   │     │  └─ aws:ec2:NatGateway                        shaht-vpc-1                                  created (114s)      
      +   │     ├─ aws:ec2:Subnet                               shaht-vpc-private-3                          created (1s)        
      +   │     │  └─ aws:ec2:RouteTable                        shaht-vpc-private-3                          created (0.78s)     
      +   │     │     ├─ aws:ec2:RouteTableAssociation          shaht-vpc-private-3                          created (0.62s)     
      +   │     │     └─ aws:ec2:Route                          shaht-vpc-private-3                          created (1s)        
      +   │     ├─ aws:ec2:Subnet                               shaht-vpc-public-3                           created (11s)       
      +   │     │  └─ aws:ec2:RouteTable                        shaht-vpc-public-3                           created (0.92s)     
      +   │     │     ├─ aws:ec2:RouteTableAssociation          shaht-vpc-public-3                           created (1s)        
      +   │     │     └─ aws:ec2:Route                          shaht-vpc-public-3                           created (1s)        
      +   │     └─ aws:ec2:Subnet                               shaht-vpc-private-1                          created (1s)        
      +   │        └─ aws:ec2:RouteTable                        shaht-vpc-private-1                          created (0.78s)     
      +   │           ├─ aws:ec2:RouteTableAssociation          shaht-vpc-private-1                          created (0.79s)     
      +   │           └─ aws:ec2:Route                          shaht-vpc-private-1                          created (0.92s)     
      +   ├─ pulumi:providers:kubernetes                        shaht-k8sprovider                            created (0.49s)     
      +   ├─ eks:index:ManagedNodeGroup                         shaht-manangednodegroup-spot                 created (0.35s)     
      +   │  └─ aws:eks:NodeGroup                               shaht-manangednodegroup-spot                 created (107s)      
      +   ├─ kubernetes:core/v1:Namespace                       shaht-ns                                     created (0.61s)     
      +   ├─ kubernetes:helm.sh/v3:Release                      shaht-metricsserver                          created (35s)       
      +   ├─ kubernetes:apps/v1:Deployment                      shaht-nginx-deployment                       created (9s)        
      +   ├─ kubernetes:core/v1:Service                         shaht-service                                created (11s)       
      +   └─ kubernetes:autoscaling/v2:HorizontalPodAutoscaler  shaht-hpa                                    created (1s)        


      Outputs:
         cluster_name                : "shaht-eks-eksCluster-45be534"
         horizontalpodautoscaler_name: "shaht-hpa-36eb2377"
         kubeconfig                  : [secret]
         managed_node_group_spot_name: "shaht-eks-eksCluster-45be534:shaht-manangednodegroup-spot-24eb04e"
         metrics_server_name         : "shaht-metricsserver-ec75ed95"
         myvpc_info                  : "vpc-09e35e72b7ca9822a"
         namespace_name              : "shaht-ns-620df827"
         nginx_deployment_name       : "shaht-nginx-deployment-51b5b696"
         service_name                : "shaht-service-15ba8186"
         service_url                 : "aed0c16745b1842ce8b06345fdeb0b0d-1071759014.us-east-2.elb.amazonaws.com"

      Resources:
         + 60 created

      Duration: 14m32s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (10):
    OUTPUT                        VALUE
    cluster_name                  shaht-eks-eksCluster-45be534
    horizontalpodautoscaler_name  shaht-hpa-36eb2377
    kubeconfig                    [secret]
    managed_node_group_spot_name  shaht-eks-eksCluster-45be534:shaht-manangednodegroup-spot-24eb04e
    metrics_server_name           shaht-metricsserver-ec75ed95
    myvpc_info                    vpc-09e35e72b7ca9822a
    namespace_name                shaht-ns-620df827
    nginx_deployment_name         shaht-nginx-deployment-51b5b696
    service_name                  shaht-service-15ba8186
    service_url                   aed0c16745b1842ce8b06345fdeb0b0d-1071759014.us-east-2.elb.amazonaws.com
   ```

   If you need to see the value in kubeconfig, you will have to do the following
   ```bash
   pulumi stack output --show-secrets
   ```

1. Clean up
   ```bash
   pulumi destroy -y
   ```

1. Remove.  This will remove the *Pulumi.dev.yaml* file also
   ```bash
   pulumi stack rm dev -y
   ```