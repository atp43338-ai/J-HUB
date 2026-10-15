import express from "express";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import {
  getAllReviewsForAdmin,
  deleteReviewForAdmin,
  updateReviewStatus,
} from "../controllers/adminReviewController.js";

const router = express.Router();

// All routes are protected by admin authentication
router.use(adminMiddleware);

// GET /api/admin/reviews - Get all reviews with pagination
router.get("/", getAllReviewsForAdmin);
router.get("/admin", getAllReviewsForAdmin);

// DELETE /api/admin/reviews/:id - Delete a review and update product ratings
router.delete("/:id", deleteReviewForAdmin);

// PATCH /api/admin/reviews/:id/status - Update status/approval
router.patch("/:id/status", updateReviewStatus);

export default router;
