import { Router } from "express";
import authRouter from "./auth.routes";
import petRouter from "./pet.routes";
import messageRouter from "./message.routes";
import appointmentRouter from "./appointment.routes";
import reviewRouter from "./review.router";
import forumRouter from "./forum.routes";
const router = Router();

router.use("/auth", authRouter);
router.use("/pets", petRouter);
router.use("/messages", messageRouter);
router.use("/appointments", appointmentRouter);
router.use("/appointments", reviewRouter);
router.use("/forum", forumRouter);

export default router;
