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

    otpExpiresAt: {
    type: Date,
    default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);