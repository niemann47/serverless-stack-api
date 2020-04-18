const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.oauth2ClientId, // ClientID
    process.env.oauth2ClientSecret, // Client Secret
    process.env.oauth2RedirectURL // Redirect URL
);

export async function email(item) {
    const { content, attachment } = item;
    // Build the SMTP server
    let transporter = getTransporter();

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

function getTransporter() {
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
          clientId: process.env.oauth2ClientId,
          clientSecret: process.env.oauth2ClientSecret,
          refreshToken: process.env.oauth2RefreshToken,
          accessToken: accessToken
        }
    });
}