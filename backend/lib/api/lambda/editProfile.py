import boto3
import json
import os

# labels, description, education, interests
def handler(event, context):
    table_name = os.environ["TABLE_NAME"]

    event['body'] = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table(table_name)

    table.put_item(
        Item={
            'pk': '#USERNAME{}'.format(event['body']['email']),
            'sk': '#USER_PASSWORD',
            'labels': '{}'.format(event['body']['message'])
        }
    )

    return {
        'statusCode': 201,
    }
