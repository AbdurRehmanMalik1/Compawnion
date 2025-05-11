import { body, param, query } from "express-validator";
import { validateRequest } from "./validateRequest";
import { AppointmentStatus } from "../models/appointment.model";
import mongoose from "mongoose";

const getAllVeterinarians = [
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
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string")
    .trim(),
  query("specialization")
    .optional()
    .isString()
    .withMessage("Specialization must be a string")
    .trim(),
  validateRequest,
];

const getVeterinarianDetails = [
  param("vetId")
    .notEmpty()
    .withMessage("Veterinarian ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid veterinarian ID format");
      }
      return true;
    }),
  validateRequest,
];

const getVeterinarianAvailability = [
  param("vetId")
    .notEmpty()
    .withMessage("Veterinarian ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid veterinarian ID format");
      }
      return true;
    }),
  query("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be in ISO format (YYYY-MM-DD)"),
  validateRequest,
];

const bookAppointment = [
  body("vetId")
    .notEmpty()
    .withMessage("Veterinarian ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid veterinarian ID format");
      }
      return true;
    }),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be in ISO format (YYYY-MM-DD)"),
  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Start time must be in 24-hour format (HH:MM)"),
  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("End time must be in 24-hour format (HH:MM)"),
  body("reason")
    .notEmpty()
    .withMessage("Reason is required")
    .isString()
    .withMessage("Reason must be a string")
    .trim(),
  body("petId")
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid pet ID format");
      }
      return true;
    }),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .trim(),
  validateRequest,
];

const getUserAppointments = [
  query("status")
    .optional()
    .isIn(Object.values(AppointmentStatus))
    .withMessage("Invalid status"),
  query("upcoming")
    .optional()
    .isBoolean()
    .withMessage("Upcoming must be a boolean")
    .toBoolean(),
  validateRequest,
];

const getVeterinarianAppointments = [
  query("status")
    .optional()
    .isIn(Object.values(AppointmentStatus))
    .withMessage("Invalid status"),
  query("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be in ISO format (YYYY-MM-DD)"),
  validateRequest,
];

const appointmentId = [
  param("appointmentId")
    .notEmpty()
    .withMessage("Appointment ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid appointment ID format");
      }
      return true;
    }),
  validateRequest,
];

const updateAppointmentStatus = [
  param("appointmentId")
    .notEmpty()
    .withMessage("Appointment ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid appointment ID format");
      }
      return true;
    }),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(Object.values(AppointmentStatus))
    .withMessage("Invalid status"),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .trim(),
  validateRequest,
];

export const appointmentValidator = {
  getAllVeterinarians,
  getVeterinarianDetails,
  getVeterinarianAvailability,
  bookAppointment,
  getUserAppointments,
  getVeterinarianAppointments,
  appointmentId,
  updateAppointmentStatus,
};
