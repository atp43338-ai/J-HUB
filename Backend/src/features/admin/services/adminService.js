import User from "../../auth/models/User.js";

export const getAllUsers = async (page = 1, limit = 5) => {
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
    totalPages: Math.ceil(totalUsers / limit),
  };
};

export const updateUserBlockStatus = async (userId, isBlocked) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.isBlocked = isBlocked;

  await user.save();

  return user;
};