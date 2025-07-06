const nodemailer = require("nodemailer");

(async () => {
  const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Deploy Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: process.env.EMAIL_SUBJECT || "🚀 Deploy Notification",
    text: process.env.EMAIL_BODY || "Deployment completed.",
  });

  console.log("📧 Email sent: %s", info.messageId);
})();
