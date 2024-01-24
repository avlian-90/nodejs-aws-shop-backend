import { config } from "dotenv";
import { generatePolicy } from "../helpers/generatePolicy";

config();

export const handler = async(e: any) => {
    try {

        if (!e.authorizationToken) {
            return generatePolicy('user', 'Deny', e.methodArn, 401);
        }

        const encodedCredentials = e.authorizationToken;

        const [username, password] = Buffer.from(encodedCredentials, 'base64').toString('utf-8').split(':');

        console.log(password);
        console.log(process.env[username]);

        if (password !== process.env[username]) {
            return generatePolicy(username, 'Deny', e.methodArn, 403);
        }

        return generatePolicy(username, 'Allow', e.methodArn, 200);
    } catch (error) {
        console.error("Error in Lambda function:", error);
        return generatePolicy('user', 'Deny', e.methodArn, 500);
    }
}