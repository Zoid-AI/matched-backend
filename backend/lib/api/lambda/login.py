import os
import boto3
import json


def handler(event, context):
    table_name = os.environ["TABLE_NAME"]

    event["body"] = json.loads(event["body"])

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table(table_name)

    response = table.get_item(
        Key={
            'pk': '#USERNAME{}'.format(event['body']['email']),
            'sk': '#USER_PASSWORD'
        },
    )

    print(event['body']['email'])
    print(response)

    if 'Item' not in response:
        return {
            'statusCode': 404
        }

    if response['Item']['password'] == event['body']['password']:
        return json.dumps(
            {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(response['Item']['id'])}
        )

    return {
        'statusCode': 403,
    }
