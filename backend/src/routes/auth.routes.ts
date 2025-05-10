import { Router } from "express";
import { authValidator } from "../validators/auth.validator";
import { authController } from "../controllers/auth.controller";
import "../docs/auth.swagger";
import { authMiddlewareForVerification } from "../middlewares/auth.middleware";
const router = Router();

router.post("/signup", authValidator.signup, authController.signup);
router.post(
  "/verify",
  authMiddlewareForVerification,
  authValidator.verifyOTP,
  authController.verifyOTP
);
router.post(
  "/resend-verification",
  authMiddlewareForVerification,
  authController.resendVerification
);
// router.post("/login", authValidator.login, authController.login);

export default router;
