import { body } from "express-validator";
import { UserModel } from "../models";
import { errorMessages } from "../constants";
import { User_Roles } from "../enums";
import { BadRequestError } from "../errors";

export const validateUserRegistration = () => {
  return [
    body("email")
      .isEmail()
      .toLowerCase()
      .trim()
      .withMessage(errorMessages.PROVIDE_EMAIL)
      .custom(async (email: string) => {
        const user = await UserModel.findOne({
          where: {
            email,
          },
        });
        if (user) {
          throw new BadRequestError(errorMessages.EMAIL_ALREADY_USED);
        }
      }),

    body("password")
      .isLength({ min: 8 })
      .withMessage(errorMessages.PASSWORD_ATLEAST_8_CHAR),

    body("firstName").isString().withMessage(errorMessages.PROVIDE_FIRST_NAME),

    body("lastName").isString().withMessage(errorMessages.PROVIDE_LAST_NAME),
  ];
};

export const validateEmail = () => {
  return [
    body("email")
      .isEmail()
      .toLowerCase()
      .trim()
      .withMessage(errorMessages.PROVIDE_EMAIL),
  ];
};

export const validateUserLogin = () => {
  return [
    body("email")
      .isEmail()
      .toLowerCase()
      .trim()
      .withMessage(errorMessages.PROVIDE_EMAIL),
    body("password")
      .not()
      .isEmpty()
      .withMessage(errorMessages.PROVIDE_PASSWORD),
  ];
};
