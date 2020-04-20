const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

export async function email(recipient, subject, smtp, note) {
    const { content, attachment} = note;

    // Build the SMTP server
    let transporter = getTransporter(smtp);

    let messageBody = content;

    if(attachment)
    {
        messageBody = messageBody + attachment;
    }

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: smtp.username, // sender address
      to: recipient, // list of receivers
      subject: subject, // Subject line
      text: messageBody, // plain text body
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