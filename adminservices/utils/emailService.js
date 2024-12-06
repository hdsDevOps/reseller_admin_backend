const nodemailer = require('nodemailer');
const { db } = require('../firebaseConfig');
// Configure your email transport here
const transporter = nodemailer.createTransport({
  host: process.env.SERVICE,
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS
    }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.MAILUSER,
      to,
      subject,
      html
    };

    if(subject !='Test Email')
    {
      const templatesRef = db.collection('email_logs');
      await templatesRef.add({
        email:to,
        subject:subject,
        content:html,
        no_receipt:1,
        created_at: new Date()
      });
    }
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

module.exports = {
  sendEmail
};