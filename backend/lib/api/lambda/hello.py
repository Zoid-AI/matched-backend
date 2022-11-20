import boto3
import json
import os
import requests


# {"menteeId":"67890","mentorId":"67891","message":"please"}
def handler(event, context):
    raw_query = event['rawQueryString']
    query = []
    for sub in raw_query.split('&'):
        if '=' in sub:
            query.append(map(str.strip, sub.split('=', 1)))
    query_dict = dict(query)
    name = query_dict['name']
    URL = 'https://newsapi.org/v2/everything'
    PARAMS = {'q':name, 'sortBy': 'popularity', 'apiKey':'72a551cf0da246c7abde552db5f33b85'}
    response = requests.get(url = URL, params = PARAMS)

    print(response.json()['articles'][:10])

    return {
        'statusCode': 200,
        'body': json.dumps(response.json()['articles'][:10])
    }
