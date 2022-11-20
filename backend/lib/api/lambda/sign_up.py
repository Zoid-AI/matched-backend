import os
import boto3
import json
import random
import string


def handler(event, context):
    table_name = os.environ["TABLE_NAME"]

    event["body"] = json.loads(event["body"])

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table(table_name)

    required = ['first_name', 'password', 'last_name', 'email', 'languages', 'type']

    for key in required:
        if key not in event["body"]:
            return {
                'statusCode': 403
            }

    user_id = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))

    table.put_item(Item={
        'pk': '#USERNAME{}'.format(event['body']['email']),
        'sk': '#USER_PASSWORD',
        'password': event['body']['password'],
        'id': user_id
    })

    del event['body']['password']
    dictionary = {'pk': '#USER_ID{}'.format(user_id),
                  'sk': '#DATA'}
    for key in event['body']:
        dictionary[key] = event['body'][key]

    table.put_item(Item=dictionary)

    return {
        'statusCode': 201
    }
