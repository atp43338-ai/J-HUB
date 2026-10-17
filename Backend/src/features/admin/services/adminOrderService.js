import mongoose from "mongoose";
import Order from "../../order/models/Order.js";
import Product from "../../product/models/Product.js";
import { addMoneyToWallet } from "../../wallet/services/walletService.js";

import {
  applyReferralRewardService,
} from "../../referral/services/referralService.js";
import { recordPaymentCredit } from "../../order/services/orderService.js";


// GET ALL ORDERS FOR ADMIN

export const getAllOrdersForAdminService = async () => {
  const orders = await Order.find()
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });

  return orders;
};


// GET SINGLE ORDER FOR ADMIN

export const getSingleOrderForAdminService = async (
  orderId
) => {
  let order = null;

  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await Order.findById(orderId)
      .populate("user", "name email phone")
      .populate("items.product", "name images price");
  }

  if (!order) {
    order = await Order.findOne({ orderId })
      .populate("user", "name email phone")
      .populate("items.product", "name images price");
  }

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};



// UPDATE ORDER STATUS

export const updateOrderStatusForAdminService = async (
  orderId,
  status
) => {
  const allowedStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const targetStatus = String(status || "").toLowerCase().trim();

  // Check valid status
  if (!allowedStatuses.includes(targetStatus)) {
    throw new Error("Invalid order status");
  }

  // Find order
  let order = null;
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await Order.findById(orderId);
  }
  if (!order) {
    order = await Order.findOne({
      orderId,
    });
  }

  if (!order) {
    throw new Error("Order not found");
  }

  const currentStatus = String(order.status || "").toLowerCase().trim();

  // If already at the requested status, return early
  if (currentStatus === targetStatus) {
    return order;
  }

  // Sequential transition guard
  const allowedTransitions = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
    // Legacy support for older existing orders
    out_for_delivery: ["delivered"],
    returned: [],
  };

  const allowedNext = allowedTransitions[currentStatus] || [];
  if (!allowedNext.includes(targetStatus)) {
    throw new Error(
      `Cannot change status from ${currentStatus} to ${targetStatus}`
    );
  }

  const previousStatus = order.status;

  // Update status
  order.status = targetStatus;

  // If order is cancelled
  if (targetStatus === "cancelled" && previousStatus !== "cancelled") {
    order.cancelledAt = new Date();

    const isCod =
      String(order.paymentMethod || "").toUpperCase() === "COD" ||
      String(order.paymentMethod || "").toLowerCase() === "cash on delivery";
    const isDelivered = previousStatus === "delivered";

    // STRICT REFUND: If COD and NOT delivered, customer never paid: ₹0 refund!
    const isPaid = !isCod || isDelivered;

    // RESTORE STOCK
    for (const item of order.items) {
      if (item.cancelled) continue;

      const product = await Product.findById(item.product);
      if (product) {
        const variant = product.variants.find((v) => v.size === item.size);
        if (variant) {
          variant.stock += item.quantity;
          await product.save();
        }
      }

      item.cancelled = true;
      item.cancelledAt = new Date();
      item.cancellationReason = "Cancelled by admin";
      if (isPaid) {
        item.isRefunded = true;
        item.refundAmount = Number(item.total || 0);
      } else {
        item.isRefunded = false;
        item.refundAmount = 0;
      }
    }

    let refundAmount = 0;
    if (isPaid) {
      refundAmount = Math.max(0, Number(order.finalPrice || 0));
    }

    const refundReason = `Admin order cancellation refund (${order.orderId})`;

    if (isPaid && refundAmount > 0) {
      await addMoneyToWallet(
        order.user,
        refundAmount,
        refundReason,
        order._id
      );
      order.paymentStatus = "refunded";
      order.isRefunded = true;
    } else {
      order.isRefunded = false;
    }

    order.finalPrice = 0;
    order.totalAmount = 0;
    order.finalAmount = 0;
  } else if (targetStatus === "delivered") {
    order.cancelledAt = null;

    const isCod =
      String(order.paymentMethod || "").toUpperCase() === "COD" ||
      String(order.paymentMethod || "").toLowerCase() === "cash on delivery";

    if (isCod) {
      const isAlreadyCompleted =
        ["completed", "paid"].includes(String(order.paymentStatus || "").toLowerCase());

      // Idempotency check: only credit and mark Completed once when COD is Delivered
      if (!isAlreadyCompleted) {
        order.paymentStatus = "Completed";
        order.paidAt = new Date();
        order.revenueCredited = true;
        order.revenueCreditedAt = new Date();

        // Credit revenue / process payment settlement logic
        await recordPaymentCredit(
          order._id,
          order.finalPrice || order.finalAmount || order.totalAmount || 0,
          "COD Payment Received on Delivery"
        );
      }
    } else {
      // Online Payment (Razorpay / Prepaid / Wallet)
      // Idempotency check: If order.paymentMethod !== 'COD' and order.paymentStatus === 'Completed',
      // do NOT trigger additional payment crediting or balance increments.
      const isAlreadyCompleted =
        ["completed", "paid"].includes(String(order.paymentStatus || "").toLowerCase());

      if (!isAlreadyCompleted) {
        order.paymentStatus = "Completed";
        if (!order.paidAt) {
          order.paidAt = new Date();
        }
        order.revenueCredited = true;
        order.revenueCreditedAt = new Date();

        await recordPaymentCredit(
          order._id,
          order.finalPrice || order.finalAmount || order.totalAmount || 0,
          "Online Payment Settlement"
        );
      }
    }
  } else {
    order.cancelledAt = null;
  }

  await order.save();

  // APPLY REFERRAL REWARD
  // Only when order becomes delivered
  if (
    targetStatus === "delivered" &&
    previousStatus !== "delivered"
  ) {
    await applyReferralRewardService(
      order.user,
      order
    );
  }

  // Return updated order
  const updatedOrder = await Order.findById(order._id)
    .populate("user", "name email phone")
    .populate("items.product");

  return updatedOrder;
};