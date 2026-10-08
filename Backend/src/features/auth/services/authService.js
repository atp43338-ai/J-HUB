import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

import {
  sendRegisterOTPEmail,
  sendForgotPasswordOTPEmail,
} from "./emailService.js";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate Referral Code
const generateReferralCode = () => {
  return (
    "JHUB-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );
};

// Generate Referral Token
const generateReferralToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Register User
export const registerUserService = async (
  name,
  email,
  password,
  referralCode,
  referralToken
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must contain 8 characters, uppercase, lowercase, number and special character"
    );
  }

  let referredBy = null;

  if (referralCode && referralToken) {
    throw new Error(
      "Use either referral code or referral token"
    );
  }

  if (referralCode) {
    const referrer = await User.findOne({
      referralCode: referralCode.trim().toUpperCase(),
    });

    if (!referrer) {
      throw new Error("Invalid referral code");
    }

    referredBy = referrer._id;
  }

  if (referralToken) {
    const referrer = await User.findOne({
      referralToken: referralToken.trim(),
    });

    if (!referrer) {
      throw new Error("Invalid referral token");
    }

    referredBy = referrer._id;
  }

  // Generate unique referral code for new user
  let newReferralCode;

  do {
    newReferralCode = generateReferralCode();
  } while (
    await User.findOne({
      referralCode: newReferralCode,
    })
  );

  // Generate unique referral token for new user
  let newReferralToken;

  do {
    newReferralToken = generateReferralToken();
  } while (
    await User.findOne({
      referralToken: newReferralToken,
    })
  );

  const hashPassword = await bcrypt.hash(password, 10);

  const otp = generateOTP();

  const otpExpiresAt = new Date(
    Date.now() + 60 * 1000
  );

  const user = await User.create({
    name,
    email,
    password: hashPassword,
    otp,
    otpExpiresAt,

    referralCode: newReferralCode,
    referralToken: newReferralToken,
    referredBy,
    referralRewardClaimed: false,
  });

  // Send registration OTP to user's email
  await sendRegisterOTPEmail(
    user.email,
    otp
  );

  return user;
};

// Verify Registration OTP
export const verifyOTPService = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otpExpiresAt < new Date()) {
    throw new Error("OTP has expired");
  }

  user.isEmailVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;

  await user.save();

  return user;
};

// Resend Registration OTP
export const resendOTPService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOTP();

  const otpExpiresAt = new Date(
    Date.now() + 60 * 1000
  );

  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;

  await user.save();

  // Send new registration OTP to user's email
  await sendRegisterOTPEmail(
    user.email,
    otp
  );

  return user;
};

// Login User
export const loginUserService = async (
  email,
  password
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email first");
  }

  if (user.isBlocked) {
    throw new Error("Your account has been blocked");
  }

  const isPasswordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  // Create JWT after successful login
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

// Change Password
export const changePasswordService = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isPasswordMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashPassword = await bcrypt.hash(
    newPassword,
    10
  );

  user.password = hashPassword;

  await user.save();

  return user;
};

// Forgot Password
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOTP();

  const otpExpiresAt = new Date(
    Date.now() + 60 * 1000
  );

  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;

  await user.save();

  // Send forgot password OTP to user's email
  await sendForgotPasswordOTPEmail(
    user.email,
    otp
  );

  return user;
};

// Reset Password
export const resetPasswordService = async (
  email,
  password
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const hashPassword = await bcrypt.hash(
    password,
    10
  );

  user.password = hashPassword;

  await user.save();

  return user;
};

// Google Login
export const googleLoginService = async (
  credential
) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { sub, name, email, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId: sub,
      profileImage: picture || "",
      phone: "",
      password: null,
      isEmailVerified: true,
    });
  } else {
    if (!user.googleId) {
      user.googleId = sub;
    }

    if (!user.profileImage && picture) {
      user.profileImage = picture;
    }

    user.isEmailVerified = true;

    await user.save();
  }

  if (user.isBlocked) {
    throw new Error("Your account has been blocked");
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
    },
  };
};