import { email } from "../libs/nodemailer-lib";

test("Email Sent", () => {
  const item = {content: "email body", attachement: "none"};
  const messageURL = email(item);
  expect(messageURL).not.toBeNull();
});