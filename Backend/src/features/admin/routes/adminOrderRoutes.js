import express from "express";

import {
  getAllOrdersForAdmin,
  getAdminOrderDetails,
  updateOrderStatusForAdmin,
} from "../controllers/adminOrderController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// GET ALL ORDERS
router.get(
  "/",
  adminMiddleware,
  getAllOrdersForAdmin
);

// UPDATE ORDER STATUS
router.patch(
  "/:id/status",
  adminMiddleware,
  updateOrderStatusForAdmin
);

// GET SINGLE ORDER DETAILS
router.get(
  "/:id",
  adminMiddleware,
  getAdminOrderDetails
);

export default router;