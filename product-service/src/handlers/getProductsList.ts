import { products } from "../data/products";
import { Response } from "../types/types";

export const handler = ():Response => {
    try {
        return {
            statusCode: 200,
            body: products
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: {
                message: error instanceof Error ? error.message : "error",
            }
        }
    }
};