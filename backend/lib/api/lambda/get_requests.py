import boto3
import json
import os


# {"menteeId":"67890","mentorId":"67891","message":"please"}
def handler(event, context):
    table_name = os.environ["TABLE_NAME"]

    event['body'] = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table(table_name)

    table.put_item(
        Item={
            'pk': '#USER_ID{}'.format(event['body']['mentorId']),
            'sk': '#MATCH{}'.format(event['body']['menteeId']),
            'match_message': '{}'.format(event['body']['message'])
        }
    )

    return {
        'statusCode': 201,
    }
