import express from "express";

import {
  getReferralDetails,
  getActiveReferralOffer,
} from "../controllers/referralController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();

router.get("/active-offer", getActiveReferralOffer);

router.get(
  "/",
  authMiddleware,
  getReferralDetails
);

export default router;