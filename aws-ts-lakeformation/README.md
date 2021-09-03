
# AWS Lake Formation Permissions with S3, Glue, Iam User, IAM Roles

AWS Lake Formation Permissions with S3, Glue, Iam User, IAM Roles.  This is a workaround formation
[pulumi-aws issue # 1531](https://github.com/pulumi/pulumi-aws/issues/1531)

## Deployment

1. Initialize a new stack called: `vpc-fargate` via [pulumi stack init](https://www.pulumi.com/docs/reference/cli/pulumi_stack_init/).
      ```bash
      pulumi stack init vpc-fargate-dev
      ```
1. Install dependencies.  Note that the package.json has to at/above 4.19.0.  
    Otherwise, you will get the error below.

     ```bash
     error: aws:lakeformation/permissions:Permissions resource 'demo-lakepermissions' has a problem: ExactlyOne: "table_with_columns": only one of `catalog_resource,data_location,database,table,table_with_columns` can be specified, but `catalog_resource,database` were specified.. Examine values at 'Permissions.TableWithColumns'.
     ```

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

1. Populate the config.

   Here are aws [endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html)
   ```bash
   pulumi config set aws:region us-east-2 # any valid aws region endpoint

1. Run **pulumi up**
  
      ```bash
      pulumi up -y
      ```

      Results
      ```bash
      Previewing update (dev)

         View Live: https://app.pulumi.com/myuser/aws-ts-lakeformation/dev/updates/1

         Type                                   Name                                 Status      
      +   pulumi:pulumi:Stack                    aws-ts-lakeformation-dev             created     
      +   ├─ aws:s3:Bucket                       demo-datalake-bucket                 created     
      +   ├─ aws:iam:User                        demo-datalake-iam-user               created     
      +   ├─ aws:glue:CatalogDatabase            demo-datalake-glue-catalog-database  created     
      +   ├─ aws:iam:Role                        demo-datalake-role-0-iamrole         created     
      +   ├─ aws:iam:Policy                      demo-datalake-datalakebasic-policy   created     
      +   ├─ aws:glue:CatalogTable               demo-datalake-glue-catalog-table     created     
      +   ├─ aws:iam:UserPolicyAttachment        demo-datalake-userpolicyattachment   created     
      +   ├─ aws:iam:RolePolicyAttachment        demo-datalake-role-0-policy-1        created     
      +   ├─ aws:iam:RolePolicyAttachment        demo-datalake-role-0-policy-3        created     
      +   ├─ aws:iam:RolePolicyAttachment        demo-datalake-role-0-policy-4        created     
      +   ├─ aws:iam:RolePolicyAttachment        demo-datalake-role-0-policy-0        created     
      +   ├─ aws:iam:RolePolicyAttachment        demo-datalake-role-0-policy-2        created     
      +   ├─ aws:lakeformation:Permissions       demo-lakepermissions                 created     
      +   ├─ aws:lakeformation:DataLakeSettings  demo-datalakesettings                created     
      +   └─ aws:lakeformation:Resource          demo-lakeformation                   created     
      
      Outputs:
         adminpermission_for_datalakesettings_name: {
            admins                          : [
                  [0]: "arn:aws:iam::12334567768:role/demo-datalake-role-0-iamrole-44583c9"
                  [1]: "arn:aws:iam::12334567768:user/demo-datalake-iam-user-0a334f2"
            ]
            id                              : "2686881313"
            urn                             : "urn:pulumi:dev::aws-ts-lakeformation::aws:lakeformation/dataLakeSettings:DataLakeSettings::demo-datalakesettings"
         }
         bucket_name                              : "demo-datalake-bucket-581d8c7"
         glue_database_catalog_table_name         : "mycatalogtable"
         glue_database_name                       : "mycatalogdatabase"
         lakeformation_iam_user_name              : "demo-datalake-iam-user-0a334f2"
         lakeformation_permissions_name           : "3786145756"
         lakeformation_role_name                  : "demo-datalake-role-0-iamrole-44583c9"
         lakeformations_name                      : "arn:aws:s3:::demo-datalake-bucket-581d8c7"

      Resources:
         + 16 created

      Duration: 20s
      ```

1. View the outputs
   ```bash
   pulumi stack output
   ```

   Results
   ```bash
   Current stack outputs (8):
       OUTPUT                                     VALUE
    adminpermission_for_datalakesettings_name  {"admins":["arn:aws:iam::12334567768:role/demo-datalake-role-0-iamrole-44583c9","arn:aws:iam::12334567768:user/demo-datalake-iam-user-0a334f2"],"createDatabaseDefaultPermissions":[],"createTableDefaultPermissions":[],"id":"2686881313","trustedResourceOwners":[],"urn":"urn:pulumi:dev::aws-ts-lakeformation::aws:lakeformation/dataLakeSettings:DataLakeSettings::demo-datalakesettings"}
    bucket_name                                demo-datalake-bucket-581d8c7
    glue_database_catalog_table_name           mycatalogtable
    glue_database_name                         mycatalogdatabase
    lakeformation_iam_user_name                demo-datalake-iam-user-0a334f2
    lakeformation_permissions_name             3786145756
    lakeformation_role_name                    demo-datalake-role-0-iamrole-44583c9
    lakeformations_name                        arn:aws:s3:::demo-datalake-bucket-581d8c7
   ```

1. Destroy the stack

    ```bash
    pulumi destroy -y
    ```

1. Remove the stack
   ```bash
   pulumi stack rm
   ```
