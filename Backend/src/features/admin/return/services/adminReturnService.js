import Return from "../../../order/models/Return.js";
import Order from "../../../order/models/Order.js";
import Product from "../../../product/models/Product.js";

import {
  addMoneyToWallet,
} from "../../../wallet/services/walletService.js";


// =====================================================
// GET ALL RETURN REQUESTS
// =====================================================

export const getAllReturnsService = async () => {
  const returns = await Return.find()
    .populate("user", "name email")
    .populate("order")
    .sort({ createdAt: -1 });

  return returns;
};


// =====================================================
// APPROVE RETURN
// =====================================================

export const approveReturnService = async (returnId) => {

  // ---------------------------------------------------
  // 1. FIND RETURN REQUEST
  // ---------------------------------------------------

  const returnRequest =
    await Return.findById(returnId);

  if (!returnRequest) {
    throw new Error(
      "Return request not found"
    );
  }


  // ---------------------------------------------------
  // 2. CHECK RETURN STATUS
  // ---------------------------------------------------

  if (returnRequest.status !== "requested") {
    throw new Error(
      "Return request has already been processed"
    );
  }


  // ---------------------------------------------------
  // 3. CHECK REFUND STATUS
  // ---------------------------------------------------

  if (returnRequest.refundProcessed) {
    throw new Error(
      "Refund has already been processed for this return"
    );
  }


  // ---------------------------------------------------
  // 4. FIND ORDER
  // ---------------------------------------------------

  const order =
    await Order.findById(
      returnRequest.order
    );

  if (!order) {
    throw new Error(
      "Order not found"
    );
  }


  // ---------------------------------------------------
  // 5. ONLY DELIVERED ORDERS CAN BE RETURNED
  // ---------------------------------------------------

  if (order.status !== "delivered") {
    throw new Error(
      "Only delivered orders can be returned"
    );
  }

  const isCod =
    String(order.paymentMethod || "").toUpperCase() === "COD" ||
    String(order.paymentMethod || "").toLowerCase() === "cash on delivery";

  // For COD orders that reached Delivered, cash has been collected so payment is completed
  if (isCod && order.paymentStatus !== "paid") {
    order.paymentStatus = "paid";
  }


  // ---------------------------------------------------
  // 6. CALCULATE STRICT NET PAID REFUND AMOUNT
  // ---------------------------------------------------

  let refundAmount = 0;
  const isSingleItemReturn = Boolean(returnRequest.item);

  if (isSingleItemReturn) {
    // Single item return
    const item = order.items.id(returnRequest.item);
    if (!item) {
      throw new Error("Returned order item not found");
    }

    const activeItems = order.items.filter((it) => !it.cancelled);
    const activeItemsTotal = activeItems.reduce(
      (tot, it) => tot + Number(it.total || 0),
      0
    );

    const itemTotal = Number(item.total || 0);
    const currentCouponDiscount = Number(order.couponDiscount || 0);

    let couponShare = 0;
    if (activeItemsTotal > 0 && currentCouponDiscount > 0) {
      couponShare = (itemTotal / activeItemsTotal) * currentCouponDiscount;
    }
    couponShare = Math.round(couponShare * 100) / 100;
    couponShare = Math.min(couponShare, itemTotal);

    refundAmount = Math.max(0, Math.round((itemTotal - couponShare) * 100) / 100);

    // Mark the item as returned and refunded
    item.cancelled = true;
    item.isRefunded = true;
    item.refundAmount = refundAmount;
    item.cancelledAt = new Date();
    item.cancellationReason = returnRequest.reason || "Returned";

    // Restore stock for this single returned item
    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.find(
        (v) => v.size === item.size
      );
      if (variant) {
        variant.stock += item.quantity;
        await product.save();
      }
    }

    // If all items are now cancelled/returned, transition whole order to returned
    const remainingActive = order.items.filter((it) => !it.cancelled);
    if (remainingActive.length === 0) {
      order.status = "returned";
      order.returnReason = returnRequest.reason;
      order.returnedAt = new Date();
      order.finalPrice = 0;
      order.paymentStatus = "refunded";
      order.isRefunded = true;
    }
  } else {
    // Full order return: refund net amount paid
    refundAmount = Math.max(0, Number(order.finalPrice || 0));

    // Restore product stock for all active items
    for (const item of order.items) {
      if (item.cancelled) {
        continue;
      }

      const product = await Product.findById(item.product);
      if (!product) {
        continue;
      }

      const variant = product.variants.find(
        (v) => v.size === item.size
      );

      if (variant) {
        variant.stock += item.quantity;
        await product.save();
      }

      item.cancelled = true;
      item.isRefunded = true;
      item.refundAmount = Number(item.total || 0);
      item.cancelledAt = new Date();
      item.cancellationReason = returnRequest.reason || "Order returned";
    }

    order.status = "returned";
    order.returnReason = returnRequest.reason;
    order.returnedAt = new Date();
    order.finalPrice = 0;
    order.paymentStatus = "refunded";
    order.isRefunded = true;
  }

  refundAmount = Math.round(refundAmount * 100) / 100;

  if (refundAmount <= 0) {
    throw new Error("Invalid refund amount: net paid amount is 0");
  }

  // ---------------------------------------------------
  // 7. REFUND MONEY TO WALLET
  // ---------------------------------------------------

  const refundDescription = isCod
    ? `Refund for returned ${isSingleItemReturn ? "item" : "order"} (COD delivered) - Order #${order.orderId}`
    : `Refund for returned ${isSingleItemReturn ? "item" : "order"} - Order #${order.orderId}`;

  await addMoneyToWallet(
    order.user,
    refundAmount,
    refundDescription,
    order._id,
    returnRequest._id
  );

  // ---------------------------------------------------
  // 8. MARK REFUND AS PROCESSED
  // ---------------------------------------------------

  returnRequest.refundProcessed = true;
  returnRequest.refundAmount = refundAmount;
  returnRequest.refundedAt = new Date();
  returnRequest.status = "approved";

  // ---------------------------------------------------
  // 9. SAVE CHANGES
  // ---------------------------------------------------

  await order.save();
  await returnRequest.save();


  // ---------------------------------------------------
  // 14. RETURN UPDATED REQUEST
  // ---------------------------------------------------

  return returnRequest;
};


// =====================================================
// REJECT RETURN
// =====================================================

export const rejectReturnService = async (
  returnId
) => {

  // ---------------------------------------------------
  // 1. FIND RETURN REQUEST
  // ---------------------------------------------------

  const returnRequest =
    await Return.findById(returnId);

  if (!returnRequest) {
    throw new Error(
      "Return request not found"
    );
  }


  // ---------------------------------------------------
  // 2. CHECK RETURN STATUS
  // ---------------------------------------------------

  if (returnRequest.status !== "requested") {
    throw new Error(
      "Return request has already been processed"
    );
  }


  // ---------------------------------------------------
  // 3. REJECT RETURN
  // ---------------------------------------------------

  returnRequest.status = "rejected";


  // ---------------------------------------------------
  // 4. SAVE RETURN
  // ---------------------------------------------------

  await returnRequest.save();


  // ---------------------------------------------------
  // 5. RETURN UPDATED REQUEST
  // ---------------------------------------------------

  return returnRequest;
};