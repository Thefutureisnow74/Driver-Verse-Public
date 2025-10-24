interface EmailVerificationTemplateProps {
  user: {
    email: string;
    name?: string;
  };
  url: string;
  token: string;
}

export const emailVerificationTemplate = ({ user, url, token }: EmailVerificationTemplateProps) => {
  const userName = user.name || user.email.split('@')[0];
  
  return {
    subject: 'Verify your email address - Driver Gigs',
    text: `Welcome to Driver Gigs, ${userName}! Please click the link to verify your email address: ${url}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Driver Gigs</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
          }
          .title {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
          }
          .content {
            margin-bottom: 30px;
          }
          .button-container {
            text-align: center;
            margin: 40px 0;
          }
          .verify-button {
            background-color: #007bff;
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.2s;
          }
          .verify-button:hover {
            background-color: #0056b3;
          }
          .fallback-link {
            color: #666;
            font-size: 14px;
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 4px;
            border-left: 4px solid #007bff;
          }
          .footer {
            color: #666;
            font-size: 12px;
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          .security-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 15px;
            margin-top: 20px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚗 Driver Gigs</div>
          </div>
          
          <h1 class="title">Welcome to Driver Gigs!</h1>
          
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for signing up for Driver Gigs! We're excited to have you join our community of drivers.</p>
            <p>To complete your registration and start exploring driving opportunities, please verify your email address by clicking the button below:</p>
          </div>
          
          <div class="button-container">
            <a href="${url}" class="verify-button">Verify Email Address</a>
          </div>
          
          <div class="fallback-link">
            <strong>Button not working?</strong><br>
            Copy and paste this link into your browser:<br>
            <a href="${url}" style="color: #007bff; word-break: break-all;">${url}</a>
          </div>
          
          <div class="security-note">
            <strong>🔒 Security Note:</strong> This verification link will expire in 24 hours for your security. If you didn't create an account with Driver Gigs, you can safely ignore this email.
          </div>
          
          <div class="footer">
            <p>Best regards,<br>The Driver Gigs Team</p>
            <p>Need help? Contact us at support@drivergigs.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

export default emailVerificationTemplate;
