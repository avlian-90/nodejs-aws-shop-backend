export type Response = {
    statusCode: number;
    headers: {};
    body: string;
}

export const buildResponse = (statusCode: number, body: string | {}): Response => {
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