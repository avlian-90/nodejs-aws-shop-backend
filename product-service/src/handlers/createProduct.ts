import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid";
import { buildResponse } from "../helpers/buildResponse";
import { isProductValid } from "../helpers/isProductValid";
import { Product } from "../types/types";

const dynamoDB = new DynamoDB.DocumentClient({
  region: 'eu-west-1'
});

export const createProduct = async (data: Product) => {
  const tableName = 'products';

  const { description, title, price, count } = data;

  const product: Product = {
    id: uuid.v4(),
    title,
    description,
    price,
    count
  };

  const params = {
    TableName: tableName,
    Item: product
  };

  try {
    await dynamoDB.put(params).promise();
  } catch (error) {
    throw Error(`${error} => error ${data}`);
  }
};

export const handler = async (e: any) => {
  

  const product = !!e.body && JSON.parse(e.body);

  if (isProductValid(product)) {
    return buildResponse(400, {
        massage: 'Product data is invalid!'
    })
  }

  try {
    await createProduct(product);

    return buildResponse(200, {
        message: 'Product has been successfully added'
    })

  } catch (error) {
    return buildResponse (500, {
        message: `Unable to create a product :( Error => ${error}`
    })
  }
};