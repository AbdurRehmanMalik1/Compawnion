import { Request, Response } from "express";
import AppointmentModel, {
  AppointmentStatus,
} from "../models/appointment.model";
import UserModel, { UserModelI } from "../models/user/user.model";
import { UserRole } from "../types";
import HttpExceptions from "../utility/exceptions/HttpExceptions";
import mongoose from "mongoose";
import { DayOfWeek, VetData } from "../models/user/vet.data";
import { AppointmentModelI } from "../models/appointment.model";

/**
 * Get all veterinarians with their details
 */
const getAllVeterinarians = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, specialization } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build query
  const query: any = { role: UserRole.VETERINARIAN };

  // Add search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { "roleData.clinicName": { $regex: search, $options: "i" } },
      { "roleData.bio": { $regex: search, $options: "i" } },
    ];
  }

  // Filter by specialization
  if (specialization) {
    query["roleData.specialization"] = { $in: [specialization] };
  }

  // Get veterinarians
  const veterinarians = await UserModel.find(query)
    .select("name email avatar role roleData")
    .skip(skip)
    .limit(limitNum)
    .sort({ "roleData.averageRating": -1 }); // Sort by rating

  const totalVets = await UserModel.countDocuments(query);

  res.status(200).json({
    message: "Veterinarians retrieved successfully",
    veterinarians,
    pagination: {
      total: totalVets,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(totalVets / limitNum),
    },
  });
};

/**
 * Get a specific veterinarian's details
 */
const getVeterinarianDetails = async (req: Request, res: Response) => {
  const { vetId } = req.params;

  const veterinarian = await UserModel.findOne({
    _id: vetId,
    role: UserRole.VETERINARIAN,
  }).select("name email avatar role roleData");

  if (!veterinarian) {
    throw HttpExceptions.NotFound("Veterinarian not found");
  }

  res.status(200).json({
    message: "Veterinarian details retrieved successfully",
    veterinarian,
  });
};

/**
 * Get a veterinarian's available slots for a specific date
 */
const getVeterinarianAvailability = async (req: Request, res: Response) => {
  const { vetId } = req.params;
  const { date } = req.query;

  if (!date) {
    throw HttpExceptions.BadRequest("Date is required");
  }

  // Validate date format
  const selectedDate = new Date(date as string);
  if (isNaN(selectedDate.getTime())) {
    throw HttpExceptions.BadRequest("Invalid date format");
  }

  // Get day of week
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayOfWeek = dayNames[selectedDate.getDay()] as DayOfWeek;

  // Find the veterinarian
  const veterinarian = await UserModel.findOne({
    _id: vetId,
    role: UserRole.VETERINARIAN,
  }).select("roleData.availability");

  if (!veterinarian) {
    throw HttpExceptions.NotFound("Veterinarian not found");
  }

  // Get the vet's availability for the selected day
  const dayAvailability =
    (veterinarian.roleData as VetData)?.availability?.filter(
      (slot) => slot.day === dayOfWeek && slot.isAvailable
    ) || [];

  if (dayAvailability.length === 0) {
    res.status(200).json({
      message: "No availability for the selected date",
      availableSlots: [],
    });
    return;
  }

  // Format date for query
  const dateStart = new Date(selectedDate);
  dateStart.setHours(0, 0, 0, 0);

  const dateEnd = new Date(selectedDate);
  dateEnd.setHours(23, 59, 59, 999);

  // Get existing appointments for that day
  const existingAppointments: AppointmentModelI[] = await AppointmentModel.find(
    {
      veterinarianId: vetId,
      date: { $gte: dateStart, $lte: dateEnd },
      status: { $in: [AppointmentStatus.SCHEDULED, AppointmentStatus.PENDING] },
    }
  ).select("startTime endTime");

  // Generate available time slots (30-minute intervals)
  const availableSlots: { startTime: string; endTime: string }[] = [];

  dayAvailability.forEach((slot) => {
    const [startHour, startMinute] = slot.startTime.split(":").map(Number);
    const [endHour, endMinute] = slot.endTime.split(":").map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    // Generate 30-minute slots
    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const slotStartTime = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

      // Calculate end time (30 minutes later)
      let slotEndHour = currentHour;
      let slotEndMinute = currentMinute + 30;

      if (slotEndMinute >= 60) {
        slotEndHour += 1;
        slotEndMinute -= 60;
      }

      // Skip if this would exceed the vet's availability
      if (
        slotEndHour > endHour ||
        (slotEndHour === endHour && slotEndMinute > endMinute)
      ) {
        break;
      }

      const slotEndTime = `${slotEndHour
        .toString()
        .padStart(2, "0")}:${slotEndMinute.toString().padStart(2, "0")}`;

      // Check if slot conflicts with existing appointments
      const isSlotAvailable = !existingAppointments.some((appointment) => {
        const [apptStartHour, apptStartMinute] = appointment.startTime
          .split(":")
          .map(Number);
        const [apptEndHour, apptEndMinute] = appointment.endTime
          .split(":")
          .map(Number);

        // Check for overlap
        if (
          (currentHour < apptEndHour ||
            (currentHour === apptEndHour && currentMinute < apptEndMinute)) &&
          (slotEndHour > apptStartHour ||
            (slotEndHour === apptStartHour && slotEndMinute > apptStartMinute))
        ) {
          return true; // Overlap exists
        }
        return false;
      });

      if (isSlotAvailable) {
        availableSlots.push({
          startTime: slotStartTime,
          endTime: slotEndTime,
        });
      }

      // Move to next slot
      if (currentMinute === 30) {
        currentHour += 1;
        currentMinute = 0;
      } else {
        currentMinute = 30;
      }
    }
  });

  res.status(200).json({
    message: "Available slots retrieved successfully",
    date: selectedDate.toISOString().split("T")[0],
    dayOfWeek,
    availableSlots,
  });
};

/**
 * Book an appointment with a veterinarian
 */
const bookAppointment = async (req: Request, res: Response) => {
  const currentUser = req.user as UserModelI;
  const { vetId, date, startTime, endTime, reason, petId, notes } = req.body;

  // Validate veterinarian exists
  const veterinarian = await UserModel.findOne({
    _id: vetId,
    role: UserRole.VETERINARIAN,
  });

  if (!veterinarian) {
    throw HttpExceptions.NotFound("Veterinarian not found");
  }

  // Validate date and time
  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime())) {
    throw HttpExceptions.BadRequest("Invalid date format");
  }

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appointmentDate < today) {
    throw HttpExceptions.BadRequest("Cannot book appointments in the past");
  }

  // Get day of week
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayOfWeek = dayNames[appointmentDate.getDay()] as DayOfWeek;

  // Check if vet is available on this day and time
  const dayAvailability = (
    veterinarian.roleData as VetData
  )?.availability?.find((slot) => slot.day === dayOfWeek && slot.isAvailable);

  if (!dayAvailability) {
    throw HttpExceptions.BadRequest(
      "Veterinarian is not available on this day"
    );
  }

  // Check if requested time is within vet's availability
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const [vetStartHour, vetStartMinute] = dayAvailability.startTime
    .split(":")
    .map(Number);
  const [vetEndHour, vetEndMinute] = dayAvailability.endTime
    .split(":")
    .map(Number);

  const requestStart = new Date(0, 0, 0, startHour, startMinute);
  const requestEnd = new Date(0, 0, 0, endHour, endMinute);
  const vetStart = new Date(0, 0, 0, vetStartHour, vetStartMinute);
  const vetEnd = new Date(0, 0, 0, vetEndHour, vetEndMinute);

  if (requestStart < vetStart || requestEnd > vetEnd) {
    throw HttpExceptions.BadRequest(
      "Requested time is outside veterinarian's availability"
    );
  }

  // Check if slot is already booked
  const existingAppointment = await AppointmentModel.findOne({
    veterinarianId: vetId,
    date: {
      $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
      $lte: new Date(appointmentDate.setHours(23, 59, 59, 999)),
    },
    $or: [
      // Check if there's any overlap
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      },
    ],
    status: { $in: [AppointmentStatus.SCHEDULED, AppointmentStatus.PENDING] },
  });

  if (existingAppointment) {
    throw HttpExceptions.BadRequest("This time slot is already booked");
  }

  // Create the appointment
  const appointment = await AppointmentModel.create({
    userId: currentUser._id,
    veterinarianId: vetId,
    date: appointmentDate,
    startTime,
    endTime,
    reason,
    petId: petId || undefined,
    notes: notes || undefined,
    status: AppointmentStatus.PENDING,
  });

  res.status(201).json({
    message: "Appointment booked successfully",
    appointment,
  });
};

/**
 * Get all appointments for the current user
 */
const getUserAppointments = async (req: Request, res: Response) => {
  const currentUser = req.user as UserModelI;
  const { status, upcoming } = req.query;

  // Build query
  const query: any = { userId: currentUser._id };

  // Filter by status if provided
  if (
    status &&
    Object.values(AppointmentStatus).includes(status as AppointmentStatus)
  ) {
    query.status = status;
  }

  // Filter for upcoming appointments
  if (upcoming === "true") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query.date = { $gte: today };
  }

  // Get appointments
  const appointments = await AppointmentModel.find(query)
    .sort({ date: 1, startTime: 1 }) // Sort by date and time
    .populate({
      path: "veterinarianId",
      select: "name avatar roleData.clinicName roleData.specialization",
    })
    .populate({
      path: "petId",
      select: "name species breed avatar",
    });

  res.status(200).json({
    message: "User appointments retrieved successfully",
    appointments,
  });
};

/**
 * Get all appointments for a veterinarian
 */
const getVeterinarianAppointments = async (req: Request, res: Response) => {
  const currentUser = req.user as UserModelI;

  // Ensure the user is a veterinarian
  if (currentUser.role !== UserRole.VETERINARIAN) {
    throw HttpExceptions.Forbidden(
      "Only veterinarians can access this endpoint"
    );
  }

  const { status, date } = req.query;

  // Build query
  const query: any = { veterinarianId: currentUser._id };

  // Filter by status if provided
  if (
    status &&
    Object.values(AppointmentStatus).includes(status as AppointmentStatus)
  ) {
    query.status = status;
  }

  // Filter by specific date
  if (date) {
    const selectedDate = new Date(date as string);
    if (!isNaN(selectedDate.getTime())) {
      const dateStart = new Date(selectedDate);
      dateStart.setHours(0, 0, 0, 0);

      const dateEnd = new Date(selectedDate);
      dateEnd.setHours(23, 59, 59, 999);

      query.date = { $gte: dateStart, $lte: dateEnd };
    }
  }

  // Get appointments
  const appointments = await AppointmentModel.find(query)
    .sort({ date: 1, startTime: 1 }) // Sort by date and time
    .populate({
      path: "userId",
      select: "name email avatar",
    })
    .populate({
      path: "petId",
      select: "name species breed avatar",
    });

  res.status(200).json({
    message: "Veterinarian appointments retrieved successfully",
    appointments,
  });
};

/**
 * Update appointment status (for veterinarians)
 */
const updateAppointmentStatus = async (req: Request, res: Response) => {
  const currentUser = req.user as UserModelI;
  const { appointmentId } = req.params;
  const { status, notes } = req.body;

  // Find the appointment
  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    throw HttpExceptions.NotFound("Appointment not found");
  }

  // Check permissions
  if (
    currentUser.role === UserRole.VETERINARIAN &&
    appointment.veterinarianId.toString() !== currentUser._id.toString()
  ) {
    throw HttpExceptions.Forbidden("You can only update your own appointments");
  }

  // Validate status
  if (!Object.values(AppointmentStatus).includes(status as AppointmentStatus)) {
    throw HttpExceptions.BadRequest("Invalid appointment status");
  }

  // Update appointment
  appointment.status = status as AppointmentStatus;

  // Update notes if provided
  if (notes) {
    appointment.notes = notes;
  }

  await appointment.save();

  res.status(200).json({
    message: "Appointment status updated successfully",
    appointment,
  });
};

/**
 * Cancel an appointment (for users)
 */
const cancelAppointment = async (req: Request, res: Response) => {
  const currentUser = req.user as UserModelI;
  const { appointmentId } = req.params;

  // Find the appointment
  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    throw HttpExceptions.NotFound("Appointment not found");
  }

  // Check if this is the user's appointment
  if (appointment.userId.toString() !== currentUser._id.toString()) {
    throw HttpExceptions.Forbidden("You can only cancel your own appointments");
  }

  // Check if appointment can be cancelled (not already completed)
  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw HttpExceptions.BadRequest("Cannot cancel a completed appointment");
  }

  // Update status to cancelled
  appointment.status = AppointmentStatus.CANCELLED;
  await appointment.save();

  res.status(200).json({
    message: "Appointment cancelled successfully",
    appointment,
  });
};

/**
 * Get a specific appointment by ID
 */
const getAppointmentById = async (req: Request, res: Response) => {
  const currentUser = req.user as UserModelI;
  const { appointmentId } = req.params;

  // Find the appointment
  const appointment = await AppointmentModel.findById(appointmentId)
    .populate({
      path: "veterinarianId",
      select: "name avatar roleData.clinicName roleData.specialization",
    })
    .populate({
      path: "userId",
      select: "name email avatar",
    })
    .populate({
      path: "petId",
      select: "name species breed avatar",
    });

  if (!appointment) {
    throw HttpExceptions.NotFound("Appointment not found");
  }

  // Check permissions
  const isVet =
    currentUser.role === UserRole.VETERINARIAN &&
    appointment.veterinarianId._id.toString() === currentUser._id.toString();
  const isUser =
    appointment.userId._id.toString() === currentUser._id.toString();

  if (!isVet && !isUser) {
    throw HttpExceptions.Forbidden(
      "You don't have permission to view this appointment"
    );
  }

  res.status(200).json({
    message: "Appointment retrieved successfully",
    appointment,
  });
};

export const appointmentController = {
  getAllVeterinarians,
  getVeterinarianDetails,
  getVeterinarianAvailability,
  bookAppointment,
  getUserAppointments,
  getVeterinarianAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentById,
};
