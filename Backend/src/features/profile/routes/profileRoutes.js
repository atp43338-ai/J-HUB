import express from "express";

import {
  getProfile,
  updateProfile,
  changeEmail,
  verifyEmailChange,
} from "../controllers/profileController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();


// Get logged-in user profile
router.get("/", authMiddleware, getProfile);


// Update profile name and phone
router.put("/", authMiddleware, upload.single("profileImage"), updateProfile);

// Change email - send OTP
router.post("/change-email", authMiddleware, changeEmail);




// Verify email change OTP
router.post(
  "/verify-email-change",
  authMiddleware,
  verifyEmailChange
);


export default router;