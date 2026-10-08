import express from "express";

import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  googleLogin,
  changePassword,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// OTP Verification - Register
router.post("/verify-otp", verifyOTP);

// Resend Register OTP
router.post("/resend-otp", resendOTP);

// Login
router.post("/login", loginUser);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

// Google Login
router.post("/google-login", googleLogin);

// Change Password
router.patch(
  "/change-password",
  authMiddleware,
  changePassword
);

export default router;