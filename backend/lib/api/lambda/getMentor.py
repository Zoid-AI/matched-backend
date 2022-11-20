
import boto3
import json
import os
from boto3.dynamodb.conditions import Key


def handler(event, context):
    table_name = os.environ["TABLE_NAME"]

    event['body'] = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table(table_name)

    response = table.query(
        KeyConditionExpression=Key('pk').eq('#USER_ID{}'.format(event['body']['id'])) & Key('sk').begins_with(
            '#MENTOR_MATCHED'))

    if 'Items' not in response:
        return {
            'statusCode': 404,
        }

    return {
        'statusCode': 201,
        "body": json.dumps(response['Items'])
    }
