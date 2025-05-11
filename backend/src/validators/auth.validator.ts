import { body } from "express-validator";
import { validateRequest } from "./validateRequest";
import { UserRole } from "../types";
import { DayOfWeek } from "../models/user/vet.data";

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

      if (role === UserRole.VETERINARIAN) {
        // Basic validation for required vet fields
        if (value.availability) {
          // Validate each availability slot if provided
          if (!Array.isArray(value.availability)) {
            throw new Error("Availability must be an array");
          }

          for (const slot of value.availability) {
            if (!slot.day) {
              throw new Error("Day is required for each availability slot");
            }
            if (!Object.values(DayOfWeek).includes(slot.day)) {
              throw new Error("Invalid day in availability slot");
            }

            if (!slot.startTime) {
              throw new Error(
                "Start time is required for each availability slot"
              );
            }
            if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(slot.startTime)) {
              throw new Error("Start time must be in 24-hour format (HH:MM)");
            }

            if (!slot.endTime) {
              throw new Error(
                "End time is required for each availability slot"
              );
            }
            if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(slot.endTime)) {
              throw new Error("End time must be in 24-hour format (HH:MM)");
            }

            // Validate that end time is after start time
            const startHour = parseInt(slot.startTime.split(":")[0]);
            const startMinute = parseInt(slot.startTime.split(":")[1]);
            const endHour = parseInt(slot.endTime.split(":")[0]);
            const endMinute = parseInt(slot.endTime.split(":")[1]);

            if (
              endHour < startHour ||
              (endHour === startHour && endMinute <= startMinute)
            ) {
              throw new Error("End time must be after start time");
            }
          }
        }

        // Validate location if provided
        if (value.location && value.location.coordinates) {
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

        // Validate consultation fee if provided
        if (value.consultationFee !== undefined && value.consultationFee < 0) {
          throw new Error("Consultation fee cannot be negative");
        }

        // Validate experience if provided
        if (value.experience !== undefined && value.experience < 0) {
          throw new Error("Experience years cannot be negative");
        }
      }

      // Add validation for other roles here
      // if (role === UserRole.ADOPTER) { ... }

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
