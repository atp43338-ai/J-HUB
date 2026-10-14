import mongoose from "mongoose";
import Order from "../../order/models/Order.js";
import Product from "../../product/models/Product.js";
import { addMoneyToWallet } from "../../wallet/services/walletService.js";

import {
  applyReferralRewardService,
} from "../../referral/services/referralService.js";


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
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  // Check status

  if (!allowedStatuses.includes(status)) {
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


  // PREVENT DUPLICATE REFERRAL REWARD

  const previousStatus = order.status;


  // Update status

  order.status = status;


  // If order is cancelled
  if (status === "cancelled" && previousStatus !== "cancelled") {
    order.cancelledAt = new Date();

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
    }

    // STRICT REFUND: Refund only if order was prepaid or paid
    const isPaid =
      order.paymentStatus === "paid" ||
      (order.paymentMethod && order.paymentMethod !== "COD");

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
    }

    order.finalPrice = 0;
  } else if (status === "delivered") {
    order.cancelledAt = null;
    // When COD order is delivered, it is paid in cash
    if (order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
    }
  } else {
    order.cancelledAt = null;
  }

  await order.save();


  // APPLY REFERRAL REWARD
  // Only when order becomes delivered

  if (
    status === "delivered" &&
    previousStatus !== "delivered"
  ) {
    await applyReferralRewardService(
      order.user,
      order
    );
  }


  // Return updated order

  const updatedOrder = await Order.findOne({
    orderId,
  })
    .populate("user", "name email phone")
    .populate("items.product");

  return updatedOrder;
};