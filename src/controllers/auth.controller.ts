import { RequestHandler } from "express";
import { OTPModel, UserModel } from "../models";
import { sendOTP, verifyGoogleToken } from "../helpers";
import { Auth_Provider, OTP_Reason } from "../enums";
import { StatusCodes } from "http-status-codes";
import { errorMessages, responseMessages } from "../constants";
import { BadRequestError } from "../errors";
import { config } from "../configs";
import { sign, verify } from "jsonwebtoken";

export const registerUser: RequestHandler = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const user = await UserModel.create({
    email,
    password,
    firstName,
    lastName,
  });

  await sendOTP(email, OTP_Reason.VERIFY_EMAIL);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: responseMessages.USER_CREATED_SUCCESSFULLY,
    data: {
      email: user.email,
    },
  });
};

export const resendOTP: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ where: { email } });
  if (!user) {
    throw new BadRequestError(errorMessages.NO_USER_EXIST_WITH_EMAIL);
  }

  await sendOTP(user.email, OTP_Reason.VERIFY_EMAIL);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: responseMessages.OTP_SENT_SUCCESSFULLY,
    data: {
      email: user.email,
    },
  });
};

export const verifyEmail: RequestHandler = async (req, res) => {
  const { email, otp } = req.body;
  if (!otp) {
    throw new BadRequestError(errorMessages.OTP_REQUIRED);
  }

  const user = await UserModel.findOne({ where: { email } });
  if (!user) {
    throw new BadRequestError(errorMessages.NO_USER_EXIST_WITH_EMAIL);
  }

  const findOtp = await OTPModel.findOne({
    where: { email, reason: OTP_Reason.VERIFY_EMAIL },
  });
  if (!findOtp) {
    throw new BadRequestError(errorMessages.OTP_EXPIRED);
  }

  const isOTPValid = await findOtp.campareOtp(otp);
  if (!isOTPValid) {
    throw new BadRequestError(errorMessages.INVALID_OTP);
  }

  user.verified = true;
  await user.save();

  const token = await user.createJWT();
  const userJson = user.toJSON();
  delete userJson.password;
  return res.status(StatusCodes.OK).json({
    success: true,
    message: responseMessages.VERIFIED_SUCCESSFULLY,
    data: {
      token,
      user: userJson,
    },
  });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ where: { email } });
  if (!user) {
    throw new BadRequestError(errorMessages.NO_USER_EXIST_WITH_EMAIL);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new BadRequestError(errorMessages.INVALID_CREDENTIAL);
  }

  if (!user.verified) {
    await sendOTP(user.email, OTP_Reason.VERIFY_EMAIL);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: errorMessages.ACCOUNT_NOT_VERIFIED,
      verified: false,
    });
  }
  const token = await user.createJWT();
  const userJson = user.toJSON();
  delete userJson.password;
  return res.status(StatusCodes.OK).json({
    success: true,
    data: {
      token,
      user: userJson,
    },
  });
};

export const forgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ where: { email } });
  if (!user) {
    throw new BadRequestError(errorMessages.NO_USER_EXIST_WITH_EMAIL);
  }

  await sendOTP(user.email, OTP_Reason.FORGOT_PASSWORD);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: responseMessages.OTP_SENT_SUCCESSFULLY,
    data: {
      email: user.email,
    },
  });
};

export const verifyForgotPassword: RequestHandler = async (req, res) => {
  const { email, otp } = req.body;

  if (!otp) {
    throw new BadRequestError(errorMessages.OTP_REQUIRED);
  }

  const user = await UserModel.findOne({ where: { email } });
  if (!user) {
    throw new BadRequestError(errorMessages.NO_USER_EXIST_WITH_EMAIL);
  }

  const otpDoc = await OTPModel.findOne({
    where: { email, reason: OTP_Reason.FORGOT_PASSWORD },
  });

  if (!otpDoc) {
    throw new BadRequestError(errorMessages.OTP_EXPIRED);
  }
  const isOTPValid = await otpDoc.campareOtp(otp);
  if (!isOTPValid) {
    throw new BadRequestError(errorMessages.INVALID_OTP);
  }

  const token = await sign({ email }, config.FORGOT_PASSWORD_JWT_SECRET, {
    expiresIn: config.FORGOT_PASSWORD_JWT_LIFETIME,
  });

  return res.status(StatusCodes.OK).json({
    success: true,
    data: {
      token,
    },
  });
};

export const resetPassword: RequestHandler = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      throw new BadRequestError(errorMessages.SESSION_EXPIRED);
    }

    const payload = (await verify(
      token,
      config.FORGOT_PASSWORD_JWT_SECRET
    )) as {
      email: string;
    };

    const { email } = payload;

    const { password } = req.body;

    if (!password) {
      throw new BadRequestError(errorMessages.PROVIDE_NEW_PASSWORD);
    }

    const user = await UserModel.findOne({ where: { email } });

    user.password = password;

    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: errorMessages.RESET_SUCCESSFULLY });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const socialLogin: RequestHandler = async (req, res) => {
  const { token, provider } = req.body;

  if (!token) {
    throw new BadRequestError(errorMessages.PROVIDE_AUTH_TOKEN);
  }
  let payload;
  switch (provider) {
    case Auth_Provider.GOOGLE:
      payload = await verifyGoogleToken(token);
      break;
    // case Auth_Provider.FACEBOOK:
    //   break;
    default:
      throw new BadRequestError(errorMessages.INVALID_AUTH_PROVIDER);
  }

  let user = await UserModel.findOne({ where: { email: payload.email } });
  if (!user) {
    user = await UserModel.create({
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      password: payload.password,
    });
  }
  const jwt = await user.createJWT();
  const userJson = user.toJSON();
  delete userJson.password;
  return res.status(StatusCodes.OK).json({
    success: true,
    data: {
      token: jwt,
      user: userJson,
    },
  });
};
