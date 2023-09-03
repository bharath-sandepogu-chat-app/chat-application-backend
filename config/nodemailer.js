const nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: true,
  tls: {
    rejectUnauthorized: true,
    minVersion: "TLSv1.2",
  },
  auth: {
    user: "testemail9121@gmail.com",
    pass: "tpizygcgppixhjtd",
  },
});
function sendMail(toEmail) {
  return transport.sendMail({
    from: "appchat377@gmail.com",
    to: toEmail,
    subject: "Let's Chat in Chat App",
    html: `<p>Please join chat app to chat with your friend. Click on the <a href=${process.env.CLIENT_ROOT_URL}>link</a> to join</a></p>`,
  });
}

module.exports = {
  sendMail,
};
