import express from "express";

import {
  createOrder,
  getOrderById,
  getOrders,
  cancelOrder,
  cancelOrderItem
} from "../controllers/orderController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();

// CREATE ORDER
router.post("/", authMiddleware, createOrder);

// GET ALL USER ORDERS
router.get("/", authMiddleware, getOrders);

// CANCEL ORDER
router.patch("/:orderId/cancel", authMiddleware, cancelOrder);

// GET SINGLE ORDER
router.get("/:orderId", authMiddleware, getOrderById);

// CANCEL SPECIFIC ORDER ITEM
router.patch("/:orderId/items/:itemId/cancel", authMiddleware, cancelOrderItem );

export default router;