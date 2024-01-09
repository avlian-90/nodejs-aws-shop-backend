import { DynamoDB, config } from "aws-sdk";
import { products } from "../data/products";
import { stocks } from "../data/stocks";
import { Product, Stock } from "../types/types";


config.update({ region: 'eu-west-1' });

const dynamoDB = new DynamoDB.DocumentClient();

const addItemToTable = (item: Product | Stock, tableName: string) => {
  const params = {
    TableName: tableName,
    Item: item,
  };

  dynamoDB.put(params, (err) => {
    if (err) {
      console.error("Unable to add item!");
    } else {
      console.log("Item has been successfully added!");
    }
  });
};

const addProductsToTable = (products: Product[], tableName: string) => {
  products.forEach((product) => {
    addItemToTable(product, tableName);
  });
};

addProductsToTable(products, 'products');

const addStocksToTable = (stocks: Stock[], tableName: string) => {
  stocks.forEach((stock) => {
    addItemToTable(stock, tableName);
  });
};

addStocksToTable(stocks, 'stocks');