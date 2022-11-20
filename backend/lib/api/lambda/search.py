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

    if('%20') in query_dict['labels']:
        query_dict['labels'] = 'Computer Science'

    response = table.query(
        IndexName="Label",
        KeyConditionExpression=Key('labels').eq(query_dict['labels']),
    )


    for element in response['Items']:
        temp = element['pk']
        element['id'] = temp.replace('#USER_ID', '')


    if 'Items' not in response:
        return {
            'statusCode': 404,
        }

    return {
        'statusCode': 200,
        "body": json.dumps(response['Items'])
    }
