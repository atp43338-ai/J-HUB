import mongoose from "mongoose";
import Order from "../models/Order.js";
import { createRazorpayOrder } from "../../payment/services/razorpayService.js";
import {
  createOrderService,
  getOrderByIdService,
  getOrdersService,
  cancelOrderService,
  cancelOrderItemService,
  createFailedPaymentOrderService,
  retryPaymentOrderService,
  completeRetryPaymentOrderService,
} from "../services/orderService.js";

// CREATE ORDER

export const createOrder = async (req, res) => {
  try {
    const {
      addressId,
      paymentMethod,
      items,
      couponcode,
      couponCode = couponcode,
    } = req.body;

    // BASIC VALIDATION

    if (!addressId) {
      return res.status(400).json({
        message: "Address is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required",
      });
    }

    // CREATE ORDER
    
    const order = await createOrderService(
      req.user.id,
      {
        addressId,
        paymentMethod,
        items,
        couponCode,
      }
    );

    // SUCCESS RESPONSE

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",

      order: {
        _id: order._id,
        orderId: order.orderId,
        total: order.finalPrice,
        finalPrice: order.finalPrice,
        finalAmount: order.finalPrice,
        totalAmount: order.finalPrice,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
      },
    });

  } catch (error) {

    console.error(
      "Create order error:",
      error
    );

    return res.status(400).json({
      message: error.message,
    });
  }
};


// CREATE FAILED PAYMENT ORDER

export const createFailedPaymentOrder = async (
  req,
  res
) => {
  try {
    const {
      addressId,
      paymentMethod,
      items,
      couponCode,
    } = req.body;

    // BASIC VALIDATION

    if (!addressId) {
      return res.status(400).json({
        message: "Address is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required",
      });
    }

    // CREATE FAILED PAYMENT ORDER

    const order =
      await createFailedPaymentOrderService(
        req.user.id,
        {
          addressId,
          paymentMethod,
          items,
          couponCode,
        }
      );

    return res.status(201).json({
      message: "Payment failed order created",
      order: {
        _id: order._id,
        orderId: order.orderId,
        total: order.finalPrice,
        finalPrice: order.finalPrice,
        finalAmount: order.finalPrice,
        totalAmount: order.finalPrice,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentRetryExpiresAt:
          order.paymentRetryExpiresAt,
      },
    });

  } catch (error) {

    console.error(
      "Create failed payment order error:",
      error
    );

    return res.status(400).json({
      message: error.message,
    });
  }
};


// RETRY PAYMENT ORDER (WITH 5-MINUTE WINDOW GUARD & RAZORPAY INSTANCE)
export const retryPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findOne({
      $or: [
        { orderId },
        { _id: mongoose.isValidObjectId(orderId) ? orderId : null },
      ],
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify whether Date.now() - new Date(order.createdAt).getTime() <= 5 * 60 * 1000
    const createdAtTime = order.createdAt
      ? new Date(order.createdAt).getTime()
      : Date.now();
    const isExpired =
      Date.now() - createdAtTime > 5 * 60 * 1000 ||
      order.paymentStatus === "Expired";

    if (isExpired) {
      order.status = "Payment Failed";
      order.orderStatus = "Payment Failed";
      order.paymentStatus = "Expired";
      await order.save();

      return res.status(400).json({
        success: false,
        message: "Payment retry window expired",
      });
    }

    // Within 5 minutes: generate a fresh razorpay.orders.create instance
    const amount = Number(
      order.finalPrice ?? order.totalAmount ?? order.finalAmount ?? 0
    );
    const receipt = `retry_${order.orderId}_${Date.now().toString().slice(-6)}`;
    const razorpayOrder = await createRazorpayOrder(amount, receipt);

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment retry allowed",
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
      orderDetails: {
        _id: order._id,
        orderId: order.orderId,
        total: order.finalPrice,
        finalPrice: order.finalPrice,
        finalAmount: order.finalPrice,
        totalAmount: order.finalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        orderStatus: order.status,
        createdAt: order.createdAt,
        paymentRetryExpiresAt: order.paymentRetryExpiresAt,
      },
    });
  } catch (error) {
    console.error("Retry payment error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to retry payment",
    });
  }
};

// MARK ORDER AS PAYMENT FAILED
export const markOrderFailed = async (req, res) => {
  try {
    const orderId = req.params.orderId || req.body.orderId;
    const { reason, error } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findOne({
      $or: [
        { orderId },
        { _id: mongoose.isValidObjectId(orderId) ? orderId : null },
      ],
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const createdAtTime = order.createdAt
      ? new Date(order.createdAt).getTime()
      : Date.now();
    const isExpired = Date.now() - createdAtTime > 5 * 60 * 1000;

    order.status = "Payment Failed";
    order.orderStatus = "Payment Failed";
    order.paymentStatus = isExpired ? "Expired" : "failed";
    if (reason || error) {
      order.cancellationReason =
        reason ||
        (typeof error === "string" ? error : error?.description) ||
        "Payment failed";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order marked as payment failed",
      order,
    });
  } catch (error) {
    console.error("Mark order failed error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to mark order as failed",
    });
  }
};


// GET ORDER BY ID

export const getOrderById = async (
  req,
  res
) => {
  try {
    const { orderId } = req.params;

    const order =
      await getOrderByIdService(
        req.user.id,
        orderId
      );

    return res.status(200).json({
      message: "Order fetched successfully",
      order,
    });

  } catch (error) {

    console.error(
      "Get order error:",
      error
    );

    return res.status(404).json({
      message: error.message,
    });
  }
};


// GET ALL USER ORDERS

export const getOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await getOrdersService(
        req.user.id
      );

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });

  } catch (error) {

    console.error(
      "Get orders error:",
      error
    );

    return res.status(400).json({
      message: error.message,
    });
  }
};


// CANCEL ORDER

export const cancelOrder = async (
  req,
  res
) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order =
      await cancelOrderService(
        req.user.id,
        orderId,
        reason
      );

    return res.status(200).json({
      message:
        "Order cancelled successfully",
      order,
    });

  } catch (error) {

    console.error(
      "Cancel order error:",
      error
    );

    return res.status(400).json({
      message: error.message,
    });
  }
};


// CANCEL SPECIFIC ORDER ITEM

export const cancelOrderItem = async (
  req,
  res
) => {
  try {
    const {
      orderId,
      itemId,
    } = req.params;

    const { reason } = req.body;

    const order =
      await cancelOrderItemService(
        req.user.id,
        orderId,
        itemId,
        reason
      );

    return res.status(200).json({
      message:
        "Product cancelled successfully",
      order,
    });

  } catch (error) {

    console.error(
      "Cancel order item error:",
      error
    );

    return res.status(400).json({
      message: error.message,
    });
  }
};

export const completeRetryPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    const order = await completeRetryPaymentOrderService(
      req.user.id,
      orderId
    );

    return res.status(200).json({
      success: true,
      message: "Payment completed successfully",
      order: {
        _id: order._id,
        orderId: order.orderId,
        total: order.finalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Complete retry payment error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to complete payment",
    });
  }
};