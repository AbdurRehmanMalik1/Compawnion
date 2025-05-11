import mongoose, { Document } from "mongoose";

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  PENDING = "pending",
}

export interface AppointmentModelI extends Document {
  petId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  veterinarianId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string; // Format: "HH:MM" in 24-hour format
  endTime: string; // Format: "HH:MM" in 24-hour format
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      // Optional, if appointment is for a specific pet
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    veterinarianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Veterinarian ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      validate: {
        validator: function (v: string) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Validate HH:MM format
        },
        message: "Start time must be in 24-hour format (HH:MM)",
      },
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      validate: {
        validator: function (v: string) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Validate HH:MM format
        },
        message: "End time must be in 24-hour format (HH:MM)",
      },
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING,
    },
    reason: {
      type: String,
      required: [true, "Reason for appointment is required"],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create compound index for veterinarian, date and time to ensure no double bookings
appointmentSchema.index(
  { veterinarianId: 1, date: 1, startTime: 1 },
  { unique: true }
);

// Create index for user to quickly find user's appointments
appointmentSchema.index({ userId: 1, date: 1 });

// Validate that end time is after start time
appointmentSchema.pre("validate", function (next) {
  const appointment = this as AppointmentModelI;

  if (appointment.startTime && appointment.endTime) {
    const [startHour, startMinute] = appointment.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = appointment.endTime.split(":").map(Number);

    const startDateTime = new Date(0, 0, 0, startHour, startMinute);
    const endDateTime = new Date(0, 0, 0, endHour, endMinute);

    if (endDateTime <= startDateTime) {
      this.invalidate("endTime", "End time must be after start time");
    }
  }

  next();
});

const AppointmentModel = mongoose.model<AppointmentModelI>(
  "Appointment",
  appointmentSchema
);

export default AppointmentModel;
