import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
} from "../services/adminCouponService.js";

// CREATE COUPON
export const createCouponController = async (req, res) => {
  try {
    const coupon = await createCoupon(req.body);

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create coupon",
    });
  }
};

// GET ALL COUPONS
export const getAllCouponsController = async (req, res) => {
  try {
    const coupons = await getAllCoupons();

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error("Get coupons error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch coupons",
    });
  }
};

// GET SINGLE COUPON
export const getCouponByIdController = async (req, res) => {
  try {
    const coupon = await getCouponById(req.params.id);

    res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error("Get coupon error:", error);

    res.status(404).json({
      success: false,
      message: error.message || "Coupon not found",
    });
  }
};

// UPDATE COUPON
export const updateCouponController = async (req, res) => {
  try {
    const coupon = await updateCoupon(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to update coupon",
    });
  }
};

// DELETE COUPON
export const deleteCouponController = async (req, res) => {
  try {
    await deleteCoupon(req.params.id);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);

    res.status(404).json({
      success: false,
      message: error.message || "Failed to delete coupon",
    });
  }
};

// UPDATE COUPON STATUS
export const updateCouponStatusController = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const coupon = await updateCouponStatus(
      req.params.id,
      status
    );

    res.status(200).json({
      success: true,
      message: status
        ? "Coupon activated successfully"
        : "Coupon deactivated successfully",
      coupon,
    });
  } catch (error) {
    console.error(
      "Update coupon status error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update coupon status",
    });
  }
};