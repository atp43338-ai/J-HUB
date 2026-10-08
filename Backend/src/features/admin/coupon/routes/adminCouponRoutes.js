import express from "express";

import {
  createCouponController,
  getAllCouponsController,
  getCouponByIdController,
  updateCouponController,
  deleteCouponController,
  updateCouponStatusController,
} from "../controllers/adminCouponController.js";

import adminMiddleware from "../../middleware/adminMiddleware.js";

const router = express.Router();

// CREATE COUPON
router.post(
  "/",
  adminMiddleware,
  createCouponController
);

// GET ALL COUPONS
router.get(
  "/",
  adminMiddleware,
  getAllCouponsController
);

// GET SINGLE COUPON
router.get(
  "/:id",
  adminMiddleware,
  getCouponByIdController
);

// UPDATE COUPON
router.put(
  "/:id",
  adminMiddleware,
  updateCouponController
);

// DELETE COUPON
router.delete(
  "/:id",
  adminMiddleware,
  deleteCouponController
);

// UPDATE COUPON STATUS
router.patch(
  "/:id/status",
  adminMiddleware,
  updateCouponStatusController
);

export default router;