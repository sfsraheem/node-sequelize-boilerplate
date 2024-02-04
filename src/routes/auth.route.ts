import express from "express";
import { userValidations } from "../validations";
import {
  forgotPassword,
  login,
  registerUser,
  resendOTP,
  resetPassword,
  socialLogin,
  verifyEmail,
  verifyForgotPassword,
} from "../controllers/auth.controller";
import { checkValidations } from "../middlewares";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  userValidations.validateUserRegistration(),
  checkValidations,
  registerUser
);

authRouter.post(
  "/verifyEmail",
  userValidations.validateEmail(),
  checkValidations,
  verifyEmail
);

authRouter.post(
  "/resendOTP",
  userValidations.validateEmail(),
  checkValidations,
  resendOTP
);

authRouter.post(
  "/login",
  userValidations.validateUserLogin(),
  checkValidations,
  login
);

authRouter.post(
  "/forgotPassword",
  userValidations.validateEmail(),
  checkValidations,
  forgotPassword
);

authRouter.post(
  "/verifyForgotPassword",
  userValidations.validateEmail(),
  checkValidations,
  verifyForgotPassword
);

authRouter.post(
  "/resetPassword",
  userValidations.validateEmail(),
  resetPassword
);

authRouter.post(
  "/socialLogin",
  socialLogin
);

export default authRouter;
