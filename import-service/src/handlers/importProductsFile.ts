import { S3 } from "aws-sdk";
import { buildResponse } from "../helpers/buildResponse";

export const handler = async(e: any) => {
  const { name } = e.queryStringParameters;

  console.log(name);

  const s3 = new S3({ region: 'eu-west-1' });

  try {
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: 'productsbucket-avlian90',
      ContentType: "text/csv",
      Key: `uploaded/${name}`, 
      Expires: 60
    });
    console.log(signedUrl);
    return buildResponse(200, signedUrl);

  } catch (error) {
    return buildResponse(500, {
        message: error
    })
  }
}