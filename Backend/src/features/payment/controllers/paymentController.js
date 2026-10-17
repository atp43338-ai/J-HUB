import mongoose from "mongoose";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../services/razorpayService.js";
import Order from "../../order/models/Order.js";
import { recordPaymentCredit } from "../../order/services/orderService.js";

export const createPaymentOrder = async (
  req,
  res
) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid payment amount",
      });
    }

    const receipt = `JHUB-${Date.now()}`;

    const razorpayOrder =
      await createRazorpayOrder(
        amount,
        receipt
      );

    return res.status(201).json({
      success: true,
      message:
        "Payment order created successfully",
      key_id: process.env.RAZORPAY_KEY_ID,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
    });
  } catch (error) {
    console.error(
      "Create payment order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create payment order",
    });
  }
};

// VERIFY PAYMENT

export const verifyPayment = async (
  req,
  res
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
    }

    const isValid =
      verifyRazorpayPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // If an existing order is associated with this Razorpay order, mark Completed and credit revenue immediately
    const targetOrderId = req.body.orderId;
    const queryConditions = [];
    if (targetOrderId && mongoose.Types.ObjectId.isValid(targetOrderId)) {
      queryConditions.push({ _id: targetOrderId });
    }
    if (targetOrderId) {
      queryConditions.push({ orderId: targetOrderId });
    }
    if (razorpay_order_id) {
      queryConditions.push({ razorpayOrderId: razorpay_order_id });
    }

    if (queryConditions.length > 0) {
      const order = await Order.findOne({ $or: queryConditions });
      if (order) {
        const isAlreadyPaid = ["completed", "paid"].includes(String(order.paymentStatus || "").toLowerCase());
        if (!isAlreadyPaid) {
          order.paymentStatus = "Completed";
          order.paidAt = new Date();
          order.revenueCredited = true;
          order.revenueCreditedAt = new Date();
          if (["pending", "failed", "payment failed", "payment_failed"].includes(String(order.status || "").toLowerCase())) {
            order.status = "processing";
          }
          await order.save();

          await recordPaymentCredit(
            order._id,
            order.finalPrice || order.finalAmount || order.totalAmount || 0,
            "Razorpay Payment Verified & Credited"
          );
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Payment verification failed",
    });
  }
};