import { Router } from "express";
import authRouter from "./auth.routes";
import petRouter from "./pet.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/pets", petRouter);

export default router;
