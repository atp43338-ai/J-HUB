import { api } from "../../../services/api";


// Register
export const registerUser = async (
  name,
  email,
  password,
  referralCode,
  referralToken
) => {
  return api("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      referralCode,
      referralToken,
    }),
  });
};


// Login
export const loginUser = async (email, password) => {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};


// Verify Login OTP
export const verifyLoginOTP = async (email, otp) => {
  return api("/auth/verify-login-otp", {
    method: "POST",
    body: JSON.stringify({
      email,
      otp,
    }),
  });
};


// Resend Login OTP
export const resendLoginOTP = async (email) => {
  return api("/auth/resend-login-otp", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
};


// Google Login
export const googleLoginUser = async (credential) => {
  return api("/auth/google-login", {
    method: "POST",
    body: JSON.stringify({
      credential,
    }),
  });
};


// Forgot Password
export const forgotPassword = async (email) => {
  return api("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
};


// OTP Verification
export const verifyOTP = async (email, otp) => {
  return api("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      email,
      otp,
    }),
  });
};


// Resend OTP
export const resendOTP = async (email) => {
  return api("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
};


// Reset Password
export const resetPassword = async (email, password) => {
  return api("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};