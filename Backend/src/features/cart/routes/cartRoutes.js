import express from "express";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addToCart);

router.get("/", authMiddleware, getCart);

router.put("/:itemId", authMiddleware, updateCartItem);

router.delete("/:itemId", authMiddleware, removeCartItem);

export default router;