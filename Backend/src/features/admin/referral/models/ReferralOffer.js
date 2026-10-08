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
      enum: ["percentage", "fixed"],
      required: true,
    },

    rewardValue: {
      type: Number,
      required: true,
      min: 1,
    },

    minimumPurchase: {
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
      type: Boolean,
      default: true,
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