import express from "express";
import {
  getProductReviews,
  checkReviewEligibility,
  addReview,
  getAllReviewsForAdmin,
  deleteReviewForAdmin,
} from "../controllers/reviewController.js";
import authMiddleware from "../../auth/middleware/authMiddleware.js";
import adminMiddleware from "../../admin/middleware/adminMiddleware.js";

const router = express.Router();

// Admin / Paginated: Get all reviews (with page, limit, search)
router.get("/", getAllReviewsForAdmin);

// Protected: Check if current user is eligible to write a review
router.get("/check-eligibility/:productId", authMiddleware, checkReviewEligibility);

// Public: Get all reviews and average rating for a product
router.get("/:productId", getProductReviews);

// Protected: Add a new review
router.post("/add", authMiddleware, addReview);
router.post("/", authMiddleware, addReview);

// Admin: Delete a review
router.delete("/:id", adminMiddleware, deleteReviewForAdmin);

export default router;
