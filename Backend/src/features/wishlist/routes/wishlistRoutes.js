import express from "express";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();

// Get user's wishlist
router.get("/", authMiddleware, getWishlist);

// Add product to wishlist
router.post("/", authMiddleware, addToWishlist);

// Remove product from wishlist
router.delete("/:productId", authMiddleware, removeFromWishlist);

// Clear wishlist
router.delete("/", authMiddleware, clearWishlist);

export default router;