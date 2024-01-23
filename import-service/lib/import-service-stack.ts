import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import { S3EventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const importProductsFile = new NodejsFunction(this, 'ImportProductsFile', {
      functionName: 'importProductsFile',
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'src/handlers/importProductsFile.ts',
    });


    const api = new apigateway.RestApi(this, 'import-api', {
      restApiName: 'import API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['*'],
        allowCredentials: true,
      },
    });

    const importedBasicAuthorizer = cdk.Fn.importValue('BasicAuthorizerArn');
   

    const basicAuthorizer = lambda.Function.fromFunctionArn(
      this,
      'importedBasicAuthorizer',
      importedBasicAuthorizer
    );

    const importProd = api.root.addResource('import');

    importProd.addMethod('GET', new apigateway.LambdaIntegration(importProductsFile), {
      authorizer: new apigateway.TokenAuthorizer(this, 'MyLambdaAuthorizer', {
        handler: basicAuthorizer,
      }),
      authorizationType: apigateway.AuthorizationType.CUSTOM
    });

    const importFileParser = new NodejsFunction(this, "ImportFileParser", {
      functionName: "importFileParser",
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: "src/handlers/importFileParser.ts",
    });

    const importServiceBucketUploaded = Bucket.fromBucketName(
      this,
      "ProductsBucket",
      'productsbucket-avlian90'
    ) as Bucket;

    importFileParser.addEventSource(
      new S3EventSource(importServiceBucketUploaded, {
        events: [EventType.OBJECT_CREATED],
        filters: [
          {
            prefix: "uploaded/",
          },
        ],
      })
    );
  }
}
