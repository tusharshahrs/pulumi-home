# AWS EKS with vpc via AWSX package in TypeScript

AWS vpc built with [awsx package](https://www.pulumi.com/registry/packages/awsx/installation-configuration/) and eks with no security groups, therefore, the [default rules](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html) for egress and ingress will apply.

## Deployment

1. Initialize a new stack called: `dev` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).

   ```bash
   pulumi stack init dev
   ```

1. Install the dependencies
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
    Updating (dev)

    View Live: https://app.pulumi.com/shaht/aws-classic-ts-eks-vpc-sg-default-rules/dev/updates/1

      Type                                   Name                                         Status       
   +   pulumi:pulumi:Stack                    aws-classic-ts-eks-vpc-sg-default-rules-dev  creating     
   +   ├─ eks:index:Cluster                   demo-eks                                     creating     
   +   │  ├─ eks:index:ServiceRole            demo-eks-instanceRole                        created      
   +   │  │  ├─ aws:iam:Role                  demo-eks-instanceRole-role                   created      
   +   │  │  ├─ aws:iam:RolePolicyAttachment  demo-eks-instanceRole-03516f97               created      
   +   │  │  ├─ aws:iam:RolePolicyAttachment  demo-eks-instanceRole-e1b295bd               created      
   +   │  │  └─ aws:iam:RolePolicyAttachment  demo-eks-instanceRole-3eb088f2               created      
   +   ├─ eks:index:Cluster                   demo-eks                                     creating.    
   +   ├─ eks:index:Cluster                   demo-eks                                     creating..   
   +   │  │  └─ aws:iam:RolePolicyAttachment  demo-eks-eksRole-4b490823                    created      
   +   │  ├─ eks:index:RandomSuffix                  demo-eks-cfnStackName                        created      
   +   │  └─ aws:iam:InstanceProfile                 demo-eks-instanceProfile                     created      
   +   ├─ eks:index:Cluster                          demo-eks                                     creating...  
   +   ├─ eks:index:Cluster                          demo-eks                                     creating     
   +         ├─ aws:ec2:InternetGateway              demo-vpc                                     created      
   +         ├─ aws:ec2:Subnet                       demo-vpc-private-2                           created      
   +         │  └─ aws:ec2:RouteTable                demo-vpc-private-2                           created      
   +   ├─ eks:index:Cluster                          demo-eks                                     creating.    
   +         ├─ aws:ec2:Subnet                       demo-vpc-private-3                           created      
   +         │  └─ aws:ec2:RouteTable                demo-vpc-private-3                           created      
   +         │     └─ aws:ec2:RouteTableAssociation  demo-vpc-private-3                           created      
   +         ├─ aws:ec2:Subnet                       demo-vpc-public-1                            created      
   +   ├─ eks:index:Cluster                          demo-eks                                     creating..   
   +         │  ├─ aws:ec2:RouteTable                demo-vpc-public-1                            created      
   +   ├─ eks:index:Cluster                          demo-eks                                     creating...  
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-1                            created      
   +         │  │  └─ aws:ec2:Route                  demo-vpc-public-1                            created     
   +         │  └─ aws:ec2:NatGateway                demo-vpc-1                                   created     
   +         ├─ aws:ec2:Subnet                       demo-vpc-private-1                           created     
   +         │  └─ aws:ec2:RouteTable                demo-vpc-private-1                           created     
   +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-private-1                           created     
   +         │     └─ aws:ec2:Route                  demo-vpc-private-1                           created     
   +         ├─ aws:ec2:Subnet                       demo-vpc-public-3                            created     
   +         │  └─ aws:ec2:RouteTable                demo-vpc-public-3                            created     
   +         │     ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-3                            created     
   +         │     └─ aws:ec2:Route                  demo-vpc-public-3                            created     
   +         └─ aws:ec2:Subnet                       demo-vpc-public-2                            created     
   +            └─ aws:ec2:RouteTable                demo-vpc-public-2                            created     
   +               ├─ aws:ec2:RouteTableAssociation  demo-vpc-public-2                            created     
   +               └─ aws:ec2:Route                  demo-vpc-public-2                            created     
   
   Outputs:
      cluster_name                  : "demo-eks-eksCluster-27e2d34"
      cluster_security_group_name   : "demo-eks-eksClusterSecurityGroup-2995afb"
      vpc_az_zones                  : 3
      vpc_cidr                      : "10.0.0.0/24"
      vpc_id                        : "vpc-04a7f7062faf927e1"
      vpc_number_of_nat_gateways    : 1
      vpc_private_subnet_ids        : [
         [0]: "subnet-0b139947a1dd521a2"
         [1]: "subnet-0e6e1ab757a007783"
         [2]: "subnet-006f293353816a564"
      ]
      vpc_public_subnet_ids         : [
         [0]: "subnet-0c774457041edaa2d"
         [1]: "subnet-050abab4065cfe6b3"
         [2]: "subnet-0872e038d72fa05a3"
      ]

   Resources:
      + 56 created

   Duration: 11m0s
   ```

1. View the outputs.
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
    Current stack outputs (10):
    OUTPUT                          VALUE
    cluster_name                    demo-eks-eksCluster-27e2d34
    cluster_security_group_egress   []
    cluster_security_group_ingress  []
    cluster_security_group_name     demo-eks-eksClusterSecurityGroup-2995afb
    vpc_az_zones                    3
    vpc_cidr                        10.0.0.0/24
    vpc_id                          vpc-04a7f7062faf927e1
    vpc_number_of_nat_gateways      1
    vpc_private_subnet_ids          ["subnet-0b139947a1dd521a2","subnet-0e6e1ab757a007783","subnet-006f293353816a564"]
    vpc_public_subnet_ids           ["subnet-0c774457041edaa2d","subnet-050abab4065cfe6b3","subnet-0872e038d72fa05a3"]
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