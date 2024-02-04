import { OTP_Reason } from "../enums";
import { OTPModel } from "../models";
import { forgotPassword, verificationOTP } from "../templates";
import { generateOTP, sendEmail } from "../utils";

const sendOTP = async (
  email: string,
  reason: OTP_Reason.FORGOT_PASSWORD | OTP_Reason.VERIFY_EMAIL
) => {
  const otp = generateOTP();
  console.log("otp", otp);

  await OTPModel.destroy({ where: { email, reason } });

  const newOTP = await OTPModel.create({
    email,
    otp,
    reason,
  });

  let subject: string = "";
  let html: string = "";

  if (reason === OTP_Reason.VERIFY_EMAIL) {
    subject = "Verify your email.";
    html = verificationOTP(otp);
  } else {
    subject = "Forgot your password.";
    html = forgotPassword(otp);
  }
  // send email
  sendEmail({
    to: email,
    subject,
    html,
  });
};

export default sendOTP;
