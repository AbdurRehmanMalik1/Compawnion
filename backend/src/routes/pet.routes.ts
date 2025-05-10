import { Router } from "express";
import { petValidator } from "../validators/pet.validator";
import { petController } from "../controllers/pet.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../types";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.SHELTER]),
  petValidator.addPet,
  petController.addPet
);

router.get(
  "/shelter",
  authMiddleware,
  roleMiddleware([UserRole.SHELTER]),
  petController.getShelterPets
);

export default router;
