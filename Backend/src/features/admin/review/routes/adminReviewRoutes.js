import express from "express";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import {
  getAllReviewsForAdmin,
  deleteReviewForAdmin,
} from "../controllers/adminReviewController.js";

const router = express.Router();

// All routes are protected by admin authentication
router.use(adminMiddleware);

// GET /api/admin/reviews - Get all reviews with pagination
router.get("/", getAllReviewsForAdmin);

// DELETE /api/admin/reviews/:id - Delete a review and update product ratings
router.delete("/:id", deleteReviewForAdmin);

export default router;
