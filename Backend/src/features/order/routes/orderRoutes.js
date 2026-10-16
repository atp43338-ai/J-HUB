import express from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  cancelOrderItem,
  createFailedPaymentOrder,
  retryPaymentOrder,
  completeRetryPaymentOrder,
  markOrderFailed,
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

router.post(
  "/failed-payment",
  authMiddleware,
  createFailedPaymentOrder
);

// RETRY PAYMENT ENDPOINTS (SUPPORT BOTH POST AND GET)
router.post(
  "/:orderId/retry-payment",
  authMiddleware,
  retryPaymentOrder
);

router.get(
  "/:orderId/retry-payment",
  authMiddleware,
  retryPaymentOrder
);

// MARK ORDER AS FAILED
router.post(
  "/mark-failed",
  authMiddleware,
  markOrderFailed
);

router.post(
  "/:orderId/mark-failed",
  authMiddleware,
  markOrderFailed
);

router.patch(
  "/:orderId/complete-retry-payment",
  authMiddleware,
  completeRetryPaymentOrder
);

export default router;