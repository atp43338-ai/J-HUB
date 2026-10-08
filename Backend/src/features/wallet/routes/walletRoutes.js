import express from "express";

import {
  getWalletController,
} from "../controllers/walletController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();

// GET USER WALLET
router.get(
  "/",
  authMiddleware,
  getWalletController
);

export default router;