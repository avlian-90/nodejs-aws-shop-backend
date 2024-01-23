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

    const role = new Role(this, "LambdaExecutionRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    role.addToPolicy(
      new PolicyStatement({
        actions: ["lambda:UpdateFunctionConfiguration"],
        resources: ["*"],
      })
    );

    const basicAuthorizer = new NodejsFunction(this, "basicAuthorizer", {
      runtime: lambda.Runtime.NODEJS_20_X,
      functionName: "basicAuthorizer",
      entry: "src/handlers/basicAuthorizer.ts",
      role
    });

    basicAuthorizer.role?.attachInlinePolicy(new iam.Policy(this, 'InvokeLambdaPolicy', {
      statements: [
        new iam.PolicyStatement({
          actions: ["lambda:InvokeFunction"],
          resources: [basicAuthorizer.functionArn ?? ""],
        }),
      ],
    }));

    new cdk.CfnOutput(this, 'BasicAuthorizerExport', {
      value: basicAuthorizer.functionArn,
      exportName: 'BasicAuthorizerArn', 
    });
  }
}
