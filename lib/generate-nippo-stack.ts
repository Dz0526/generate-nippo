import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as events from 'aws-cdk-lib/aws-events'
import * as path from 'path'
import { Construct } from 'constructs';

export class GenerateNippoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fnGenerateNippo = new lambda.Function(this, 'fnGenerateNippo', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(10),
      runtime: lambda.Runtime.NODEJS_16_X
    })

    new events.Rule(this, 'generateNippoRule', {
      schedule: events.Schedule.cron({minute: '5', hour: '0' }),
      targets: [new targets.LambdaFunction(fnGenerateNippo)]
    })
  }
}
