import express from "express";

import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  googleLogin
} from "../controllers/authController.js";

const router = express.Router();


// Register
router.post("/register", registerUser);

// OTP Verification
router.post("/verify-otp", verifyOTP);

//resend otp
router.post("/resend-otp", resendOTP);

// Login
router.post("/login", loginUser);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);


// Google Login
router.post("/google-login", googleLogin);




export default router;