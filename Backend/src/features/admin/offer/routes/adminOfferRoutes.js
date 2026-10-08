import express from "express";

import {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  updateOfferStatus,
} from "../controllers/adminOfferController.js";

import adminMiddleware from "../../middleware/adminMiddleware.js";

const router = express.Router();

// CREATE OFFER
router.post("/", adminMiddleware, createOffer);

// GET ALL OFFERS
router.get("/", adminMiddleware, getAllOffers);

// GET SINGLE OFFER
router.get("/:id", adminMiddleware, getOfferById);

// UPDATE OFFER
router.put("/:id", adminMiddleware, updateOffer);

// DELETE OFFER
router.delete("/:id", adminMiddleware, deleteOffer);

// UPDATE OFFER STATUS
router.patch("/:id/status", adminMiddleware, updateOfferStatus);

export default router;