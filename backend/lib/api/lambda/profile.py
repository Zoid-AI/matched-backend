import os
import boto3
import json
def handler(event, context):
    raw_query = event['rawQueryString']
    query = []
    for sub in raw_query.split('&'):
        if '=' in sub:
            query.append(map(str.strip, sub.split('=', 1)))
    query_dict = dict(query)

    table_name=os.environ["TABLE_NAME"]

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table(table_name)

    response = table.get_item(
        Key={
            'pk': '#USER_ID{}'.format(query_dict['id']),
            'sk': '#DATA'
        },
    )

    if 'Item' not in response:
        return {
            'statusCode': 404,
        }

    response['Item']['id'] = query_dict['id']

    return {
        'statusCode': 200,
        'body': json.dumps(response['Item'])
    }
