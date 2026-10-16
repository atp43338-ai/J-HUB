import mongoose from "mongoose";

const referralOfferSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rewardType: {
      type: String,
      enum: ["percentage", "fixed", "flat"],
      required: true,
      default: "flat",
    },

    rewardValue: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    rewardAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    rewardPercentage: {
      type: Number,
      default: 0,
      min: 0,
    },

    minimumPurchase: {
      type: Number,
      default: 0,
      min: 0,
    },

    minPurchase: {
      type: Number,
      default: 0,
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: mongoose.Schema.Types.Mixed,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const ReferralOffer = mongoose.model(
  "ReferralOffer",
  referralOfferSchema
);

export default ReferralOffer;