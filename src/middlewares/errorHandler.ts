import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { ValidationError, UniqueConstraintError, DatabaseError } from "sequelize";
import { CustomAPIError } from "../errors";

const errorHandler = (
  err: CustomAPIError, 
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log('err', err)
  let customError: {
    statusCode: number;
    msg: string | string[];
  } = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later",
  };

  // Handling Sequelize Validation Error
  if (err instanceof ValidationError) {
    customError.msg = err.errors.map((e) => e.message)[0];
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handling Sequelize Unique Constraint Error
  if (err instanceof UniqueConstraintError) {
    customError.msg = `Duplicate field value entered for ${Object.keys(err.fields).join(', ')}.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handling Sequelize Database Error
  if (err instanceof DatabaseError) {
    customError.msg = "Database error. Please try again later.";
    customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  // Add other Sequelize error types as needed

  return res
    .status(customError.statusCode)
    .json({ success: false, message: customError.msg });
};

export default errorHandler;
