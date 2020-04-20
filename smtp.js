import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const smtp = JSON.parse(event.body);
  const params = {
    TableName: process.env.smtpTableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET service = :service, username = :username, clientId = :clientId, clientSecret = :clientSecret, refreshToken = :refreshToken, redirectURL = :redirectURL",
    ExpressionAttributeValues: {
      ":service": smtp.service || null,
      ":username": smtp.username || null,
      ":clientId": smtp.clientId || null,
      ":clientSecret": smtp.clientSecret || null,
      ":refreshToken": smtp.refreshToken || null,
      ":redirectURL": smtp.redirectURL || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    console.log(e.message);
    return failure({ status: false });
  }
}