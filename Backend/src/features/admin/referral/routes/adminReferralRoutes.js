import express from "express";

import {
  createReferralOfferController,
  getAllReferralOffersController,
  getReferralOfferByIdController,
  updateReferralOfferController,
  deleteReferralOfferController,
  updateReferralOfferStatusController,
} from "../controllers/adminReferralController.js";

import adminMiddleware from "../../middleware/adminMiddleware.js";

const router = express.Router();

// CREATE REFERRAL OFFER
router.post(
  "/",
  adminMiddleware,
  createReferralOfferController
);

// GET ALL REFERRAL OFFERS
router.get(
  "/",
  adminMiddleware,
  getAllReferralOffersController
);

// GET REFERRAL OFFER BY ID
router.get(
  "/:id",
  adminMiddleware,
  getReferralOfferByIdController
);

// UPDATE REFERRAL OFFER
router.put(
  "/:id",
  adminMiddleware,
  updateReferralOfferController
);

// DELETE REFERRAL OFFER
router.delete(
  "/:id",
  adminMiddleware,
  deleteReferralOfferController
);

// UPDATE STATUS
router.patch(
  "/:id/status",
  adminMiddleware,
  updateReferralOfferStatusController
);

export default router;