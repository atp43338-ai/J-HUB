import express from "express";
import {
  getProductReviews,
  checkReviewEligibility,
  addReview,
} from "../controllers/reviewController.js";
import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();

// Public: Get all reviews and average rating for a product
router.get("/:productId", getProductReviews);

// Protected: Check if current user is eligible to write a review
router.get("/check-eligibility/:productId", authMiddleware, checkReviewEligibility);

// Protected: Add a new review
router.post("/add", authMiddleware, addReview);
router.post("/", authMiddleware, addReview);

export default router;
