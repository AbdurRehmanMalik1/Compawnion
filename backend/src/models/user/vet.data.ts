import mongoose from "mongoose";

export enum DayOfWeek {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export interface AvailabilitySlot {
  day: DayOfWeek;
  startTime: string; // Format: "HH:MM" in 24-hour format
  endTime: string; // Format: "HH:MM" in 24-hour format
  isAvailable: boolean;
}

export interface Review {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  appointmentId: mongoose.Types.ObjectId; // Reference to the appointment
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Date;
}

export interface VetData {
  clinicName?: string;
  specialization?: string[];
  qualifications?: string[];
  experience?: number; // Years of experience
  address?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  phone?: string;
  bio?: string;
  consultationFee?: number;
  availability: AvailabilitySlot[];
  reviews: Review[];
  averageRating?: number;
  totalReviews: number;
}

const availabilitySlotSchema = new mongoose.Schema<AvailabilitySlot>({
  day: {
    type: String,
    enum: Object.values(DayOfWeek),
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Validate HH:MM format
      },
      message: "Start time must be in 24-hour format (HH:MM)",
    },
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Validate HH:MM format
      },
      message: "End time must be in 24-hour format (HH:MM)",
    },
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const reviewSchema = new mongoose.Schema<Review>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
});

export const vetDataSchema = new mongoose.Schema<VetData>({
  clinicName: {
    type: String,
    trim: true,
  },
  specialization: {
    type: [String],
    default: [],
  },
  qualifications: {
    type: [String],
    default: [],
  },
  experience: {
    type: Number,
    min: 0,
  },
  address: {
    type: String,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      validate: {
        validator: function (v: number[]) {
          return (
            v.length === 2 &&
            v[0] >= -180 &&
            v[0] <= 180 && // longitude
            v[1] >= -90 &&
            v[1] <= 90
          ); // latitude
        },
        message:
          "Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90.",
      },
    },
  },
  phone: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  consultationFee: {
    type: Number,
    min: 0,
  },
  availability: {
    type: [availabilitySlotSchema],
    default: [],
  },
  reviews: {
    type: [reviewSchema],
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0,
  },
});

// Create 2dsphere index for geospatial queries
vetDataSchema.index({ location: "2dsphere" });

// Pre-save hook to calculate average rating
vetDataSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.averageRating = totalRating / this.reviews.length;
    this.totalReviews = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }
  next();
});
