import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Queue } from "aws-cdk-lib/aws-sqs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import {
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Topic } from "aws-cdk-lib/aws-sns";
import { EmailSubscription } from "aws-cdk-lib/aws-sns-subscriptions";

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getProductsList = new NodejsFunction(this, 'GetProductsList', {
      functionName: 'getProductsList',
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'src/handlers/getProductsList.ts',
    });

    const getProductsById = new NodejsFunction(this, 'GetProductsById', {
      functionName: 'getProductsById',
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'src/handlers/getProductById.ts',
    });

    const createProduct = new NodejsFunction(this, 'CreateProduct', {
      functionName: 'createProduct',
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'src/handlers/createProduct.ts',
    });

    const api = new apigateway.RestApi(this, 'products-api', {
      restApiName: 'api',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['*'],
        allowCredentials: true,
      },
    });

    const prodApi = api.root.addResource('products');
    const prodId = prodApi.addResource('{productId}');
  

    prodApi.addMethod('GET', new apigateway.LambdaIntegration(getProductsList));

    prodId.addMethod('GET', new apigateway.LambdaIntegration(getProductsById));

    prodApi.addMethod('PUT', new apigateway.LambdaIntegration(createProduct));

    const catalogItemsQueue = new Queue(this, "catalogItemsQueue");

    const role = new Role(this, "LambdaExecutionRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    role.addToPolicy(
      new PolicyStatement({
        actions: ["sns:Publish"],
        resources: ["*"],
      })
    );

    const catalogBatchProcess = new NodejsFunction(
      this,
      "CatalogBatchProcess",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        environment: { SQS_QUEUE_URL: catalogItemsQueue.queueUrl },
        functionName: "catalogBatchProcess",
        entry: "src/handlers/catalogBatchProcess.ts",
        role: role,
      }
    );

    catalogBatchProcess.addEventSource(
      new SqsEventSource(catalogItemsQueue, {
        batchSize: 5,
      })
    );

    catalogBatchProcess.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [catalogItemsQueue.queueArn],
        actions: ["*"],
      })
    );

    catalogItemsQueue.grantSendMessages(catalogBatchProcess);

    const topic = new Topic(this, "createProductTopic");
    const emailSubscription = new EmailSubscription("lianavagyan90@gmail.com");
    topic.addSubscription(emailSubscription);
  }
}
