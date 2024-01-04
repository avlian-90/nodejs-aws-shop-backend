import { products } from "../data/products";

export const handler = async() => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify(products)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error instanceof Error ? error.message : "error",
            })
        }
    }
};