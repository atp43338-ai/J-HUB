import Coupon from "../../admin/coupon/models/Coupon.js";

// APPLY COUPON
export const applyCouponService = async (
  code,
  subtotal
) => {
  // CHECK COUPON CODE
  if (!code) {
    throw new Error("Coupon code is required");
  }

  // CHECK SUBTOTAL
  if (!subtotal || subtotal <= 0) {
    throw new Error("Invalid subtotal");
  }

  // FIND COUPON
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  // CHECK COUPON STATUS
  if (!coupon.status) {
    throw new Error("Coupon is inactive");
  }

  // CHECK DATE
  const now = new Date();

  if (
    now < coupon.startDate ||
    now > coupon.endDate
  ) {
    throw new Error("Coupon is expired or not active yet");
  }

  // CHECK USAGE LIMIT
  if (
    coupon.usageLimit !== null &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    throw new Error("Coupon usage limit reached");
  }

  // CHECK MINIMUM PURCHASE
  if (subtotal < coupon.minimumPurchase) {
    throw new Error(
      `Minimum purchase of ₹${coupon.minimumPurchase} is required`
    );
  }

  // CALCULATE DISCOUNT
  let couponDiscount = 0;

  if (coupon.discountType === "percentage") {
    couponDiscount =
      (subtotal * coupon.discountValue) / 100;

    // APPLY MAXIMUM DISCOUNT
    if (
      coupon.maximumDiscount !== null &&
      couponDiscount > coupon.maximumDiscount
    ) {
      couponDiscount = coupon.maximumDiscount;
    }
  }

  if (coupon.discountType === "fixed") {
    couponDiscount = coupon.discountValue;
  }

  // DISCOUNT CANNOT BE MORE THAN SUBTOTAL
  if (couponDiscount > subtotal) {
    couponDiscount = subtotal;
  }

  couponDiscount = Math.round(couponDiscount);

  // FINAL AMOUNT
  const finalAmount =
    subtotal - couponDiscount;

  return {
    couponId: coupon._id,
    couponCode: coupon.code,
    couponDiscount,
    finalAmount,
  };
};


// GET AVAILABLE COUPONS

export const getAvailableCouponsService = async () => {
  const now = new Date();

  const coupons = await Coupon.find({
    status: true,

    startDate: {
      $lte: now,
    },

    endDate: {
      $gte: now,
    },

    $or: [
      {
        usageLimit: null,
      },
      {
        $expr: {
          $lt: [
            "$usedCount",
            "$usageLimit",
          ],
        },
      },
    ],
  }).sort({
    createdAt: -1,
  });

  return coupons;
};