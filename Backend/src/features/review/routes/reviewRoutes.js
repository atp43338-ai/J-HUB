import express from "express";
import {
  getProductReviews,
  checkReviewEligibility,
  addReview,
  getAllReviewsForAdmin,
  deleteReviewForAdmin,
  updateReviewStatus,
} from "../controllers/reviewController.js";
import authMiddleware from "../../auth/middleware/authMiddleware.js";
import adminMiddleware from "../../admin/middleware/adminMiddleware.js";

const router = express.Router();

// Admin fetch all reviews with pagination:
router.get("/", getAllReviewsForAdmin);
router.get("/admin", getAllReviewsForAdmin);

// Protected: Check if current user is eligible to write a review
router.get("/check-eligibility/:productId", authMiddleware, checkReviewEligibility);

// Public: Get all reviews and average rating for a product
router.get("/:productId", getProductReviews);

// Protected: Add a new review
router.post("/add", authMiddleware, addReview);
router.post("/", authMiddleware, addReview);

// Action routes for moderation:
router.delete("/:id", adminMiddleware, deleteReviewForAdmin);
router.patch("/:id/status", adminMiddleware, updateReviewStatus);

export default router;
