import { products } from '../data/products';

export const handler = async(e: any) => {
    try {
        const { productId } = e.pathParameters;

        const product = products.find((product) => product.id === productId);

        if (!product) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: 'Product not found'
            })
        }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(product)
        };
    }   catch (err: any) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: err.message
                })
            }
    }
};