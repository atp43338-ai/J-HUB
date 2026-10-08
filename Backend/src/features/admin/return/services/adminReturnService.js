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


  // ---------------------------------------------------
  // 6. CALCULATE REFUND AMOUNT
  // ---------------------------------------------------

  const refundAmount =
    Number(order.finalPrice || 0);

  if (refundAmount <= 0) {
    throw new Error(
      "Invalid refund amount"
    );
  }


  // ---------------------------------------------------
  // 7. RESTORE PRODUCT STOCK
  // ---------------------------------------------------

  for (const item of order.items) {

    // Do not restore stock for
    // already cancelled items
    if (item.cancelled) {
      continue;
    }


    const product =
      await Product.findById(
        item.product
      );

    // Product may have been deleted
    if (!product) {
      continue;
    }


    // Find matching size variant
    const variant =
      product.variants.find(
        (variant) =>
          variant.size === item.size
      );


    if (variant) {

      variant.stock += item.quantity;

      await product.save();
    }
  }


  // ---------------------------------------------------
  // 8. REFUND MONEY TO WALLET
  // ---------------------------------------------------

  await addMoneyToWallet(
    order.user,
    refundAmount,
    `Refund for returned order ${order.orderId}`,
    order._id,
    returnRequest._id
  );


  // ---------------------------------------------------
  // 9. MARK REFUND AS PROCESSED
  // ---------------------------------------------------

  returnRequest.refundProcessed = true;

  returnRequest.refundAmount =
    refundAmount;

  returnRequest.refundedAt =
    new Date();


  // ---------------------------------------------------
  // 10. UPDATE RETURN STATUS
  // ---------------------------------------------------

  returnRequest.status = "approved";


  // ---------------------------------------------------
  // 11. UPDATE ORDER
  // ---------------------------------------------------

  order.status = "returned";

  order.returnReason =
    returnRequest.reason;

  order.returnedAt =
    new Date();


  // ---------------------------------------------------
  // 12. SAVE ORDER
  // ---------------------------------------------------

  await order.save();


  // ---------------------------------------------------
  // 13. SAVE RETURN REQUEST
  // ---------------------------------------------------

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