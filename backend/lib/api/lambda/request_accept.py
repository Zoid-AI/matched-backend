import boto3
import json
import os


def handler(event, context):
    table_name = os.environ["TABLE_NAME"]

    event['body'] = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table(table_name)

    table.put_item(
        Item={
            'pk': '#USER_ID{}'.format(event['body']['mentorId']),
            'sk': '#MENTEE_MATCHED{}'.format(event['body']['menteeId']),
        }
    )

    table.put_item(
        Item={
            'pk': '#USER_ID{}'.format(event['body']['menteeId']),
            'sk': '#MENTOR_MATCHED{}'.format(event['body']['mentorId']),
        }
    )

    table.delete_item(
        Key={
            'pk': '#USER_ID{}'.format(event['body']['mentorId']),
            'sk': '#MATCH{}'.format(event['body']['menteeId']),
        },
    )

    return {
        'statusCode': 201,
    }
