import cdk from '@aws-cdk/core';

export class LambdaApplication extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);
  }
}
