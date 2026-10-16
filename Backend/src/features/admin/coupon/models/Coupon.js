import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },

    minimumPurchase: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    maximumDiscount: {
      type: Number,
      default: null,
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

    usageLimit: {
      type: Number,
      default: null,
      min: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
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

couponSchema.pre("validate", function () {
  if (
    this.discountType === "fixed" ||
    this.discountType === "flat" ||
    this.discountType === "Fixed Amount"
  ) {
    if (
      this.minimumPurchase !== undefined &&
      this.discountValue !== undefined &&
      Number(this.minimumPurchase) <= Number(this.discountValue)
    ) {
      this.invalidate(
        "minimumPurchase",
        "Minimum purchase amount must be strictly greater than the discount price."
      );
    }
  } else if (this.discountType === "percentage" && this.maximumDiscount != null) {
    if (
      this.minimumPurchase !== undefined &&
      Number(this.minimumPurchase) <= Number(this.maximumDiscount)
    ) {
      this.invalidate(
        "minimumPurchase",
        "Minimum purchase amount must be strictly greater than the maximum discount cap."
      );
    }
  }
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;