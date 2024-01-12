import { parser } from "../helpers/parser";


export const handler = async(e: any) => {
    try {

        for (const record of e.Records) {
            const s3Bucket = record.s3.bucket.name;
            const s3Key = record.s3.object.key;

            const csvContent = await parser(s3Bucket, s3Key);

            console.log('Parsed sucsessfully', csvContent);
        } 
    } catch(error) {
        console.error(`An error occurred: ${error}`);
    }
}