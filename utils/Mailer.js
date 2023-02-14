const nodemailer = require("nodemailer");
const { google } = require("googleapis");

//Setting up oAuth
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendEmail = (email, html, subject) => {
  const accessToken = oAuth2Client.getAccessToken();

  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SMTP_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: `noreply ${process.env.SMTP_EMAIL}`,
    to: email,
    html,
    subject,
  };

  smtpTransport.sendMail(mailOptions, function (error, result) {
    if (error) {
      console.log("Sending Email Error");
      console.log(error);
    } else {
      console.log("Sending Email Success");
    }
    smtpTransport.close();
  });
};

exports.sendVerificationCodeToEmail = (email, code) => {
  let html =
    '<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">';
  html += '<div style="margin:50px auto;width:70%;padding:20px 0">';
  html += `<div style="border-bottom:1px solid gray">`;
  html += `<a href="" style="font-size:1.4em;color: black;text-decoration:none;font-weight:600">Feel Fresh</a>`;
  html += "</div>";
  html += '<p style="font-size:1.1em">Hi,</p>';
  html += `<p>Thank you for choosing Feel Fresh. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>`;
  html += `<h2 style="background: black;margin: 0 auto;width: max-content;padding: 0 10px;color: white;border-radius: 4px;">`;
  html += code;
  html += "</h2>";
  html += `<p style="font-size:0.9em;">Regards,<br />Admin Feel Fresh</p>`;
  html += `<hr style="border:none;border-top:1px solid gray" />`;
  html += "</div>";
  html += "</div>";

  sendEmail(email, html, "Verify Your Account");
};
