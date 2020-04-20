import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { email } from "./libs/nodemailer-lib";

export async function main(event, context) {
  const smtpParams = {
    TableName: process.env.smtpTableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
    }
  };

  const notesParams = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  try {
    const smtpResult = await dynamoDbLib.call("get", smtpParams);
    const noteResult = await dynamoDbLib.call("get", notesParams);

    if (smtpResult.Item && noteResult.Item) {
      let messageURL = await email(smtpResult.Item, noteResult.Item);

      return success(messageURL);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    console.log(e.message);
    return failure({ status: false, error: e.message});
  }
}