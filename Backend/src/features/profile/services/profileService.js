import User from "../../auth/models/User.js";


// ==================================================
// COMMON OTP FUNCTION
// ==================================================

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// ==================================================
// PROFILE FEATURE
// GET LOGGED-IN USER PROFILE
// ==================================================

export const getProfileService = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -otp -otpExpiresAt"
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


// ==================================================
// PROFILE FEATURE
// UPDATE PROFILE
// ==================================================

export const updateProfileService = async (
  userId,
  name,
  phone,
  profileImage
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.name = name;
  user.phone = phone;

  if (profileImage) {
    user.profileImage = profileImage;
  }

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profileImage: user.profileImage,
  };
};


// ==================================================
// PROFILE FEATURE
// CHANGE EMAIL - SEND OTP
// ==================================================

export const changeEmailService = async (
  userId,
  newEmail
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (newEmail === user.email) {
    throw new Error("This is already your current email");
  }

  const existingUser = await User.findOne({
    email: newEmail,
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const otp = generateOTP();

  const otpExpiresAt = new Date(
    Date.now() + 60 * 1000
  );

  user.pendingEmail = newEmail;
  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;

  await user.save();

  console.log("Email change OTP:", otp);

  return {
    message: "OTP sent to new email",
  };
};


// ==================================================
// PROFILE FEATURE
// VERIFY EMAIL CHANGE
// ==================================================

export const verifyEmailChangeService = async (
  userId,
  otp
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.pendingEmail) {
    throw new Error("No email change request found");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otpExpiresAt < new Date()) {
    throw new Error("OTP has expired");
  }

  user.email = user.pendingEmail;

  user.pendingEmail = null;
  user.otp = null;
  user.otpExpiresAt = null;

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profileImage: user.profileImage,
  };
};