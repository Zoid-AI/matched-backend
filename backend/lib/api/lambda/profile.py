import os
import boto3
import json
def handler(event, context):
    table_name=os.environ["TABLE_NAME"]

    event["body"] = json.loads(event["body"])

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table(table_name)

    response = table.get_item(
        Key={
            'pk': '#USER_ID{}'.format(event['body']['id']),
            'sk': '#DATA'
        },
    )

    if 'Item' not in response:
        return {
            'statusCode': 404,
        }

    return {
        'statusCode': 200,
        "body": json.dumps(response['Item'])
    }
