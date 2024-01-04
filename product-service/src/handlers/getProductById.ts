import { products } from '../data/products';
import { Response } from '../types/types';

export const handler = (e: any):Response => {
    try {
        const { productId } = e.pathParameters;

        const product = products.find((product) => product.id === productId);

        if (!product) {
        return {
            statusCode: 404,
            body: {
                message: 'Product not found'
            }
        }
        }

        return {
            statusCode: 200,
            body: product
        };
    }   catch (err: any) {
            return {
                statusCode: 500,
                body: {
                    message: err.message
                }
            }
    }
};