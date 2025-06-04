export const VERIFICATION_EMAIL_TEMPLATE = `
<html lang="en">
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Mucodevde</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
        <tr>
          <td style="text-align: center;">
            <h1 style="color: #333333; margin-bottom: 10px;">Welcome to Mucodevde App!</h1>
            <p style="color: #555555; font-size: 16px; margin-bottom: 30px;">
              Thank you for verifying your email. We're excited to have you on board!
            </p>
            <p style="color: #555555; font-size: 16px;">
              You can now start exploring the full features of your account. If you have any questions or need help, feel free to reach out to our support team.
            </p>
            <a href="http://localhost:3000" target="_blank" style="display: inline-block; margin-top: 30px; padding: 12px 24px; background-color:rgb(17, 205, 26); color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Go to Dashboard
            </a>
            <a href="https://muhammadderic-portfolio.vercel.app" target="_blank" style="display: inline-block; margin-top: 30px; padding: 12px 24px; background-color:rgb(17, 205, 26); color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Go to Mucodevde Portfolio
            </a>
            <p style="color: #999999; font-size: 12px; margin-top: 40px;">
              If you didn’t sign up for this account, please ignore this email.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`