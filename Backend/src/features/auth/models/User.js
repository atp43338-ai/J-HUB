import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    pendingEmail: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      required: false,
      default: null,
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },

    loginOTP: {
    type: String,
    default: null,
    },

    loginOTPExpiresAt: {
    type: Date,
    default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    // Referral
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referralToken: {
      type: String,
      unique: true,
      sparse: true,
      },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    referralRewardClaimed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);