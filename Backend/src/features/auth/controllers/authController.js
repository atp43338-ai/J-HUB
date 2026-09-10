import User from "../models/User.js";
import {
  registerUserService,
  verifyOTPService,
  loginUserService,
  forgotPasswordService,
  resetPasswordService,
  googleLoginService,
} from "../services/authService.js";


// ==================================================
// AUTH FEATURE
// REGISTER USER
// ==================================================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

   

    const user = await registerUserService(
      name,
      email,
      password,
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// AUTH FEATURE
// OTP VERIFICATION
// ==================================================

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    await verifyOTPService(email, otp);

    res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// AUTH FEATURE
// LOGIN USER
// ==================================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUserService(
      email,
      password
    );

 

    res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// AUTH FEATURE
// FORGOT PASSWORD
// ==================================================

export const forgotPassword = async (req, res) => {
  try {
    console.log("FORGOT PASSWORD API CALLED");

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    await forgotPasswordService(email);

    res.status(200).json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// AUTH FEATURE
// RESET PASSWORD
// ==================================================

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    await resetPasswordService(
      email,
      password
    );

    res.status(200).json({
      message: "Password reset successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// AUTH FEATURE
// GOOGLE LOGIN
// ==================================================

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    const result = await googleLoginService(
      credential
    );

    res.status(200).json({
      message: "Google login successful",
      token: result.token,
      user: result.user,
    });

  } catch (error) {
    console.error("Google login error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};