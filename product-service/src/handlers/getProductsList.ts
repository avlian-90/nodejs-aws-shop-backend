import { buildResponse } from '../helpers/buildResponse';
import { combineTables } from '../helpers/combineTables';


export const handler = async() => {
    try {
        const combinedTables = await combineTables();
        return buildResponse(200, combinedTables)
       
    } catch (error) {
        return buildResponse(500, {
            message: error instanceof Error ? error.message : "error"
        })
    }
};