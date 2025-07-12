const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'prathamkumartamboli@gmail.com',
    pass: 'yautsvpttknavaij', // App password
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"TaskEase" <prathamkumartamboli@gmail.com>',
      to,
      subject,
      html,
    });
    console.log('Email sent');
  } catch (err) {
    console.error('❌ Email error:', err);
    throw new Error(`Failed to send email: ${err.message}`);
  }
};

module.exports = sendEmail;
