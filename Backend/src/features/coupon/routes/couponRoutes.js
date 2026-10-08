import express from "express";

import {
  applyCouponController,
  getAvailableCouponsController,
} from "../controllers/couponController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();

// APPLY COUPON
router.post("/apply", authMiddleware, applyCouponController );

// GET AVAILABLE COUPONS
router.get("/available", authMiddleware, getAvailableCouponsController );

export default router;