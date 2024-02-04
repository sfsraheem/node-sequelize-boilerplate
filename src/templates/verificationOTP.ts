const verificationOTP = (otp: string) => {
  return `
      <!DOCTYPE html>
  <html>
  <head>
    <title>Ecommerce Email Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; padding: 20px;">
    <h1>Welcome to Ecommerce!</h1>
    <p>Thank you for signing up with Ecommerce. To complete your registration, please use the following One-Time Password (OTP) for email verification:</p>
    <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</p>
    <p>Please enter this OTP in the verification section of the Ecommerce app to activate your account.</p>
    <p>If you did not sign up for an Ecommerce account, you can safely ignore this email.</p>
    <p>Thank you,<br>Ecommerce Team</p>
  </body>
  </html>
  `;
};

export default verificationOTP;
