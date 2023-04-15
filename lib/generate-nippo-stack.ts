import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets'
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs'
import * as events from 'aws-cdk-lib/aws-events'
import * as path from 'path'
import { Construct } from 'constructs';
import * as dotenv from 'dotenv'

dotenv.config();

export class GenerateNippoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fnGenerateNippo = new lambda.NodejsFunction(this, 'fnGenerateNippo', {
      entry: path.join(__dirname, 'lambda/index.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(10),
      runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
      bundling: {
        nodeModules: ['date-fns', '@notionhq/client', 'dotenv'],
      },
      environment: {
        NOTION_TOKEN: process.env.NOTION_TOKEN ?? '',
      }
    })

    new events.Rule(this, 'generateNippoRule', {
      schedule: events.Schedule.cron({minute: '5', hour: '15' }),
      targets: [new targets.LambdaFunction(fnGenerateNippo)]
    })
  }
}
