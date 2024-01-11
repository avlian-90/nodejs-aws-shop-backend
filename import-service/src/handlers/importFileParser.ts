import { parser } from "../helpers/parser";


export const handler = async(e: any) => {
    try {
        const { object } = e.Records[0].s3;
        const key = decodeURIComponent(object.key.replace(/\+/g, " "));
    
        const csvContent = await parser('productsbucket-avlian90', key);

        console.log('Parsed sucsessfully', csvContent);
    
    } catch {
        throw new Error('Error');
    }
}