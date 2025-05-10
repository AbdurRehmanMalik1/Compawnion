import { body } from "express-validator";
import { validateRequest } from "./validateRequest";

const signupValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be between 3 and 30 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .withMessage("Please provide a valid email address"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),

  validateRequest,
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").trim().notEmpty().withMessage("Password is required"),

  validateRequest,
];

const verifyOTPValidator = [
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 characters long")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
  validateRequest,
];

export const authValidator = {
  signup: signupValidator,
  login: loginValidator,
  verifyOTP: verifyOTPValidator,
};
