import mongoose from "mongoose";
import Order from "../../order/models/Order.js";
import {
  getAllOrdersForAdminService,
  getSingleOrderForAdminService,
  updateOrderStatusForAdminService,
} from "../services/adminOrderService.js";

// GET ALL ORDERS
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await getAllOrdersForAdminService();

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Get admin orders error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

// GET SINGLE ORDER DETAILS (handles both MongoDB ObjectId and orderId string)
export const getAdminOrderDetails = async (req, res) => {
  try {
    const id = req.params.id || req.params.orderId;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID parameter is required",
      });
    }

    let order = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id)
        .populate("user", "name email phone")
        .populate("items.product", "name images price");
    }

    if (!order) {
      order = await Order.findOne({ orderId: id })
        .populate("user", "name email phone")
        .populate("items.product", "name images price");
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("getAdminOrderDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching order",
    });
  }
};

// Alias for backwards compatibility
export const getSingleOrderForAdmin = getAdminOrderDetails;

// UPDATE ORDER STATUS
export const updateOrderStatusForAdmin = async (req, res) => {
  try {
    const id = req.params.id || req.params.orderId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const order = await updateOrderStatusForAdminService(id, status);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update admin order status error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};