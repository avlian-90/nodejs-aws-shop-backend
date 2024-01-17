import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";

export const sendMessagesToSQS = async (
    messages: object[],
    queueUrl: string
  ) => {
    const sqsClient = new SQSClient({ region: "eu-west-1" });
  
    try {
      await sqsClient.send(
        new SendMessageBatchCommand({
          QueueUrl: queueUrl,
          Entries: messages.map((message, index) => ({
            Id: index.toString(),
            MessageBody: JSON.stringify(message),
          })),
        })
      );
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  };