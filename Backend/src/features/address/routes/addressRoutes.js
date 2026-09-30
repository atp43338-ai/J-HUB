import express from "express";

import {
  addAddress,
  getAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();


// GET ALL
router.get(
  "/",
  authMiddleware,
  getAddresses
);


// GET SINGLE
router.get(
  "/:id",
  authMiddleware,
  getSingleAddress
);


// ADD
router.post(
  "/",
  authMiddleware,
  addAddress
);


// UPDATE
router.put(
  "/:id",
  authMiddleware,
  updateAddress
);


// DELETE
router.delete(
  "/:id",
  authMiddleware,
  deleteAddress
);


export default router;