import express from "express";

import {
  getReferralDetails,
} from "../controllers/referralController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getReferralDetails
);

export default router;