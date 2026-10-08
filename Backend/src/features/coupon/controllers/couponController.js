import {
  applyCouponService,
  getAvailableCouponsService,
} from "../services/couponService.js";

// APPLY COUPON
export const applyCouponController = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    const result = await applyCouponService(
      code,
      subtotal
    );

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      ...result,
    });
  } catch (error) {
    console.error("Apply coupon error:", error);

    res.status(400).json({
      success: false,
      message:
        error.message || "Failed to apply coupon",
    });
  }
};



// GET AVAILABLE COUPONS

export const getAvailableCouponsController =
  async (req, res) => {
    try {
      const coupons =
        await getAvailableCouponsService();

      res.status(200).json({
        success: true,
        coupons,
      });
    } catch (error) {
      console.error(
        "Get available coupons error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch available coupons",
      });
    }
  };