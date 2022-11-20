
import boto3
import json
import os
from boto3.dynamodb.conditions import Key


def handler(event, context):

    table_name = os.environ["TABLE_NAME"]

    raw_query = event['rawQueryString']
    query = []
    for sub in raw_query.split('&'):
        if '=' in sub:
            query.append(map(str.strip, sub.split('=', 1)))
    query_dict = dict(query)

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    response = table.query(
        KeyConditionExpression=Key('pk').eq('#USER_ID{}'.format(query_dict['id'])) & Key('sk').begins_with(
            '#MENTOR_MATCHED'))

    if 'Items' not in response:
        return {
            'statusCode': 404,
        }

    return {
        'statusCode': 201,
        "body": json.dumps(response['Items'])
    }
