import { body, param, query } from "express-validator";
import { validateRequest } from "./validateRequest";
import mongoose from "mongoose";

const submitReview = [
  body("appointmentId")
    .notEmpty()
    .withMessage("Appointment ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid appointment ID format");
      }
      return true;
    }),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .notEmpty()
    .withMessage("Comment is required")
    .isString()
    .withMessage("Comment must be a string")
    .trim(),
  validateRequest,
];

const getVeterinarianReviews = [
  param("vetId")
    .notEmpty()
    .withMessage("Veterinarian ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid veterinarian ID format");
      }
      return true;
    }),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50")
    .toInt(),
  validateRequest,
];

const getReviewById = [
  param("vetId")
    .notEmpty()
    .withMessage("Veterinarian ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid veterinarian ID format");
      }
      return true;
    }),
  param("reviewId")
    .notEmpty()
    .withMessage("Review ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid review ID format");
      }
      return true;
    }),
  validateRequest,
];

const deleteReview = [
  param("vetId")
    .notEmpty()
    .withMessage("Veterinarian ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid veterinarian ID format");
      }
      return true;
    }),
  param("reviewId")
    .notEmpty()
    .withMessage("Review ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid review ID format");
      }
      return true;
    }),
  validateRequest,
];

export const reviewValidator = {
  submitReview,
  getVeterinarianReviews,
  getReviewById,
  deleteReview,
};
