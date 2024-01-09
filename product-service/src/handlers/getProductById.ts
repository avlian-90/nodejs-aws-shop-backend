import * as AWS from 'aws-sdk';
import { QueryCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { buildResponse } from '../utils/buildResponse';

const getProductById = async (productId: string) => {

    const dynamoDB = new DynamoDBClient({ region: 'eu-west-1' });
  
    const params = {
      TableName: 'products',
      KeyConditionExpression: "id = :productId",
      ExpressionAttributeValues: {
        ":productId": { S: productId },
      },
    };
  
    try {
      const query = new QueryCommand(params);
      const response = await dynamoDB.send(query);
  
      const isProductExists = response.Items && response.Items.length > 0;
  
      if (isProductExists) {
        const product = AWS.DynamoDB.Converter.unmarshall(response.Items?.[0]!);
  
        return product;
      }
  
      return null;
    } catch (error: unknown) {
      throw Error("Unable to get product from Data Base :(");
    }
  };

export const handler = async(e: any) => {
    try {
        const { productId } = e.pathParameters;

        const product = await getProductById(productId);

        if (!product) {
            return buildResponse(404, {
                message: 'Product not found'
            })
        }

        return buildResponse(200, product)

    }   catch (err: any) {
            return buildResponse(500, {
                message: err.message
            })
        }
};