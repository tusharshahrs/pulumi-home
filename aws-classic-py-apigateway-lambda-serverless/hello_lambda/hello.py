import json

def handler(event, context):
    return {
          "statusCode": 200,
          "body": "Hello World from Pulumi in python via AWS Lambda!!!"}
