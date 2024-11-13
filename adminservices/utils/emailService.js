const nodemailer = require('nodemailer');

// Configure your email transport here
const transporter = nodemailer.createTransport({
  // Add your email service configuration
  // Example for Gmail:
  // service: 'gmail',
  // auth: {
  //   user: process.env.EMAIL_USER,
  //   pass: process.env.EMAIL_PASSWORD
  // }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

module.exports = {
  sendEmail
};