import { S3, config } from "aws-sdk";
import csv from "csv-parser";

config.update({ region: 'eu-west-1' });

const s3 = new S3();

export const parser = async (bucket: string, key: string):Promise<object[]> => {
  const csvData: object[] = [];

  return new Promise((resolve, reject) => {
    s3.getObject({
        Bucket: bucket,
        Key: key,
      })
      .createReadStream()
      .pipe(csv())
      .on("data", (chunk: object) => {
        csvData.push(chunk);
      })
      .on("end", () => {
        console.log("Parsing CSV completed");
        resolve(csvData);
      })
      .on("error", (error: Error) => {
        console.log(error.message);
        reject(error.message);
      });
  });
};