import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { email } from "./libs/nodemailer-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.smtpTableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
    }
  };

  try {
    const result = await dynamoDbLib.call("get", params);

    if (result.Item) {
      let messageURL = await email(result.Item);

      return success(messageURL);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    return failure({ status: false, error: e.message});
  }
}