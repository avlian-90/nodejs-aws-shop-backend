import { APIGatewayAuthorizerResult } from "aws-lambda";

export const generatePolicy = (principalId: string, effect: string, resource: string, statusCode?:number): APIGatewayAuthorizerResult => {
    const policy: APIGatewayAuthorizerResult =  {
        principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    };
    
    if (statusCode) {
        policy['context'] = { statusCode };
    }

    return policy;
}