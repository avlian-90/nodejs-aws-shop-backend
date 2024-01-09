import * as AWS from 'aws-sdk';
import { ItemList } from 'aws-sdk/clients/dynamodb';
import { buildResponse } from '../utils/buildResponse';

AWS.config.update({ region: 'eu-west-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const scanTable = async (tableName: string): Promise<ItemList | undefined> => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: tableName,
    };

    dynamoDB.scan(params, (err, data) => {
      if (err) {
        console.log("Error while scanning.");
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
};

export const handler = async() => {
    try {
        const productsTable = await scanTable('products');
        const stocksTable = await scanTable('stocks');
    
        const combinedTables = productsTable?.map((product) => {
          const currentStock =
            stocksTable?.find((stock) => stock.product_id === product.id) ?? {};
    
          const { product_id, ...restData } = currentStock;
    
          return {
            ...restData,
            ...product,
          };
        });
        return buildResponse(200, combinedTables)
       
    } catch (error) {
        return buildResponse(500, {
            message: error instanceof Error ? error.message : "error"
        })
    }
};