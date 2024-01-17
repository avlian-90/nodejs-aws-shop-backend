import { SNS } from "aws-sdk";
import { createProduct } from "./createProduct";
import { isProductValid } from "../helpers/isProductValid";

const sns = new SNS();

export const handler = async(e: any) => {
    for (const record of e.Records) {
        try {
          const product = JSON.parse(record.body);
    
          if (!isProductValid(product)) {
            console.log("The Product is not valid");
          } else {
            await createProduct(product);
            console.log("The product has been created")
          }
        } catch (error) {
          console.error(error);
        }
    }

    const params = {
        Message: "Products created successfully!",
        TopicArn: "arn:aws:sns:eu-west-1:847812859709:ProductServiceStack-createProductTopic05C0E62B-vQgkEYvNIc0O",
    };
  
    await sns.publish(params).promise();
}