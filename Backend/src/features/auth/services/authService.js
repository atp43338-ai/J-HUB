import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register User
export const registerUserService = async (
  name,
  email,
  password,
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

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
  });

  return user;
};

// Verify OTP
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

// Login User
export const loginUserService = async (email, password) => {
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

  return user;
};


// Reset Password
export const resetPasswordService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user.password = hashPassword;

  await user.save();

  return user;
};


// Google Login
export const googleLoginService = async (credential) => {
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