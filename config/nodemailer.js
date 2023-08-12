const nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "7086b53c388e38",
    pass: "1c8cdf3b3239f9",
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
