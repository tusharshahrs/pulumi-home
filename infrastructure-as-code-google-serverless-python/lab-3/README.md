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
