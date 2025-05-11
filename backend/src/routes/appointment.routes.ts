import { Router } from "express";
import { appointmentController } from "../controllers/appointment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { appointmentValidator } from "../validators/appointment.validator";

const router = Router();

// All appointment routes require authentication
router.use(authMiddleware);

// Veterinarian routes
router.get(
  "/veterinarians",
  appointmentValidator.getAllVeterinarians,
  appointmentController.getAllVeterinarians
);

router.get(
  "/veterinarians/:vetId",
  appointmentValidator.getVeterinarianDetails,
  appointmentController.getVeterinarianDetails
);

router.get(
  "/veterinarians/:vetId/availability",
  appointmentValidator.getVeterinarianAvailability,
  appointmentController.getVeterinarianAvailability
);

// Appointment booking
router.post(
  "/appointments",
  appointmentValidator.bookAppointment,
  appointmentController.bookAppointment
);

// User appointments
router.get(
  "/user/appointments",
  appointmentValidator.getUserAppointments,
  appointmentController.getUserAppointments
);

// Veterinarian appointments
router.get(
  "/vet/appointments",
  appointmentValidator.getVeterinarianAppointments,
  appointmentController.getVeterinarianAppointments
);

// Get specific appointment
router.get(
  "/appointments/:appointmentId",
  appointmentValidator.appointmentId,
  appointmentController.getAppointmentById
);

// Update appointment status (for vets)
router.patch(
  "/appointments/:appointmentId/status",
  appointmentValidator.updateAppointmentStatus,
  appointmentController.updateAppointmentStatus
);

// Cancel appointment (for users)
router.patch(
  "/appointments/:appointmentId/cancel",
  appointmentValidator.appointmentId,
  appointmentController.cancelAppointment
);

export default router;
