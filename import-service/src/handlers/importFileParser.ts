import { parser } from "../helpers/parser";
import { sendMessagesToSQS } from "../helpers/sendMessagesToSQS";


export const handler = async(e: any) => {
    try {
        for (const record of e.Records) {
            const s3Bucket = record.s3.bucket.name;
            const s3Key = record.s3.object.key;

            const csvContent = await parser(s3Bucket, s3Key);

            console.log('Parsed sucsessfully', csvContent);

            const queueUrl = "https://sqs.eu-west-1.amazonaws.com/847812859709/ProductServiceStack-catalogItemsQueue79451959-2W5cuVyFp1A1";
            await sendMessagesToSQS(csvContent, queueUrl);
            console.log("sent to sqs")
        } 
    } catch(error) {
        console.error(`An error occurred: ${error}`);
    }
}