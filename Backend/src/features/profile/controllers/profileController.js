import User from "../../auth/models/User.js";
import {
  getProfileService,
  updateProfileService,
  changeEmailService,
  verifyEmailChangeService,
} from "../services/profileService.js";


// ==================================================
// PROFILE FEATURE
// GET LOGGED-IN USER PROFILE
// ==================================================

export const getProfile = async (req, res) => {
  try {
    const user = await getProfileService(req.user.id);

    const users = await User.find({ isBlocked: true});
    console.log(users);

    res.status(200).json({
      user,
    });

  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// PROFILE FEATURE
// UPDATE PROFILE
// ==================================================

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and phone are required",
      });
    }

    const profileImage = req.file
      ? `/uploads/profile/${req.file.filename}`
      : null;

    const user = await updateProfileService(
      req.user.id,
      name,
      phone,
      profileImage
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// PROFILE FEATURE
// CHANGE EMAIL - SEND OTP
// ==================================================

export const changeEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({
        message: "New email is required",
      });
    }

    await changeEmailService(
      req.user.id,
      newEmail
    );

    res.status(200).json({
      message: "OTP sent to new email",
    });

  } catch (error) {
    console.error("Change email error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// PROFILE FEATURE
// VERIFY EMAIL CHANGE
// ==================================================

export const verifyEmailChange = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }

    const user = await verifyEmailChangeService(
      req.user.id,
      otp
    );

    res.status(200).json({
      message: "Email updated successfully",
      user,
    });

  } catch (error) {
    console.error("Verify email change error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};