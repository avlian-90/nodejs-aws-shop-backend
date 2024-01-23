import { config } from "dotenv";
import { generatePolicy } from "../helpers/generatePolicy";

config();

export const handler = async(e: any) => {
    console.log(e.authorizationToken);
    console.log(e.methodArn)
    console.log(e)

    if (!e.authorizationToken) {
        return generatePolicy('user', 'Deny', e.methodArn, 401); 
    }

    const [, encodedCredentials] = e.authorizationToken.split(' ');

    const [username, password] = Buffer.from(encodedCredentials, 'base64').toString('utf-8').split(':');

    console.log(username, password);

    if (password !== process.env[username]) {
        return generatePolicy(username, 'Deny', e.methodArn, 403); 
    }

    return generatePolicy(username, 'Allow', e.methodArn);
}