import express from "express";

import {
  getWalletController,
  createTopupOrder,
  verifyTopup,
} from "../controllers/walletController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();

// GET USER WALLET
router.get(
  "/",
  authMiddleware,
  getWalletController
);

// CREATE TOPUP RAZORPAY ORDER
router.post(
  "/topup/create-order",
  authMiddleware,
  createTopupOrder
);

// VERIFY TOPUP RAZORPAY PAYMENT
router.post(
  "/topup/verify",
  authMiddleware,
  verifyTopup
);

export default router;