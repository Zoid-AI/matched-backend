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
            'pk': '#USERNAME{}'.format(event['body']['email']),
            'sk': '#USER_PASSWORD'
        },
    )

    if 'Item' not in response:
        return {
            'statusCode': 404
        }

    if response['Item']['password'] == event['body']['password']:
        return {
            'statusCode': 200,
            'body': json.dumps({
                'id': response['Item']['id']
            })
        }

    return {
        'statusCode': 403,
    }
