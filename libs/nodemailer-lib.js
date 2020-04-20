const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

export async function email(item) {
    const { content, attachment, service, username, clientId, clientSecret, refreshToken, redirectURL } = item;
    const oauth2Client = new OAuth2(
        clientId, // ClientID
        clientSecret, // Client Secret
        redirectURL // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: refreshToken
    });

    // Build the SMTP server
    let transporter = getTransporter(oauth2Client, service, username);

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.email, // sender address
      to: process.env.email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: content + attachment, // plain text body
    });

    let messageURL = nodemailer.getTestMessageUrl(info);

    return messageURL;
}

function getTransporter(oauth2Client, service, username) {
    oauth2Client.setCredentials({
        refresh_token: process.env.oauth2RefreshToken
    });
    const accessToken = oauth2Client.getAccessToken();
    // create reusable transporter object using the default SMTP transport
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.email,
          clientId: oauth2Client.clientId,
          clientSecret: oauth2Client.clientSecret,
          refreshToken: oauth2Client.refresh_token,
          accessToken: accessToken
        }
    });
}