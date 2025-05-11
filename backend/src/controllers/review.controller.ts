import { Request, Response } from "express";
import UserModel, { UserModelI } from "../models/user/user.model";
import AppointmentModel, {
  AppointmentStatus,
} from "../models/appointment.model";
import HttpExceptions from "../utility/exceptions/HttpExceptions";
import { UserRole } from "../types";
import mongoose from "mongoose";
import { Review, VetData } from "../models/user/vet.data";

/**
 * Submit a review for a veterinarian after an appointment
 */
const submitReview = async (req: Request, res: Response) => {
  const currentUser = req.user as UserModelI;
  const { appointmentId, rating, comment } = req.body;

  // Validate rating
  if (rating < 1 || rating > 5) {
    throw HttpExceptions.BadRequest("Rating must be between 1 and 5");
  }

  // Find the appointment
  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    throw HttpExceptions.NotFound("Appointment not found");
  }

  // Check if this is the user's appointment
  if (appointment.userId.toString() !== currentUser._id.toString()) {
    throw HttpExceptions.Forbidden("You can only review your own appointments");
  }

  // Check if appointment is completed
  if (appointment.status !== AppointmentStatus.COMPLETED) {
    throw HttpExceptions.BadRequest(
      "You can only review completed appointments"
    );
  }

  // Find the veterinarian
  const veterinarian = await UserModel.findById(appointment.veterinarianId);

  if (!veterinarian || veterinarian.role !== UserRole.VETERINARIAN) {
    throw HttpExceptions.NotFound("Veterinarian not found");
  }

  // Check if user has already reviewed this appointment
  const existingReviewIndex = (
    veterinarian.roleData as VetData
  )?.reviews?.findIndex(
    (review) =>
      review.userId.toString() === currentUser._id.toString() &&
      review.appointmentId.toString() === appointmentId
  );

  if (existingReviewIndex !== undefined && existingReviewIndex >= 0) {
    // Update existing review
    if (veterinarian.roleData && (veterinarian.roleData as VetData).reviews) {
      (veterinarian.roleData as VetData).reviews[existingReviewIndex] = {
        userId: currentUser._id as any,
        appointmentId: new mongoose.Types.ObjectId(appointmentId),
        rating,
        comment,
        createdAt: new Date(),
      };
    }
  } else {
    // Add new review
    if (!veterinarian.roleData) {
      veterinarian.roleData = {
        availability: [],
        reviews: [],
        totalReviews: 0,
      };
    }

    if (!(veterinarian.roleData as VetData).reviews) {
      (veterinarian.roleData as VetData).reviews = [];
    }

    (veterinarian.roleData as VetData).reviews.push({
      userId: currentUser._id as any,
      appointmentId: new mongoose.Types.ObjectId(appointmentId),
      rating,
      comment,
      createdAt: new Date(),
    });
  }

  // Update average rating and total reviews
  if (veterinarian.roleData) {
    const totalRating =
      (veterinarian.roleData as VetData).reviews?.reduce(
        (sum: number, review: Review) => sum + review.rating,
        0
      ) || 0;
    (veterinarian.roleData as VetData).totalReviews =
      (veterinarian.roleData as VetData).reviews?.length || 0;
    (veterinarian.roleData as VetData).averageRating =
      totalRating / (veterinarian.roleData as VetData).totalReviews;
  }

  await veterinarian.save();

  res.status(200).json({
    message: "Review submitted successfully",
    review: {
      appointmentId,
      rating,
      comment,
      createdAt: new Date(),
    },
  });
};

/**
 * Get all reviews for a specific veterinarian
 */
const getVeterinarianReviews = async (req: Request, res: Response) => {
  const { vetId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  // Find the veterinarian
  const veterinarian = await UserModel.findOne({
    _id: vetId,
    role: UserRole.VETERINARIAN,
  });

  if (!veterinarian) {
    throw HttpExceptions.NotFound("Veterinarian not found");
  }

  // Get reviews with pagination
  const reviews = (veterinarian.roleData as VetData)?.reviews || [];

  // Sort reviews by date (newest first)
  reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Apply pagination
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;
  const paginatedReviews = reviews.slice(startIndex, endIndex);

  // Get user details for each review
  const reviewsWithUserDetails = await Promise.all(
    paginatedReviews.map(async (review) => {
      const user = await UserModel.findById(review.userId).select(
        "name avatar"
      );
      return {
        _id: review._id,
        user: user
          ? {
              _id: user._id,
              name: user.name,
              avatar: user.avatar,
            }
          : null,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      };
    })
  );

  res.status(200).json({
    message: "Veterinarian reviews retrieved successfully",
    veterinarian: {
      _id: veterinarian._id,
      name: veterinarian.name,
      avatar: veterinarian.avatar,
      averageRating: (veterinarian.roleData as VetData)?.averageRating || 0,
      totalReviews: (veterinarian.roleData as VetData)?.totalReviews || 0,
    },
    reviews: reviewsWithUserDetails,
    pagination: {
      total: reviews.length,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(reviews.length / limitNum),
    },
  });
};

/**
 * Get a specific review by ID
 */
const getReviewById = async (req: Request, res: Response) => {
  const { vetId, reviewId } = req.params;

  // Find the veterinarian
  const veterinarian = await UserModel.findOne({
    _id: vetId,
    role: UserRole.VETERINARIAN,
  });

  if (!veterinarian) {
    throw HttpExceptions.NotFound("Veterinarian not found");
  }

  // Find the review
  const review = (veterinarian.roleData as VetData)?.reviews?.find(
    (r) => r._id?.toString() === reviewId
  );

  if (!review) {
    throw HttpExceptions.NotFound("Review not found");
  }

  // Get user details
  const user = await UserModel.findById(review.userId).select("name avatar");

  // Get appointment details
  const appointment = await AppointmentModel.findById(
    review.appointmentId
  ).select("date reason");

  res.status(200).json({
    message: "Review retrieved successfully",
    review: {
      _id: review._id,
      user: user
        ? {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
          }
        : null,
      appointment: appointment
        ? {
            _id: appointment._id,
            date: appointment.date,
            reason: appointment.reason,
          }
        : null,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    },
  });
};

/**
 * Delete a review (for users who created the review)
 */
const deleteReview = async (req: Request, res: Response) => {
  const currentUser = req.user as UserModelI;
  const { vetId, reviewId } = req.params;

  // Find the veterinarian
  const veterinarian = await UserModel.findOne({
    _id: vetId,
    role: UserRole.VETERINARIAN,
  });

  if (!veterinarian) {
    throw HttpExceptions.NotFound("Veterinarian not found");
  }

  // Find the review
  const reviewIndex = (veterinarian.roleData as VetData)?.reviews?.findIndex(
    (r) =>
      r._id?.toString() === reviewId &&
      r.userId.toString() === currentUser._id.toString()
  );

  if (reviewIndex === undefined || reviewIndex === -1) {
    throw HttpExceptions.NotFound(
      "Review not found or you don't have permission to delete it"
    );
  }

  // Remove the review
  if ((veterinarian.roleData as VetData).reviews) {
    (veterinarian.roleData as VetData).reviews.splice(reviewIndex, 1);

    // Update average rating and total reviews
    const totalRating = (veterinarian.roleData as VetData).reviews.reduce(
      (sum: number, review: Review) => sum + review.rating,
      0
    );
    (veterinarian.roleData as VetData).totalReviews = (
      veterinarian.roleData as VetData
    ).reviews.length;
    (veterinarian.roleData as VetData).averageRating =
      (veterinarian.roleData as VetData).reviews.length > 0
        ? totalRating / (veterinarian.roleData as VetData).reviews.length
        : 0;

    await veterinarian.save();
  }

  res.status(200).json({
    message: "Review deleted successfully",
  });
};

export const reviewController = {
  submitReview,
  getVeterinarianReviews,
  getReviewById,
  deleteReview,
};
