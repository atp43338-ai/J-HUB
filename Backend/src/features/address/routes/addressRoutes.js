import express from "express";

import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  getSingleAddress
} from "../controllers/addressController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();

// Get all addresses
router.get("/", authMiddleware, getAddresses);

// Add new address
router.post("/", authMiddleware, addAddress);

// Update address
router.put("/:id", authMiddleware, updateAddress);

// Delete address
router.delete("/:id", authMiddleware, deleteAddress);

//getsingle address
router.get("/:id", authMiddleware, getSingleAddress);

export default router;