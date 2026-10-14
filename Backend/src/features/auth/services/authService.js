import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

import {
  sendRegisterOTPEmail,
  sendForgotPasswordOTPEmail,
} from "./emailService.js";
import {
  addMoneyToWallet,
  creditUserWallet,
} from "../../wallet/services/walletService.js";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate Referral Code
const generateReferralCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
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
  let validReferrer = null;

  const cleanCode = referralCode ? String(referralCode).trim().toUpperCase() : null;
  const cleanToken = referralToken ? String(referralToken).trim() : null;

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

  // Self-referral and duplicate prevention checks
  if (cleanCode) {
    const referrer = await User.findOne({
      referralCode: cleanCode,
    });

    if (
      referrer &&
      referrer.email?.toLowerCase() !== email.toLowerCase() &&
      referrer.referralCode?.toUpperCase() !== newReferralCode
    ) {
      referredBy = referrer._id;
      validReferrer = referrer;
    }
  } else if (cleanToken) {
    const referrer = await User.findOne({
      referralToken: cleanToken,
    });

    if (
      referrer &&
      referrer.email?.toLowerCase() !== email.toLowerCase() &&
      referrer.referralToken !== newReferralToken
    ) {
      referredBy = referrer._id;
      validReferrer = referrer;
    }
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const otp = generateOTP();

  const otpExpiresAt = new Date(
    Date.now() + 60 * 1000
  );

  // Execution Sequence: The new user document MUST be persisted (await newUser.save()) before invoking wallet service
  const newUser = new User({
    name,
    email,
    password: hashPassword,
    otp,
    otpExpiresAt,

    referralCode: newReferralCode,
    referralToken: newReferralToken,
    referredBy,
    referralRewardClaimed: Boolean(validReferrer),
    isReferralRewardClaimed: Boolean(validReferrer),
  });

  await newUser.save();

  // Dual-sided referral rewards:
  // Referrer earns ₹99, New user earns ₹49
  if (validReferrer) {
    try {
      // 1. Credit ₹49 to newly registered user
      await creditUserWallet(
        newUser._id,
        49,
        "Referral signup welcome bonus"
      );

      // 2. Credit ₹99 to referrer
      await creditUserWallet(
        validReferrer._id,
        99,
        `Referral reward for inviting ${newUser.name || "a new user"}`
      );
    } catch (creditError) {
      console.error("Referral wallet credit failed:", creditError);
    }
  }

  // Send registration OTP to user's email
  await sendRegisterOTPEmail(
    newUser.email,
    otp
  );

  return newUser;
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
    const error = new Error(
      "Your account has been blocked by the admin. Please contact support."
    );
    error.statusCode = 403;
    error.isBlocked = true;
    throw error;
  }

  if (!user.password || typeof user.password !== "string" || typeof password !== "string") {
    throw new Error("Invalid email or password");
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
    let newReferralCode;
    do {
      newReferralCode = generateReferralCode();
    } while (await User.findOne({ referralCode: newReferralCode }));

    let newReferralToken;
    do {
      newReferralToken = generateReferralToken();
    } while (await User.findOne({ referralToken: newReferralToken }));

    user = await User.create({
      name,
      email,
      googleId: sub,
      profileImage: picture || "",
      phone: "",
      password: null,
      isEmailVerified: true,
      referralCode: newReferralCode,
      referralToken: newReferralToken,
    });
  } else {
    let updated = false;

    if (!user.referralCode) {
      let newReferralCode;
      do {
        newReferralCode = generateReferralCode();
      } while (await User.findOne({ referralCode: newReferralCode }));
      user.referralCode = newReferralCode;
      updated = true;
    }

    if (!user.googleId) {
      user.googleId = sub;
      updated = true;
    }

    if (!user.profileImage && picture) {
      user.profileImage = picture;
      updated = true;
    }

    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      updated = true;
    }

    if (updated) {
      await user.save();
    }
  }

  if (user.isBlocked) {
    const error = new Error(
      "Your account has been blocked by the admin. Please contact support."
    );
    error.statusCode = 403;
    error.isBlocked = true;
    throw error;
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