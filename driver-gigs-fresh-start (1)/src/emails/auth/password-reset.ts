interface PasswordResetTemplateProps {
  user: {
    email: string;
    name?: string;
  };
  url: string;
  token: string;
}

export const passwordResetTemplate = ({ user, url, token }: PasswordResetTemplateProps) => {
  const userName = user.name || user.email.split('@')[0];
  
  return {
    subject: 'Reset your password - Driver Gigs',
    text: `Hi ${userName}, you requested to reset your password for your Driver Gigs account. Click the link to reset it: ${url}. This link will expire in 1 hour. If you didn't request this, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Driver Gigs</title>
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
            color: #dc3545;
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
          .reset-button {
            background-color: #dc3545;
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.2s;
          }
          .reset-button:hover {
            background-color: #c82333;
          }
          .fallback-link {
            color: #666;
            font-size: 14px;
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 4px;
            border-left: 4px solid #dc3545;
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
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            padding: 15px;
            margin-top: 20px;
            font-size: 14px;
          }
          .warning-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 15px;
            margin-bottom: 20px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚗 Driver Gigs</div>
          </div>
          
          <h1 class="title">Password Reset Request</h1>
          
          <div class="warning-box">
            <strong>⚠️ Security Alert:</strong> Someone requested a password reset for your Driver Gigs account. If this wasn't you, please ignore this email.
          </div>
          
          <div class="content">
            <p>Hi ${userName},</p>
            <p>You requested to reset your password for your Driver Gigs account. No worries, it happens to the best of us!</p>
            <p>Click the button below to create a new password:</p>
          </div>
          
          <div class="button-container">
            <a href="${url}" class="reset-button">Reset Password</a>
          </div>
          
          <div class="fallback-link">
            <strong>Button not working?</strong><br>
            Copy and paste this link into your browser:<br>
            <a href="${url}" style="color: #dc3545; word-break: break-all;">${url}</a>
          </div>
          
          <div class="security-note">
            <strong>🔒 Important Security Information:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This reset link will expire in <strong>1 hour</strong> for your security</li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>Your password will remain unchanged until you create a new one</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Best regards,<br>The Driver Gigs Team</p>
            <p>Need help? Contact us at support@drivergigs.com</p>
            <p style="margin-top: 20px; font-size: 11px; color: #999;">
              If you're having trouble with your account, please contact our support team immediately.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

export default passwordResetTemplate;
