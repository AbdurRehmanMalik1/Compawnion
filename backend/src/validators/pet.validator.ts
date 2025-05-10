import { body } from "express-validator";
import { validateRequest } from "./validateRequest";
import {
  PetSpecies,
  PetGender,
  PetSize,
  AgeUnit,
  AdoptionStatus,
} from "../types/pet.types";

const addPetValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("species")
    .trim()
    .notEmpty()
    .withMessage("Species is required")
    .isIn(Object.values(PetSpecies))
    .withMessage("Invalid species"),

  body("breed")
    .trim()
    .notEmpty()
    .withMessage("Breed is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Breed must be between 2 and 50 characters"),

  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isObject()
    .withMessage("Age must be an object"),

  body("age.value")
    .notEmpty()
    .withMessage("Age value is required")
    .isFloat({ min: 0 })
    .withMessage("Age value must be a positive number"),

  body("age.unit")
    .notEmpty()
    .withMessage("Age unit is required")
    .isIn(Object.values(AgeUnit))
    .withMessage("Invalid age unit"),

  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(Object.values(PetGender))
    .withMessage("Invalid gender"),

  body("size")
    .optional()
    .isIn(Object.values(PetSize))
    .withMessage("Invalid size"),

  body("color")
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Color must be between 2 and 30 characters"),

  body("images")
    .isArray()
    .withMessage("Images must be an array")
    .notEmpty()
    .withMessage("At least one image is required"),

  body("images.*").isURL().withMessage("Each image must be a valid URL"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("adoptionStatus")
    .optional()
    .isIn(Object.values(AdoptionStatus))
    .withMessage("Invalid adoption status"),

  body("adoptionFee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Adoption fee must be a positive number"),

  body("healthDetails")
    .notEmpty()
    .withMessage("Health details are required")
    .isObject()
    .withMessage("Health details must be an object"),

  body("healthDetails.isVaccinated")
    .isBoolean()
    .withMessage("Vaccination status must be a boolean"),

  body("healthDetails.isNeutered")
    .isBoolean()
    .withMessage("Neutering status must be a boolean"),

  body("healthDetails.medicalHistory")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Medical history must be between 10 and 1000 characters"),

  validateRequest,
];

export const petValidator = {
  addPet: addPetValidator,
};
