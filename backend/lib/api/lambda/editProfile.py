import boto3
import json
import os


# labels, description, education, interests
def handler(event, context):
    table_name = os.environ["TABLE_NAME"]

    event['body'] = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table(table_name)

    dictionary = {'pk': '#USER_ID{}'.format(event['body']['id']),
                  'sk': '#DATA'}

    for key in {k: event['body'][k] for k in list(event['body'])[1:]}:
        dictionary[key] = '{}'.format(event['body'][key])

    table.put_item(
        Item=dictionary
    )

    return {
        'statusCode': 201,
    }
