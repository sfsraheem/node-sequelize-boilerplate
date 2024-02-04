import { RequestHandler } from "express";
import { validationResult } from "express-validator";

const checkValidations: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0]?.msg });
  }
  next();
};


export default checkValidations