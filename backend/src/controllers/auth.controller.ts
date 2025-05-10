import crypto from "crypto";
import { Request, Response } from "express";
import OTPModel from "../models/otp.model";
import UserModel, { UserModelI } from "../models/user/user.model";
import HttpExceptions from "../utility/exceptions/HttpExceptions";
import { sendOTPEmail } from "../utility/services/sendEmail";

const signup = async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body;

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw HttpExceptions.Conflict("Email already in use");
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Create new user
  const user = new UserModel({
    name,
    email,
    password,
    avatar,
    isVerified: false,
  });

  // Save user
  await user.save();

  // Create and save OTP
  const otpDoc = new OTPModel({
    userId: user._id,
    otp,
  });
  await otpDoc.save();

  // Send OTP email
  await sendOTPEmail({
    email,
    otpCode: otp,
  });

  // Remove sensitive data from response
  const userObj = user.toObject();
  const { password: _, ...userWithoutSensitive } = userObj;

  res.status(201).json({
    message:
      "Signup successful. Please check your email for verification code.",
    user: userWithoutSensitive,
  });
};

const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpExceptions.NotFound("User not found");
  }

  // Find valid OTP for user
  const otpDoc = await OTPModel.findOne({
    userId: user._id,
    otp,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpDoc) {
    throw HttpExceptions.BadRequest("Invalid or expired OTP");
  }

  // Mark OTP as used
  otpDoc.isUsed = true;
  await otpDoc.save();

  // Update user verification status
  user.isVerified = true;
  await user.save();

  res.status(200).json({
    message: "Email verified successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isVerified: user.isVerified,
    },
  });
};

const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpExceptions.NotFound("User not found");
  }

  if (user.isVerified) {
    throw HttpExceptions.BadRequest("User is already verified");
  }

  // Generate new OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Create and save new OTP
  const otpDoc = new OTPModel({
    userId: user._id,
    otp,
  });
  await otpDoc.save();

  // Send OTP email
  await sendOTPEmail({
    email,
    otpCode: otp,
  });

  res.status(200).json({
    message: "Verification code has been resent to your email",
  });
};

export const authController = {
  signup,
  verifyOTP,
  resendVerification,
};
