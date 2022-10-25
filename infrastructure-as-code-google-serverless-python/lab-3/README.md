# Lab 3: Create Pulumi Google Cloud Resources and Deploy the Function
Create all the Google Cloud Resources and deploy the function

## Add all the import statements
Go back to where the `Pulumi.dev.yaml` file is located.

Clear out the contents in `__main__.py` and replace it with the following:

```python
"""A Google Cloud Function Python Pulumi program"""
from cProfile import run
from pip import main
import pulumi
import pulumi_gcp as gcp
import pulumi_synced_folder as synced
```  

## Import the program's configuration settings.
We want to use what we added via `pulumi config` in this program.
More details are at [Accessing Configuration from Code](https://www.pulumi.com/docs/intro/concepts/config/#code)

Append the following to `__main__.py`
```python
config = pulumi.Config()
site_path = config.get("sitePath", "./www")
app_path = config.get("appPath", "./app")
index_document = config.get("indexDocument", "index.html")
error_document = config.get("errorDocument", "error.html")
```

## Create a storage bucket and configure it as a website.
Append the following to `__main__.py`
```python
site_bucket = gcp.storage.Bucket(
    "site-bucket",
    gcp.storage.BucketArgs(
        location="US",
        website=gcp.storage.BucketWebsiteArgs(
            main_page_suffix=index_document,
            not_found_page=error_document,
        ),
    ),
)

pulumi.export("site_bucket_name", site_bucket.name)
pulumi.export("site_bucket_url", site_bucket.url)
```

We want to know the name of the site bucket we created.

Run `pulumi up` and select `yes`
Once the resources are up, check the output of the storage bucket.

Check the outputs:
```bash
pulumi stack output
```

## Create an IAM binding to allow public read access to the bucket.
Append the following to `__main__.py`

```python
site_bucket_iam_binding = gcp.storage.BucketIAMBinding(
    "site-bucket-iam-binding",
    gcp.storage.BucketIAMBindingArgs(
        bucket=site_bucket.name, role="roles/storage.objectViewer", members=["allUsers"]
    ),
)
pulumi.export("site_bucket_iam_binding_etag", site_bucket_iam_binding.etag)
```

## Use a synced folder to manage the files of the website.
Append the following to `__main__.py`
```python
synced_folder = synced.GoogleCloudFolder(
    "synced-folder",
    synced.GoogleCloudFolderArgs(
        path=site_path,
        bucket_name=site_bucket.name,
    ),
)
```

## Create another storage bucket for the serverless app.
Append the following to `__main__.py`
```python
app_bucket = gcp.storage.Bucket(
    "app-bucket",
    gcp.storage.BucketArgs(
        location="US",
    ),
)

pulumi.export("app_bucket_name", app_bucket.name)
pulumi.export("app_bucket_url", app_bucket.url)
```

We want to know the name of the app bucket we created.

Run `pulumi up` and select `yes`
Once the resources are up, check the output of the storage bucket.

Check the outputs:
```bash
pulumi stack output
```