import { Router } from "express";
import authRouter from "./auth.routes";
import petRouter from "./pet.routes";
import messageRouter from "./message.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/pets", petRouter);
router.use("/messages", messageRouter);

export default router;
