import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../../auth/models/User.js";


// ==================================================
// CREATE ADMIN
// ==================================================

export const createAdminService = async (
  name,
  email,
  password
) => {
  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
  };
};


// ==================================================
// ADMIN LOGIN
// ==================================================

export const adminLoginService = async (
  email,
  password
) => {
  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    admin.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: "admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  };
};


// ==================================================
// GET ALL USERS
// ==================================================

export const getAllUsers = async (
  page = 1,
  limit = 5
) => {
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select("-password -otp -otpExpiresAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments();

  return {
    users,
    totalUsers,
    currentPage: page,
    totalPages: Math.ceil(
      totalUsers / limit
    ),
  };
};


// ==================================================
// BLOCK / UNBLOCK USER
// ==================================================

export const updateUserBlockStatus = async (
  userId,
  isBlocked
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.isBlocked = isBlocked;

  await user.save();

  return user;
};