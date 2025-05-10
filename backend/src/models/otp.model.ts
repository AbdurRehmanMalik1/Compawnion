import mongoose, { Document } from "mongoose";
import { config } from "../config";

export interface OTPModelI extends Document {
  userId: mongoose.Types.ObjectId;
  otp: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + config.otp.expiresIn * 60 * 1000), // Convert minutes to milliseconds
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create TTL index on expiresAt field
// This will automatically delete documents when expiresAt is reached
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTPModel = mongoose.model<OTPModelI>("OTP", otpSchema);

export default OTPModel;
