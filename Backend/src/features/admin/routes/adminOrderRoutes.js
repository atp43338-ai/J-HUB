import express from "express";

import {
  getAllOrdersForAdmin,
  getSingleOrderForAdmin,
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
  "/:orderId/status",
  adminMiddleware,
  updateOrderStatusForAdmin
);


// GET SINGLE ORDER
router.get(
  "/:orderId",
  adminMiddleware,
  getSingleOrderForAdmin
);


export default router;