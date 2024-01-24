import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { config } from 'dotenv';

config();

export class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const basicAuthorizer = new NodejsFunction(this, "basicAuthorizer", {
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        avlian: process.env.avlian!,
      },
      functionName: "basicAuthorizer",
      entry: "src/handlers/basicAuthorizer.ts"
    });

    new cdk.CfnOutput(this, 'BasicAuthorizerExport', {
      value: basicAuthorizer.functionArn,
      exportName: 'BasicAuthorizerArn', 
    });
  }
}
