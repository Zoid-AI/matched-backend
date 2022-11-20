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

    required = ['first_name', 'password', 'last_name', 'email', 'languages', 'account_type', 'label']

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

    table.put_item(Item={
        'pk': '#USER_ID{}'.format(user_id),
        'sk': '#DATA',
        'first_name': event['body']['first_name'],
        'last_name': event['body']['last_name'],
        'labels': event['body']['labels'],
        'languages': event['body']['languages'],
        'type': event['body']['account_type'],
        'interests': event['body']['interests']
    })

    return {
        'statusCode': 201
    }
