const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  // Add DKIM if you have keys (recommended for production)
  dkim: process.env.DKIM_PRIVATE_KEY ? {
    domainName: process.env.EMAIL_DOMAIN,
    keySelector: 'default',
    privateKey: process.env.DKIM_PRIVATE_KEY
  } : undefined
});

// Send email function
const sendMail = async (options) => {
  try {
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'ERC Admin',
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER
      },
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html || '',
      // Add headers to improve deliverability
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High',
        'List-Unsubscribe': `<mailto:unsubscribe@${process.env.EMAIL_DOMAIN}?subject=Unsubscribe>`
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

module.exports = { sendMail };