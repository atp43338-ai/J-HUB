import Coupon from "../models/Coupon.js";

// CREATE COUPON
export const createCoupon = async (couponData) => {
  const {
    code,
    discountType,
    discountValue,
    minimumPurchase,
    maximumDiscount,
    startDate,
    endDate,
    usageLimit,
    status,
  } = couponData;

  const existingCoupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (existingCoupon) {
    throw new Error("Coupon code already exists");
  }

  if (new Date(endDate) < new Date(startDate)) {
    throw new Error("End date cannot be before start date");
  }

  if (
    discountType === "percentage" &&
    (discountValue < 1 || discountValue > 100)
  ) {
    throw new Error(
      "Percentage discount must be between 1 and 100"
    );
  }

  if (
    discountType === "fixed" ||
    discountType === "flat" ||
    discountType === "Fixed Amount"
  ) {
    if (Number(minimumPurchase) <= Number(discountValue)) {
      throw new Error(
        "Minimum purchase amount must be greater than the discount amount."
      );
    }
  } else if (
    discountType === "percentage" &&
    maximumDiscount !== null &&
    maximumDiscount !== "" &&
    maximumDiscount !== undefined
  ) {
    if (Number(minimumPurchase) <= Number(maximumDiscount)) {
      throw new Error(
        "Minimum purchase amount must be strictly greater than the maximum discount cap."
      );
    }
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minimumPurchase,
    maximumDiscount:
      maximumDiscount === "" ||
      maximumDiscount === undefined
        ? null
        : maximumDiscount,
    startDate,
    endDate,
    usageLimit:
      usageLimit === "" ||
      usageLimit === undefined
        ? null
        : usageLimit,
    status: status ?? true,
  });

  return coupon;
};

// GET ALL COUPONS
export const getAllCoupons = async () => {
  const coupons = await Coupon.find()
    .sort({ createdAt: -1 });

  return coupons;
};

// GET SINGLE COUPON
export const getCouponById = async (id) => {
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  return coupon;
};

// UPDATE COUPON
export const updateCoupon = async (id, couponData) => {
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  const {
    code,
    discountType,
    discountValue,
    minimumPurchase,
    maximumDiscount,
    startDate,
    endDate,
    usageLimit,
    status,
  } = couponData;

  if (code) {
    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase(),
      _id: { $ne: id },
    });

    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }

    coupon.code = code.toUpperCase();
  }

  if (discountType !== undefined) {
    coupon.discountType = discountType;
  }

  if (discountValue !== undefined) {
    coupon.discountValue = discountValue;
  }

  if (minimumPurchase !== undefined) {
    coupon.minimumPurchase = minimumPurchase;
  }

  if (maximumDiscount !== undefined) {
    coupon.maximumDiscount =
      maximumDiscount === ""
        ? null
        : maximumDiscount;
  }

  if (startDate !== undefined) {
    coupon.startDate = startDate;
  }

  if (endDate !== undefined) {
    coupon.endDate = endDate;
  }

  if (usageLimit !== undefined) {
    coupon.usageLimit =
      usageLimit === ""
        ? null
        : usageLimit;
  }

  if (status !== undefined) {
    coupon.status = status;
  }

  if (
    new Date(coupon.endDate) <
    new Date(coupon.startDate)
  ) {
    throw new Error(
      "End date cannot be before start date"
    );
  }

  if (
    coupon.discountType === "percentage" &&
    (coupon.discountValue < 1 ||
      coupon.discountValue > 100)
  ) {
    throw new Error(
      "Percentage discount must be between 1 and 100"
    );
  }

  if (
    coupon.discountType === "fixed" ||
    coupon.discountType === "flat" ||
    coupon.discountType === "Fixed Amount"
  ) {
    if (Number(coupon.minimumPurchase) <= Number(coupon.discountValue)) {
      throw new Error(
        "Minimum purchase amount must be greater than the discount amount."
      );
    }
  } else if (
    coupon.discountType === "percentage" &&
    coupon.maximumDiscount !== null &&
    coupon.maximumDiscount !== undefined
  ) {
    if (Number(coupon.minimumPurchase) <= Number(coupon.maximumDiscount)) {
      throw new Error(
        "Minimum purchase amount must be strictly greater than the maximum discount cap."
      );
    }
  }

  await coupon.save();

  return coupon;
};

// DELETE COUPON
export const deleteCoupon = async (id) => {
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  await Coupon.findByIdAndDelete(id);

  return coupon;
};

// UPDATE COUPON STATUS
export const updateCouponStatus = async (
  id,
  status
) => {
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  coupon.status = status;

  await coupon.save();

  return coupon;
};