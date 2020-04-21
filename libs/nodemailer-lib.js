//import { Amplify, Storage } from "aws-amplify";
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

export async function email(recipient, subject, attachmentURL, smtp, note) {
    const { content, attachment} = note;

    // Build the SMTP server
    let transporter = getTransporter(smtp);

    let messageBody = content;

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: smtp.username, // sender address
      to: recipient, // list of receivers
      subject: subject, // Subject line
      html: messageBody + '<img src="cid:attachment"/>', // html body
      attachments: [{
        filename: attachment,
        path: attachmentURL,
        cid: 'attachment' //same cid value as in the html img src
      }]
    });

    let messageURL = nodemailer.getTestMessageUrl(info);

    return messageURL;
}

function getTransporter(smtp) {
    const oauth2Client = new OAuth2(
        smtp.clientId, // ClientID
        smtp.clientSecret, // Client Secret
        smtp.redirectURL // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: smtp.refreshToken
    });

    const accessToken = oauth2Client.getAccessToken();
    // create reusable transporter object using the default SMTP transport
    return nodemailer.createTransport({
        service: smtp.service,
        auth: {
          type: "OAuth2",
          user: smtp.username,
          clientId: smtp.clientId,
          clientSecret: smtp.clientSecret,
          refreshToken: smtp.refreshToken,
          accessToken: accessToken
        }
    });
}