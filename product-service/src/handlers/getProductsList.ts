import { products } from "../data/products";

export const handler = async() => {
    try {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify(products)
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
                message: error instanceof Error ? error.message : "error",
            })
        }
    }
};