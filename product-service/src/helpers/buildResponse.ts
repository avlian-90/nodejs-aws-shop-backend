import { Response, Body} from "../types/types";

export const buildResponse = (statusCode: number, body: Body): Response => {
    return {
      statusCode,
      headers: {
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(body)
    };
  };