"""A Google Cloud Python Pulumi program"""

import pulumi
from pulumi_gcp import storage
import pulumi_gcp as gcp

stack = pulumi.get_stack()
project = pulumi.get_project()

pulumi.export('get_project_info', project)
pulumi.export('get_stack_info', stack)

# The following results in NO output for data
#cfg = pulumi.Config()
#data = cfg.get_object("data")

# The following results in output for data2
cfg = pulumi.Config("gcp-org")
data= cfg.get_object("data")

#pulumi.export('data_output_does_not_return_anything',data)
pulumi.export('data2_output_does_return_stuff',data)

organization_id = cfg.get('gcp:project')
pulumi.export('organization_id', organization_id)

organization_id2 = cfg.get("gcp:project")
pulumi.export('organization_id2', organization_id2)
# Create a GCP resource (Storage Bucket)
#bucket = storage.Bucket('my-bucket', location="US")

# Export the DNS name of the bucket
#pulumi.export('bucket_name', bucket.url)

# List of desired project names to be created within the organization
# Function to determine whether to import or create new projects

def determine_import_or_create(id):
    project_check = gcp.organizations.get_project(project_id=id)
    print(project_check)
    if project_check.name is not None:
         return pulumi.ResourceOptions(import_=id)
    else:
         return None

projects = []
for folder_id, projects in data['projects'].items():
    print(f'Creating projects in folder {folder_id}')
    for project_id in projects:
        # Define GCP project resources
        print(f'Creating project {project_id}')
        project_resource = gcp.organizations.Project(f'{project_id}',
            project_id=project_id,
            folder_id=folder_id,
            opts=determine_import_or_create(project_id)
        )
        # Export the project ID and number for reference
        projects.append(project_resource.id)
pulumi.export('projects_id', [projects.project_id for project in projects])
