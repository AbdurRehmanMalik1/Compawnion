import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { reviewValidator } from "../validators/review.validator";

const router = Router();

// All review routes require authentication
router.use(authMiddleware);

// Submit a review
router.post(
  "/reviews",
  reviewValidator.submitReview,
  reviewController.submitReview
);

// Get all reviews for a veterinarian
router.get(
  "/veterinarians/:vetId/reviews",
  reviewValidator.getVeterinarianReviews,
  reviewController.getVeterinarianReviews
);

// Get a specific review
router.get(
  "/veterinarians/:vetId/reviews/:reviewId",
  reviewValidator.getReviewById,
  reviewController.getReviewById
);

// Delete a review
router.delete(
  "/veterinarians/:vetId/reviews/:reviewId",
  reviewValidator.deleteReview,
  reviewController.deleteReview
);

export default router;
