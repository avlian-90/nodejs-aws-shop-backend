import { buildResponse } from '../helpers/buildResponse';
import { combineTables } from '../helpers/combineTables'; 

export const handler = async(e: any) => {
    try {
        const { productId } = e.pathParameters;

        const combinedTables =  await combineTables();

        const product = combinedTables?.find(product => product.id === productId);

        if (!product) {
            return buildResponse(404, {
                message: 'Product not found'
            })
        }

        return buildResponse(200, product)

    }   catch (err: any) {
            return buildResponse(500, {
                message: err.message
            })
        }
};