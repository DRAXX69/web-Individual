const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Welcome to VIP Motors - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">VIP MOTORS</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Hypercars Showcase</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to VIP Motors, ${data.name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for joining the elite hypercar community. To complete your registration and access our exclusive collection, please verify your email address.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" 
               style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block; 
                      font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 25px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${data.verificationUrl}" style="color: #1e3c72;">${data.verificationUrl}</a>
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This link will expire in 24 hours. If you didn't create an account with VIP Motors, please ignore this email.
            </p>
          </div>
        </div>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'VIP Motors - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">VIP MOTORS</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${data.name},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            We received a request to reset your password for your VIP Motors account. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" 
               style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block; 
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 25px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${data.resetUrl}" style="color: #1e3c72;">${data.resetUrl}</a>
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 25px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Security Notice:</strong> This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              For security reasons, this link can only be used once. If you need to reset your password again, please request a new reset link.
            </p>
          </div>
        </div>
      </div>
    `
  }),

  welcomeEmail: (data) => ({
    subject: 'Welcome to VIP Motors - Your Account is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">VIP MOTORS</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome to the Elite</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to VIP Motors, ${data.name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Congratulations! Your account has been successfully verified and you now have access to our exclusive hypercar collection. Get ready to explore the world's most prestigious and powerful vehicles.
          </p>
          
          <div style="background: #e8f5e8; border: 1px solid #c3e6c3; padding: 20px; border-radius: 5px; margin: 25px 0;">
            <h3 style="color: #155724; margin-top: 0;">What's Next?</h3>
            <ul style="color: #155724; padding-left: 20px;">
              <li>Browse our exclusive hypercar collection</li>
              <li>Add your favorite cars to your wishlist</li>
              <li>Compare specifications and performance</li>
              <li>Stay updated with the latest additions</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block; 
                      font-weight: bold;">
              Explore Collection
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Thank you for choosing VIP Motors. We're excited to have you as part of our exclusive community.
            </p>
          </div>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text || emailContent.html.replace(/<[^>]*>/g, '')
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  testEmailConfig,
  emailTemplates
}; 