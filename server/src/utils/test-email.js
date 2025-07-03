// BISON\ERC UoC Final\UoC-ERC-system\server\src\utils\test-email.js
const { sendMail } = require('./email-service');

async function testEmail() {
  try {
    const recipientName = "Test User";
    const result = await sendMail({
      to: 'malakauom11@gmail.com',
      subject: 'Important: Your UoC ERC System Account Information',
      text: `
Dear ${recipientName},

Thank you for registering with the University of Colombo Ethics Review Committee System.

This email confirms that your account has been set up successfully. Please save this email for your records.

If you have any questions, please contact us at erc-support@cmb.ac.lk.

Best regards,
The UoC ERC Admin Team
University of Colombo
      `,
      html: `
<div style="font-family: Arial, sans-serif; line-height: 1.5;">
  <p>Dear ${recipientName},</p>
  
  <p>Thank you for registering with the <strong>University of Colombo Ethics Review Committee System</strong>.</p>
  
  <p>This email confirms that your account has been set up successfully. Please save this email for your records.</p>
  
  <p>If you have any questions, please contact us at <a href="mailto:erc-support@cmb.ac.lk">erc-support@cmb.ac.lk</a>.</p>
  
  <p>
    Best regards,<br>
    The UoC ERC Admin Team<br>
    <em>University of Colombo</em>
  </p>
  
  <hr>
  <p style="font-size: 0.8em; color: #666;">
    This is an automated message from the UoC ERC System. Please do not reply to this email.
  </p>
</div>
      `
    });
    
    console.log('Test email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
}

testEmail();