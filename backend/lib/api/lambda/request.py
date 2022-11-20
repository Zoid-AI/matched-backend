import boto3
import json
import os


# {"menteeId":"67890","mentorId":"67891","message":"please"}
def handler(event, context):
    table_name = os.environ["TABLE_NAME"]

    event['body'] = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table(table_name)

    mentee_info = table.get_item(Key={
        'pk': '#USER_ID{}'.format(event['body']['menteeId']),
        'sk': '#DATA'
    })

    table.put_item(
        Item={
            'pk': '#USER_ID{}'.format(event['body']['mentorId']),
            'sk': '#MATCH{}'.format(event['body']['menteeId']),
            'match_message': '{}'.format(event['body']['message']),
            'email': '{}'.format(mentee_info['Item']['email']),
            'id': '{}'.format(event['body']['menteeId']),
            'first_name': '{}'.format(mentee_info['Item']['first_name']),
            'last_name': '{}'.format(mentee_info['Item']['last_name']),
        }
    )

    return {
        'statusCode': 201,
    }
