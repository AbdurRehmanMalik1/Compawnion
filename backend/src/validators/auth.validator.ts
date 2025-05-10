import { body } from "express-validator";
import { validateRequest } from "./validateRequest";
import { UserRole } from "../types";

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

const registerRoleValidator = [
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(UserRole))
    .withMessage("Invalid role"),

  body("roleData")
    .notEmpty()
    .withMessage("Role data is required")
    .custom((value, { req }) => {
      const role = req.body.role;

      if (role === UserRole.SHELTER) {
        if (!value.shelterName) {
          throw new Error("Shelter name is required");
        }
        if (!value.address) {
          throw new Error("Shelter address is required");
        }
        if (!value.location || !value.location.coordinates) {
          throw new Error("Shelter location is required");
        }
        if (value.location.coordinates.length !== 2) {
          throw new Error("Location must have longitude and latitude");
        }
        const [longitude, latitude] = value.location.coordinates;
        if (longitude < -180 || longitude > 180) {
          throw new Error("Longitude must be between -180 and 180");
        }
        if (latitude < -90 || latitude > 90) {
          throw new Error("Latitude must be between -90 and 90");
        }
      }

      // Add validation for other roles here
      // if (role === UserRole.ADOPTER) { ... }
      // if (role === UserRole.VETERINARIAN) { ... }

      return true;
    }),

  validateRequest,
];

export const authValidator = {
  signup: signupValidator,
  login: loginValidator,
  verifyOTP: verifyOTPValidator,
  registerRole: registerRoleValidator,
};
