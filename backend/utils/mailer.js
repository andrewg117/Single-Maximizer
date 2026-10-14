const formData = require("form-data");
const Mailgun = require("mailgun.js");

const MAILGUN_API = process.env.MAILGUN_API;
const mgDomain = "mail.trackstarz.com";

// Without a Mailgun key (e.g. a local demo), emails are logged instead of sent
const mg = MAILGUN_API
  ? new Mailgun(formData).client({ username: "api", key: MAILGUN_API })
  : null;

if (!mg) {
  console.log("MAILGUN_API not set: emails will be logged, not sent");
}

const sendMail = async (mailOptions) => {
  if (!mg) {
    const attachments = mailOptions.attachment?.length || 0;
    console.log(
      `[mail disabled] To: ${mailOptions.to} | Subject: ${mailOptions.subject} | Attachments: ${attachments}\n` +
        (mailOptions.text || mailOptions.html)
    );
    return { message: "Mail disabled; email logged to server console" };
  }

  return mg.messages.create(mgDomain, mailOptions);
};

module.exports = {
  sendMail,
};
