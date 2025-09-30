const nodemailer = require('nodemailer');
require('dotenv').config({ path: './config.env' });

// Test email configuration
async function testEmail() {
  console.log('🧪 Testing Email Configuration...\n');

  // Check environment variables
  console.log('📧 Email Configuration:');
  console.log(`   MAIL_USER: ${process.env.MAIL_USER ? '✅ Set' : '❌ Not set'}`);
  console.log(`   MAIL_PASS: ${process.env.MAIL_PASS ? '✅ Set' : '❌ Not set'}`);
  console.log(`   MAIL_HOST: ${process.env.MAIL_HOST || 'smtp.gmail.com'}`);
  console.log(`   MAIL_PORT: ${process.env.MAIL_PORT || '587'}\n`);

  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.log('❌ Email configuration incomplete. Please check your config.env file.');
    return;
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    console.log('🔗 Testing SMTP connection...');

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('📤 Sending test email...');
    
    const testEmail = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER, // Send to self for testing
      subject: 'Urban Issue Reporter - Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">🎉 Email Service Test Successful!</h2>
          <p>Hello!</p>
          <p>This is a test email from your Urban Issue Reporter application.</p>
          <p>If you received this email, your email configuration is working correctly!</p>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <ul>
              <li><strong>Service:</strong> Gmail SMTP</li>
              <li><strong>Host:</strong> smtp.gmail.com</li>
              <li><strong>Port:</strong> 587</li>
              <li><strong>User:</strong> ${process.env.MAIL_USER}</li>
            </ul>
          </div>
          
          <p>Best regards,<br>Urban Issue Reporter Team</p>
        </div>
      `
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   To: ${testEmail.to}`);
    console.log(`   Subject: ${testEmail.subject}\n`);

    console.log('🎉 Email service is fully functional!');
    console.log('   You can now use the email notifications in your application.');

  } catch (error) {
    console.log('❌ Email test failed:');
    console.log(`   Error: ${error.message}\n`);
    
    if (error.code === 'EAUTH') {
      console.log('💡 Common solutions:');
      console.log('   1. Check your Gmail app password');
      console.log('   2. Enable 2-Factor Authentication');
      console.log('   3. Generate a new app password');
      console.log('   4. Verify MAIL_USER and MAIL_PASS in config.env');
    } else if (error.code === 'ECONNECTION') {
      console.log('💡 Common solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify firewall settings');
      console.log('   3. Try using a different network');
    }
  }
}

// Run the test
testEmail().catch(console.error);
