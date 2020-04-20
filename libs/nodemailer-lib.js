const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

export async function email(smtp, note) {
    const { content, attachment} = note;
    // Build the SMTP server
    let transporter = getTransporter(smtp);

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.email, // sender address
      to: process.env.email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: content + attachment, // plain text body
    });

    console.log("email: " + process.env.email + "\n");
    console.log("service: " + smtp.service + "\n");
    console.log("username: " + smtp.service + "\n");
    console.log("clientId: " + smtp.clientId + "\n");
    console.log("clientSecret: " + smtp.clientSecret + "\n");
    console.log("refreshToken: " + smtp.refreshToken + "\n");
    console.log("redirectURL: " + smtp.redirectURL + "\n");

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