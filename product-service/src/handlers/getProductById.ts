import { products } from '../data/products';

export const handler = async(e: any) => {
    try {
        const { productId } = e.pathParameters;

        const product = products.find((product) => product.id === productId);

        if (!product) {
        return {
            statusCode: 404,
            headers: {
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
                message: 'Product not found'
            })
        }
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify(product)
        };
    }   catch (err: any) {
            return {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({
                    message: err.message
                })
            }
    }
};