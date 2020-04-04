Object.defineProperty(exports, "__esModule", { value: true });

import * as AWS from 'aws-sdk';
import * as uuid from 'uuid/v4';

export interface Record {
    id: string,
    fileName: string,
    created_at: number
}

exports.handler = async (event: any, context: any, callback: any) => {
    const message = JSON.parse(event['Records'][0]['body'])
    const db = new AWS.DynamoDB.DocumentClient();

    const record: Record = {
        id: uuid(),
        fileName: message.object.key,
        created_at: new Date().getTime()
    }

    try {
        await db.put({
            TableName: process.env.DB_DESTINATION as string,
            Item: record
        }).promise();
    } catch (error) {
        console.error(error)
    }

    return event
};
