import { Router } from "express";
import { authValidator } from "../validators/auth.validator";
import { authController } from "../controllers/auth.controller";
import "../docs/auth.swagger";

const router = Router();

router.post("/signup", authValidator.signup, authController.signup);
router.post("/verify", authValidator.verifyOTP, authController.verifyOTP);
router.post(
  "/resend-verification",
  authValidator.resendVerification,
  authController.resendVerification
);
// router.post("/login", authValidator.login, authController.login);

export default router;
