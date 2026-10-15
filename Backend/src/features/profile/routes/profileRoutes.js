import express from "express";
import multer from "multer";

import {
  getProfile,
  updateProfile,
  changeEmail,
  verifyEmailChange,
  resendEmailChangeOTP,
} from "../controllers/profileController.js";

import authMiddleware from "../../auth/middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Middleware to gracefully catch Multer errors (file size, format, etc.)
const handleUpload = (req, res, next) => {
  upload.single("profileImage")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Image size must be less than 5MB",
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};

// Get logged-in user profile
router.get("/", getProfile);
router.get("/get-profile", getProfile);

// Update profile name, phone, and/or profile image
router.put("/", handleUpload, updateProfile);
router.put("/update-profile", handleUpload, updateProfile);

// Change email - send OTP
router.post("/change-email", changeEmail);

// Verify email change OTP
router.post("/verify-email-change", verifyEmailChange);

// Resend email change OTP
router.post("/resend-email-change-otp", resendEmailChangeOTP);

export default router;