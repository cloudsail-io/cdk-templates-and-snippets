import * as cdk from '@aws-cdk/core';

import { Bucket, BucketEncryption, EventType } from '@aws-cdk/aws-s3'
import { Queue } from '@aws-cdk/aws-sqs'
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources'
import { SqsDestination } from '@aws-cdk/aws-s3-notifications'
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda'
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb'
import { Duration } from '@aws-cdk/core';

export class CdkTemplatesAndSnippetsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const sourceBucket = new Bucket(this, `${id}-sourceBucket`, {
            encryption: BucketEncryption.KMS_MANAGED,
        });

        const queue = new Queue(this, `${id}-sqs-queue`, {
            visibilityTimeout: Duration.seconds(43200)
        });

        sourceBucket.addEventNotification(
            EventType.OBJECT_CREATED,
            new SqsDestination(queue), { suffix: '.pdf' });

        const table = new Table(this, `${id}-dynamodb-table`, {
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: {
                name: `id`,
                type: AttributeType.STRING
            }
        });

        const lambda = new Function(this, `${id}-function-lambda`, {
            functionName: `${id}-function-lambda`,
            handler: 'index.handler',
            runtime: Runtime.NODEJS_12_X,
            code: Code.asset('lib/s3-sqs-lambda-dynamodb-template/lambda/'),
            timeout: cdk.Duration.minutes(15),
            retryAttempts: 0,
            environment: {
                DB_DESTINATION: table.tableName
            }
        });

        table.grantReadWriteData(lambda);
    }
}
