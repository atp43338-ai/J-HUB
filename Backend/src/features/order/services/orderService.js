import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../../product/models/Product.js";
import Address from "../../address/models/Address.js";
import Offer from "../../admin/offer/models/Offer.js";
import Coupon from "../../admin/coupon/models/Coupon.js";

import {
  removePurchasedItemsFromCartService,
} from "../../cart/services/cartService.js";

import {
  addMoneyToWallet,
  getOrCreateWallet,
} from "../../wallet/services/walletService.js";

export { applyReferralRewardService } from "../../referral/services/referralService.js";

// GENERATE ORDER ID
const generateOrderId = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  const randomNumber = Math.floor(
    10000 + Math.random() * 90000
  );

  return `JHUB-${year}${month}${day}-${randomNumber}`;
};


// CREATE ORDER

export const createOrderService = async (
  userId,
  orderData
) => {
  const {
    addressId,
    paymentMethod,
    items,
    couponCode,
  } = orderData;


  // CHECK ITEMS

  if (!items || items.length === 0) {
    throw new Error("Order items are required");
  }


  // CHECK PAYMENT METHOD

  const normalizedPaymentMethod = (paymentMethod || "").toUpperCase();

  if (!["COD", "UPI", "CARD", "WALLET"].includes(normalizedPaymentMethod)) {
    throw new Error("Invalid payment method");
  }


  // FIND USER ADDRESS

  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }


  // PREPARE ORDER ITEMS

  const orderItems = [];

  let subtotal = 0;

  let discount = 0;


  // CHECK EACH PRODUCT

  for (const item of items) {

    const {
      productId,
      size,
      quantity,
    } = item;


    // Validate quantity

    if (!quantity || quantity < 1) {
      throw new Error("Invalid quantity");
    }


    // Find product

    const product = await Product.findById(
      productId
    );

    if (!product) {
      throw new Error("Product not found");
    }


    // Check product availability

    if (
      product.isBlocked ||
      !product.isListed
    ) {
      throw new Error(
        `${product.name} is not available`
      );
    }


    // Find selected size

    const variant = product.variants.find(
      (variant) =>
        variant.size === size
    );

    if (!variant) {
      throw new Error(
        `Size ${size} is not available for ${product.name}`
      );
    }


    // Check stock

    if (variant.stock < quantity) {
      throw new Error(
        `Not enough stock for ${product.name} - Size ${size}`
      );
    }


    // FIND ACTIVE PRODUCT + CATEGORY OFFERS

    const now = new Date();

    const offers = await Offer.find({
      status: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        {
          type: "Product",
          targetId: product._id,
        },
        {
          type: "Category",
          targetId: product.category,
        },
      ],
    });


    // FIND HIGHEST OFFER

    const highestOffer =
      offers.length > 0
        ? offers.reduce(
            (highest, current) =>
              current.discount > highest.discount
                ? current
                : highest
          )
        : null;



    // CALCULATE PRICE
    const originalPrice = Number(product.price) || 0;

    // Use highest active offer, or client item offer/discount, or product.discount
    const clientItemDiscount = Number(item.discount) || Number(item.unitDiscount) || 0;
    const clientItemPrice = Number(item.price);

    let discountPercentage = highestOffer
      ? Number(highestOffer.discount) || 0
      : Number(product.discount) || 0;

    let itemDiscount = Math.round(
      ((originalPrice * discountPercentage) / 100) * 100
    ) / 100;

    let itemPrice = Math.max(
      0,
      Math.round((originalPrice - itemDiscount) * 100) / 100
    );

    // If client supplied valid discounted unit price matching offer/discount, ensure it is honored
    if (
      Number.isFinite(clientItemPrice) &&
      clientItemPrice > 0 &&
      clientItemPrice < originalPrice &&
      itemPrice === originalPrice
    ) {
      itemPrice = clientItemPrice;
      itemDiscount = Math.round((originalPrice - itemPrice) * 100) / 100;
    } else if (
      itemDiscount === 0 &&
      clientItemDiscount > 0
    ) {
      itemDiscount = clientItemDiscount;
      itemPrice = Math.max(0, Math.round((originalPrice - itemDiscount) * 100) / 100);
    }

    discount = Math.round((discount + itemDiscount * quantity) * 100) / 100;

    // Calculate item total
    const itemTotal = Math.round(itemPrice * quantity * 100) / 100;

    subtotal += originalPrice * quantity;

    // Add item to order
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      size,
      quantity,
      price: itemPrice,
      originalPrice,
      unitDiscount: itemDiscount,
      total: itemTotal,
    });


    // DECREASE STOCK

    variant.stock -= quantity;

    await product.save();
  }


  // ==========================================
  // APPLY COUPON
  // ==========================================

  let couponDiscount = 0;

  let appliedCoupon = null;

  if (couponCode) {

    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
    });

    if (!coupon) {
      throw new Error("Invalid coupon code");
    }


    // CHECK COUPON STATUS

    if (!coupon.status) {
      throw new Error("Coupon is inactive");
    }


    // CHECK COUPON DATE

    const now = new Date();

    if (
      now < coupon.startDate ||
      now > coupon.endDate
    ) {
      throw new Error(
        "Coupon is expired or not active yet"
      );
    }


    // CHECK USAGE LIMIT

    if (
      coupon.usageLimit !== null &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      throw new Error(
        "Coupon usage limit reached"
      );
    }


    // IMPORTANT:
    // Coupon minimum purchase is checked
    // against the original subtotal.

    if (
      subtotal < coupon.minimumPurchase
    ) {
      throw new Error(
        `Minimum purchase of ₹${coupon.minimumPurchase} is required`
      );
    }


    // CALCULATE COUPON DISCOUNT

   if (coupon.discountType === "percentage") {
  const discountedSubtotal = subtotal - discount;

  couponDiscount =
    (discountedSubtotal * coupon.discountValue) / 100;

  if (
    coupon.maximumDiscount != null &&
    couponDiscount > coupon.maximumDiscount
  ) {
    couponDiscount = coupon.maximumDiscount;
  }
}


    // FIXED DISCOUNT

    if (
      coupon.discountType === "fixed"
    ) {
      couponDiscount =
        coupon.discountValue;
    }


    // COUPON DISCOUNT CANNOT
    // EXCEED DISCOUNTED PRICE

    const discountedSubtotal =
      subtotal - discount;

    if (
      couponDiscount >=
      discountedSubtotal
    ) {
      couponDiscount = Math.max(0, discountedSubtotal - 1);
    }

    couponDiscount =
      Math.round(couponDiscount);

    appliedCoupon = coupon;
  }

  // PRICE CALCULATION

  const tax = 0;

  const shipping = 0;

  const discountedSubtotal =
    Math.round((subtotal - discount) * 100) / 100;

  const finalPrice = Math.max(
    1,
    Math.round(
      (discountedSubtotal - couponDiscount + tax + shipping) * 100
    ) / 100
  );

  // VERIFY WALLET BALANCE IF PAYMENT METHOD IS WALLET
  let userWallet = null;
  if (normalizedPaymentMethod === "WALLET") {
    userWallet = await getOrCreateWallet(userId);
    if (!userWallet || Number(userWallet.balance || 0) < finalPrice) {
      // Revert product variant stock decrements done in previous loop
      for (const itm of orderItems) {
        await Product.updateOne(
          { _id: itm.product, "variants.size": itm.size },
          { $inc: { "variants.$.stock": itm.quantity } }
        );
      }
      throw new Error("Insufficient wallet balance");
    }
  }

  // CREATE UNIQUE ORDER ID

  let orderId = generateOrderId();

  let existingOrder = await Order.findOne({
    orderId,
  });

  while (existingOrder) {
    orderId = generateOrderId();

    existingOrder = await Order.findOne({
      orderId,
    });
  }


  // CHECK IF ONLINE PAYMENT OR COD
  const isOnlinePayment = ["WALLET", "UPI", "CARD"].includes(normalizedPaymentMethod);

  const initialPaymentStatus = isOnlinePayment ? "Completed" : "Pending";
  const paidAtDate = isOnlinePayment ? new Date() : null;
  const initialRevenueCredited = isOnlinePayment;
  const initialRevenueCreditedAt = isOnlinePayment ? new Date() : null;

  // CREATE ORDER
  const order = await Order.create({
    user: userId,
    orderId,
    items: orderItems,
    address: {
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    },
    paymentMethod: normalizedPaymentMethod,
    paymentStatus: initialPaymentStatus,
    paidAt: paidAtDate,
    revenueCredited: initialRevenueCredited,
    revenueCreditedAt: initialRevenueCreditedAt,
    subtotal,
    discount,
    coupon: appliedCoupon?._id || null,
    couponCode: appliedCoupon?.code || (couponCode ? couponCode.toUpperCase() : null),
    couponDiscount,
    couponMinPurchase: appliedCoupon?.minimumPurchase || 0,
    couponRevoked: false,
    tax,
    shipping,
    shippingFee: shipping,
    finalPrice,
    totalAmount: finalPrice,
    finalAmount: finalPrice,
    status: isOnlinePayment ? "processing" : "pending",
  });

  // Credit online payment immediately
  if (isOnlinePayment) {
    await recordPaymentCredit(
      order._id,
      finalPrice,
      `Online Payment (${normalizedPaymentMethod}) Verified & Credited Immediately`
    );
  }

// ATOMIC WALLET DEBIT
if (normalizedPaymentMethod === "WALLET" && userWallet) {
  userWallet.balance = Number(
    (Number(userWallet.balance) - finalPrice).toFixed(2)
  );
  userWallet.transactions.unshift({
    type: "debit",
    amount: finalPrice,
    reason: `Payment for Order #${orderId}`,
    description: `Payment for Order #${orderId}`,
    status: "Completed",
    order: order._id,
    date: new Date(),
  });
  await userWallet.save();
}

// REMOVE PURCHASED ITEMS FROM CART
await removePurchasedItemsFromCartService(userId, items);

// INCREASE COUPON USAGE COUNT
if (appliedCoupon) {
  appliedCoupon.usedCount += 1;
  await appliedCoupon.save();
}

return order;
};



// GET ORDER BY ID

export const getOrderByIdService = async (identifier, userId) => {
  let targetId = identifier;
  let targetUserId = userId;

  // Support reverse argument order if called as (userId, identifier)
  if (
    typeof userId === "string" &&
    userId.startsWith("JHUB-") &&
    typeof identifier === "string" &&
    !identifier.startsWith("JHUB-")
  ) {
    targetId = userId;
    targetUserId = identifier;
  }

  let query = {};

  // If valid 24-character hex ObjectId, search by _id or orderId:
  if (mongoose.Types.ObjectId.isValid(targetId)) {
    query = {
      $or: [
        { _id: targetId },
        { orderId: targetId }
      ]
    };
  } else {
    // Otherwise, query exclusively by the custom formatted string orderId
    query = { orderId: targetId };
  }

  // Restrict to the requesting user if userId is provided
  if (targetUserId) {
    query.user = targetUserId;
  }

  const order = await Order.findOne(query)
    .populate('items.product')
    .populate('user', 'name email phone')
    .populate('coupon');

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  // Ensure couponMinPurchase is available for older orders
  if (!order.couponMinPurchase && order.coupon?.minimumPurchase) {
    order.couponMinPurchase = order.coupon.minimumPurchase;
  } else if (!order.couponMinPurchase && order.couponCode) {
    const cp = await Coupon.findOne({ code: order.couponCode.toUpperCase() });
    if (cp) {
      order.couponMinPurchase = cp.minimumPurchase;
      if (!order.coupon) order.coupon = cp._id;
    }
  } else if (!order.couponMinPurchase && Number(order.couponDiscount || 0) > 0) {
    const cp = await Coupon.findOne({
      $or: [
        { discountValue: order.couponDiscount },
        { maximumDiscount: order.couponDiscount },
      ],
    });
    if (cp) {
      order.couponMinPurchase = cp.minimumPurchase;
      if (!order.couponCode) order.couponCode = cp.code;
    }
  }

  return order;
};



// GET ALL USER ORDERS

export const getOrdersService = async (userId) => {
  console.log("DATABASE:", Order.db.name);
  console.log("COLLECTION:", Order.collection.name);
  console.log("MONGO URI:", process.env.MONGO_URI);

  const now = new Date();

  await Order.updateMany(
    {
      user: userId,
      paymentStatus: { $in: ["failed", "Payment Failed", "payment_failed"] },
      $or: [
        { paymentRetryExpiresAt: { $lte: now } },
        { createdAt: { $lte: new Date(Date.now() - 5 * 60 * 1000) } },
      ],
    },
    {
      $set: {
        status: "Payment Failed",
        paymentStatus: "Expired",
      },
    }
  );

  const orders = await Order.find({
    user: userId,
  }).sort({ createdAt: -1 });

  console.log(
    "ORDERS FOUND:",
    orders.map((order) => order.orderId)
  );

  return orders;
};

// CANCEL ORDER
export const cancelOrderService = async (
  userId,
  orderId,
  reason
) => {
  const order = await Order.findOne({
    orderId,
    user: userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // CHECK ORDER STATUS
  if (!["pending", "processing"].includes(String(order.status).toLowerCase())) {
    throw new Error(
      "This order cannot be cancelled"
    );
  }

  // CANCEL ORDER
  order.status = "cancelled";
  order.cancellationReason = reason || "";
  order.cancelledAt = new Date();

  // STRICT COD vs PREPAID REFUND RULES:
  // For COD orders cancelled before delivery, customer has NOT handed over any cash yet.
  // Balance change must strictly be ₹0. Bypass wallet crediting completely.
  const isCod =
    String(order.paymentMethod || "").toUpperCase() === "COD" ||
    String(order.paymentMethod || "").toLowerCase() === "cash on delivery";
  const isDelivered =
    String(order.status).toLowerCase() === "delivered";

  // Only prepaid orders or already delivered orders qualify for wallet refund
  const isPaid = !isCod || isDelivered;

  // Calculate actual refund: net final price of non-cancelled items
  let refundAmount = 0;
  if (isPaid) {
    refundAmount = Math.max(0, Number(order.finalPrice || 0));
  }

  const refundReason = `Order cancellation refund (${order.orderId})`;

  // Prevent duplicate refund
  let shouldRefund = isPaid && refundAmount > 0;
  if (shouldRefund) {
    const wallet = await getOrCreateWallet(userId);
    const existingRefund = wallet.transactions.find(
      (transaction) =>
        transaction.type === "credit" &&
        transaction.order?.toString() === order._id.toString() &&
        (transaction.reason === refundReason ||
          transaction.description === refundReason)
    );

    if (existingRefund) {
      shouldRefund = false;
    }
  }

  // RESTORE STOCK & MARK UN-CANCELLED ITEMS
  for (const item of order.items) {
    if (item.cancelled) {
      continue;
    }

    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.find(
        (variant) => variant.size === item.size
      );

      if (variant) {
        variant.stock += item.quantity;
        await product.save();
      }
    }

    item.cancelled = true;
    item.cancelledAt = new Date();
    item.cancellationReason = reason || "Order cancelled";
    if (isPaid) {
      item.isRefunded = true;
      item.refundAmount = Number(item.total || item.price * item.quantity || 0);
    } else {
      item.isRefunded = false;
      item.refundAmount = 0;
    }
  }

  // Final price becomes 0 once whole order is cancelled
  order.finalPrice = 0;
  order.totalAmount = 0;
  order.finalAmount = 0;
  if (isPaid) {
    order.paymentStatus = "refunded";
    order.isRefunded = true;
  } else {
    order.isRefunded = false;
  }

  await order.save();

  // CREDIT TO WALLET IF APPLICABLE
  if (shouldRefund && refundAmount > 0) {
    await addMoneyToWallet(
      userId,
      refundAmount,
      refundReason,
      order._id
    );
  }

  return order;
};



// CANCEL SPECIFIC ORDER ITEM
export const cancelOrderItemService = async (
  userId,
  orderId,
  itemId,
  reason
) => {
  // 1. Find the user's order
  const order = await Order.findOne({
    orderId,
    user: userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // 2. Allow cancellation while the order is pending or processing
  if (!["pending", "processing"].includes(String(order.status).toLowerCase())) {
    throw new Error(
      "Products can only be cancelled while the order is pending or processing"
    );
  }

  // 3. Find the selected product
  const item = order.items.id(itemId);

  if (!item) {
    throw new Error("Order item not found");
  }

  if (item.cancelled) {
    throw new Error("This product has already been cancelled");
  }

  if (item.isRefunded) {
    throw new Error("Refund for this product has already been processed");
  }

  // 4. Identify active items before and after this cancellation
  const activeItemsBefore = order.items.filter(
    (orderItem) => !orderItem.cancelled
  );

  const activeItemsAfter = activeItemsBefore.filter(
    (orderItem) => orderItem._id.toString() !== itemId.toString()
  );

  // 5. Payment status:
  // For COD orders cancelled before delivery, customer has NOT handed over any cash yet.
  // Balance change must strictly be ₹0. Bypass wallet crediting completely.
  const isCod =
    String(order.paymentMethod || "").toUpperCase() === "COD" ||
    String(order.paymentMethod || "").toLowerCase() === "cash on delivery";
  const isDelivered =
    String(order.status).toLowerCase() === "delivered";
  const isPaid = !isCod || isDelivered;

  // 6. Look up coupon details if applicable
  let coupon = null;
  if (order.coupon) {
    coupon = await Coupon.findById(order.coupon);
  } else if (order.couponCode) {
    coupon = await Coupon.findOne({ code: order.couponCode.toUpperCase() });
  } else if (Number(order.couponDiscount || 0) > 0) {
    coupon = await Coupon.findOne({
      $or: [
        { discountValue: order.couponDiscount },
        { maximumDiscount: order.couponDiscount },
      ],
    });
  }

  const couponMinPurchase = Number(
    order.couponMinPurchase || coupon?.minimumPurchase || 0
  );
  const hadCoupon =
    (Number(order.couponDiscount || 0) > 0 || order.couponRevoked) &&
    (couponMinPurchase > 0 || !!coupon || !!order.couponCode);

  let refundAmount = 0;
  let hasCouponAdjustment = false;

  // 7. Calculate cancellation and refund
  if (activeItemsAfter.length === 0) {
    // --- FULL CANCELLATION VIA ALL ITEMS CANCELLED ---
    // Refund 100% of remaining paid amount
    const remainingPaid = Math.max(
      0,
      Number(order.totalAmount || order.finalPrice || 0)
    );
    refundAmount = isPaid ? Math.round(remainingPaid * 100) / 100 : 0;

    order.subtotal = 0;
    order.discount = 0;
    order.couponDiscount = 0;
    order.finalPrice = 0;
    order.totalAmount = 0;
    order.finalAmount = 0;
    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason =
      "All products in the order were cancelled";
    if (isPaid) {
      order.paymentStatus = "refunded";
      order.isRefunded = true;
    } else {
      order.isRefunded = false;
    }
  } else {
    // --- PARTIAL CANCELLATION ---
    const cancelledItemPrice = Number(item.price || 0);
    const cancelledItemQty = Number(item.quantity || 1);
    const cancelledItemTotal = cancelledItemPrice * cancelledItemQty;

    // Remaining subtotal of uncancelled items
    const remainingSubtotal = Math.round(
      activeItemsAfter.reduce((sum, orderItem) => {
        const p = Number(orderItem.price || 0);
        const q = Number(orderItem.quantity || 1);
        return sum + p * q;
      }, 0) * 100
    ) / 100;

    const activeSubtotalBefore = Math.round(
      activeItemsBefore.reduce((sum, orderItem) => {
        const p = Number(orderItem.price || 0);
        const q = Number(orderItem.quantity || 1);
        return sum + p * q;
      }, 0) * 100
    ) / 100;

    const totalPaidAmount = Number(
      order.totalAmount || order.finalPrice || 0
    );
    const tax = Number(order.tax || 0);
    const shipping = Number(order.shippingFee ?? order.shipping ?? 0);

    // CASE A: Remaining Subtotal drops below Coupon's minPurchase
    if (
      hadCoupon &&
      !order.couponRevoked &&
      remainingSubtotal < couponMinPurchase
    ) {
      hasCouponAdjustment = true;
      order.couponRevoked = true;
      order.couponDiscount = 0;

      const remainingItemsCost = Math.round(
        (remainingSubtotal + tax + shipping) * 100
      ) / 100;
      const rawRefund = Math.max(0, totalPaidAmount - remainingItemsCost);
      refundAmount = isPaid ? Math.round(rawRefund * 100) / 100 : 0;

      order.subtotal = remainingSubtotal;
      order.totalAmount = remainingItemsCost;
      order.finalPrice = remainingItemsCost;
      order.finalAmount = remainingItemsCost;
    }
    // CASE B: Remaining Subtotal STILL meets Coupon's minPurchase
    else if (
      hadCoupon &&
      !order.couponRevoked &&
      remainingSubtotal >= couponMinPurchase
    ) {
      hasCouponAdjustment = true;
      const currentCouponDiscount = Number(order.couponDiscount || 0);
      const subtotalBase =
        activeSubtotalBefore > 0
          ? activeSubtotalBefore
          : Number(order.subtotal || 1);
      const itemShare =
        (cancelledItemPrice * cancelledItemQty) / subtotalBase;
      const itemCouponDiscount =
        Math.round(currentCouponDiscount * itemShare * 100) / 100;

      const rawRefund = Math.max(
        0,
        cancelledItemPrice * cancelledItemQty - itemCouponDiscount
      );
      refundAmount = isPaid ? Math.round(rawRefund * 100) / 100 : 0;

      const remainingCouponDiscount = Math.max(
        0,
        Math.round((currentCouponDiscount - itemCouponDiscount) * 100) / 100
      );

      order.couponDiscount = remainingCouponDiscount;
      order.subtotal = remainingSubtotal;

      const newOrderTotal = Math.max(
        0,
        Math.round(
          (remainingSubtotal -
            remainingCouponDiscount +
            tax +
            shipping) *
            100
        ) / 100
      );
      order.totalAmount = newOrderTotal;
      order.finalPrice = newOrderTotal;
      order.finalAmount = newOrderTotal;
    }
    // STANDARD PARTIAL CANCELLATION (No coupon or coupon already revoked)
    else {
      const rawRefund = Math.max(0, cancelledItemTotal);
      refundAmount = isPaid ? Math.round(rawRefund * 100) / 100 : 0;

      order.subtotal = remainingSubtotal;
      const newOrderTotal = Math.max(
        0,
        Math.round(
          (remainingSubtotal -
            Number(order.couponDiscount || 0) +
            tax +
            shipping) *
            100
        ) / 100
      );
      order.totalAmount = newOrderTotal;
      order.finalPrice = newOrderTotal;
      order.finalAmount = newOrderTotal;
    }

    // Keep status as pending/processing for remaining items
    order.status = "pending";
    if (isPaid) {
      order.paymentStatus = "paid";
    }
  }

  // 8. Restore the product stock
  const product = await Product.findById(item.product);
  if (product) {
    const variant = product.variants.find(
      (variant) => variant.size === item.size
    );

    if (variant) {
      variant.stock += item.quantity;
      await product.save();
    }
  }

  // 9. Mark the item as cancelled
  item.cancelled = true;
  item.cancellationReason = reason || "";
  item.cancelledAt = new Date();
  if (isPaid && refundAmount > 0) {
    item.isRefunded = true;
    item.refundAmount = refundAmount;
  } else {
    item.isRefunded = false;
    item.refundAmount = 0;
  }

  // 10. Save the order
  await order.save();

  // 11. Credit the refund to wallet with transparent note
  if (isPaid && refundAmount > 0) {
    const refundNote = hasCouponAdjustment
      ? `Refund of ₹${refundAmount} for cancelled item ${item.name} (adjusted for coupon terms)`
      : `Refund of ₹${refundAmount} for cancelled item ${item.name}`;

    const wallet = await getOrCreateWallet(userId);
    const existingRefund = wallet.transactions.find(
      (transaction) =>
        transaction.type === "credit" &&
        transaction.order?.toString() === order._id.toString() &&
        (transaction.reason === refundNote ||
          transaction.description === refundNote ||
          transaction.reason ===
            `Product cancellation refund (${order.orderId} - ${item._id})`)
    );

    if (!existingRefund) {
      await addMoneyToWallet(
        userId,
        refundAmount,
        refundNote,
        order._id,
        null,
        refundNote
      );
    }
  }

  return order;
};

// CREATE FAILED PAYMENT ORDER

export const createFailedPaymentOrderService = async (
  userId,
  orderData
) => {
  const {
    addressId,
    paymentMethod,
    items,
  } = orderData;

  if (!items || items.length === 0) {
    throw new Error("Order items are required");
  }

  if (
    !["UPI", "CARD", "WALLET"].includes(
      paymentMethod
    )
  ) {
    throw new Error("Invalid payment method");
  }

  // FIND USER ADDRESS

  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  const orderItems = [];

  let subtotal = 0;
  let discount = 0;

  // CHECK PRODUCTS

  for (const item of items) {
    const {
      productId,
      size,
      quantity,
    } = item;

    if (!quantity || quantity < 1) {
      throw new Error("Invalid quantity");
    }

    const product =
      await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (
      product.isBlocked ||
      !product.isListed
    ) {
      throw new Error(
        `${product.name} is not available`
      );
    }

    const variant =
      product.variants.find(
        (variant) =>
          variant.size === size
      );

    if (!variant) {
      throw new Error(
        `Size ${size} is not available for ${product.name}`
      );
    }

    if (variant.stock < quantity) {
      throw new Error(
        `Not enough stock for ${product.name} - Size ${size}`
      );
    }

    // FIND ACTIVE OFFERS

    const now = new Date();

    const offers = await Offer.find({
      status: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        {
          type: "Product",
          targetId: product._id,
        },
        {
          type: "Category",
          targetId: product.category,
        },
      ],
    });

    const highestOffer =
      offers.length > 0
        ? offers.reduce(
            (highest, current) =>
              current.discount >
              highest.discount
                ? current
                : highest
          )
        : null;

    // CALCULATE PRICE
    const originalPrice = Number(product.price) || 0;

    const clientItemDiscount = Number(item.discount) || Number(item.unitDiscount) || 0;
    const clientItemPrice = Number(item.price);

    let discountPercentage = highestOffer
      ? Number(highestOffer.discount) || 0
      : Number(product.discount) || 0;

    let itemDiscount = Math.round(
      ((originalPrice * discountPercentage) / 100) * 100
    ) / 100;

    let itemPrice = Math.max(
      0,
      Math.round((originalPrice - itemDiscount) * 100) / 100
    );

    if (
      Number.isFinite(clientItemPrice) &&
      clientItemPrice > 0 &&
      clientItemPrice < originalPrice &&
      itemPrice === originalPrice
    ) {
      itemPrice = clientItemPrice;
      itemDiscount = Math.round((originalPrice - itemPrice) * 100) / 100;
    } else if (
      itemDiscount === 0 &&
      clientItemDiscount > 0
    ) {
      itemDiscount = clientItemDiscount;
      itemPrice = Math.max(0, Math.round((originalPrice - itemDiscount) * 100) / 100);
    }

    discount = Math.round((discount + itemDiscount * quantity) * 100) / 100;

    const itemTotal = Math.round(itemPrice * quantity * 100) / 100;

    subtotal += originalPrice * quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image:
        product.images?.[0] || "",
      size,
      quantity,
      price: itemPrice,
      originalPrice,
      unitDiscount: itemDiscount,
      total: itemTotal,
    });
  }

  // PRICE

  const tax = 0;
  const shipping = 0;

  const finalPrice =
    Math.round((subtotal - discount + tax + shipping) * 100) / 100;

  // GENERATE ORDER ID

  let orderId = generateOrderId();

  let existingOrder =
    await Order.findOne({
      orderId,
    });

  while (existingOrder) {
    orderId = generateOrderId();

    existingOrder =
      await Order.findOne({
        orderId,
      });
  }

  // 5 MINUTE RETRY TIME

  const paymentRetryExpiresAt =
    new Date(
      Date.now() +
        5 * 60 * 1000
    );

  // CREATE FAILED ORDER

  const order = await Order.create({
    user: userId,

    orderId,

    items: orderItems,

    address: {
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    },

    paymentMethod,

    paymentStatus: "failed",

    paymentRetryExpiresAt,

    subtotal,

    discount,

    couponDiscount: 0,

    tax,

    shipping,

    shippingFee: shipping,

    finalPrice,
    totalAmount: finalPrice,
    finalAmount: finalPrice,

    status: "Payment Failed",
  });

  return order;
};


// RETRY PAYMENT ORDER

export const retryPaymentOrderService = async (
  userId,
  orderId
) => {
  const order =
    await Order.findOne({
      orderId,
      user: userId,
    });

  if (!order) {
    throw new Error("Order not found");
  }

  if (
    order.paymentStatus !== "failed"
  ) {
    throw new Error(
      "This order is not available for payment retry"
    );
  }

  if (
    !order.paymentRetryExpiresAt
  ) {
    throw new Error(
      "Payment retry is not available"
    );
  }

  if (
    new Date() >
    order.paymentRetryExpiresAt
  ) {
    throw new Error(
      "Payment retry time has expired"
    );
  }

  return order;
};

export const completeRetryPaymentOrderService = async (
  userId,
  orderId
) => {
  const order = await Order.findOne({
    orderId,
    user: userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus !== "failed") {
    throw new Error("This order is not available for retry payment");
  }

  if (
    !order.paymentRetryExpiresAt ||
    new Date() > order.paymentRetryExpiresAt
  ) {
    throw new Error("Payment retry time has expired");
  }

  // Payment successful
  order.paymentStatus = "Completed";
  order.paidAt = new Date();
  order.revenueCredited = true;
  order.revenueCreditedAt = new Date();
  order.status = "processing";
  order.paymentRetryExpiresAt = null;

  // Deduct inventory now that payment succeeded
  for (const item of order.items) {
    if (!item.cancelled) {
      const product = await Product.findById(item.product);
      if (product) {
        const variant = product.variants.find((v) => v.size === item.size);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
          await product.save();
        }
      }
    }
  }

  await order.save();

  await recordPaymentCredit(
    order._id,
    order.finalPrice || order.finalAmount || order.totalAmount || 0,
    "Retry Payment Verified & Credited"
  );

  return order;
};

// ======================================================
// REVENUE / FINANCIAL LEDGER CREDIT HANDLER
// ======================================================

export const recordPaymentCredit = async (orderId, amount, description) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      console.warn(`[Revenue Credit] Order not found for ID: ${orderId}`);
      return { success: false, message: "Order not found" };
    }

    console.log(
      `[Revenue Credit Log] Order #${order.orderId || order._id} | Method: ${order.paymentMethod} | Amount: ₹${amount} | Description: ${description} | PaidAt: ${order.paidAt ? order.paidAt.toISOString() : new Date().toISOString()}`
    );

    return {
      success: true,
      orderId: order._id,
      amount,
      description,
      creditedAt: new Date(),
    };
  } catch (error) {
    console.error(`[Revenue Credit Error] Failed to record credit for order ${orderId}:`, error);
    return { success: false, message: error.message };
  }
};



