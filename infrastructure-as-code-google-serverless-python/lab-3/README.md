# Lab 3: Create Pulumi Google Cloud Resources and Deploy the Function
Create all the Google Cloud Resources and deploy the function

## Add all the import statements

Clear out everything in `__main__.py` and replace it with the following:

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