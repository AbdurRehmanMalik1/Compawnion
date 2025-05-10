import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import HttpExceptions from "../utility/exceptions/HttpExceptions";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    throw HttpExceptions.BadRequest(errorMessages.join(", "));
  }
  next();
};
