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
  paymentStatus: normalizedPaymentMethod === "WALLET" ? "paid" : "pending",
  subtotal,
  discount,
  couponDiscount,
  tax,
  shipping,
  shippingFee: shipping,
  finalPrice,
  totalAmount: finalPrice,
  finalAmount: finalPrice,
  status: "pending",
});

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

export const getOrderByIdService = async (
  userId,
  orderId
) => {

  const order = await Order.findOne({
    $or: [
      { orderId },
      { _id: mongoose.isValidObjectId(orderId) ? orderId : null },
    ],
    user: userId,
  }).populate("items.product");

  if (!order) {
    throw new Error("Order not found");
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
  if (order.status !== "pending") {
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

  // 2. Allow cancellation only while the order is pending
  if (order.status !== "pending") {
    throw new Error(
      "Products can only be cancelled while the order is pending"
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

  // 4. Calculate the item paid total and refund independently
  const itemPrice = Number(item.price || 0);
  const itemQty = Number(item.quantity || 1);
  const itemTotal =
    Number(item.total) > 0
      ? Number(item.total)
      : Math.round(itemPrice * itemQty * 100) / 100;

  const activeItemsBefore = order.items.filter(
    (orderItem) => !orderItem.cancelled
  );

  const activeItemsTotalBefore = activeItemsBefore.reduce(
    (total, orderItem) => {
      const itPrice = Number(orderItem.price || 0);
      const itQty = Number(orderItem.quantity || 1);
      const itTotal =
        Number(orderItem.total) > 0
          ? Number(orderItem.total)
          : Math.round(itPrice * itQty * 100) / 100;
      return total + itTotal;
    },
    0
  );

  const currentCouponDiscount = Number(order.couponDiscount || 0);

  // Allocate coupon discount proportionally to this item
  let couponShare = 0;
  if (activeItemsTotalBefore > 0 && currentCouponDiscount > 0) {
    couponShare =
      (itemTotal / activeItemsTotalBefore) * currentCouponDiscount;
    couponShare = Math.round(couponShare * 100) / 100;
    couponShare = Math.min(couponShare, itemTotal);
  }

  // STRICT COD vs PREPAID REFUND RULES:
  // For COD orders cancelled before delivery, customer has NOT handed over any cash yet.
  // Balance change must strictly be ₹0. Bypass wallet crediting completely.
  const isCod =
    String(order.paymentMethod || "").toUpperCase() === "COD" ||
    String(order.paymentMethod || "").toLowerCase() === "cash on delivery";
  const isDelivered =
    String(order.status).toLowerCase() === "delivered";

  // Only prepaid orders or delivered orders qualify for wallet refund
  const isPaid = !isCod || isDelivered;

  const refundAmount = isPaid
    ? Math.max(0, Math.round((itemTotal - couponShare) * 100) / 100)
    : 0;

  // Unique identifier for this item's refund
  const refundReason = `Product cancellation refund (${order.orderId} - ${item._id})`;

  // 5. Prevent duplicate wallet credit for this item
  let shouldRefund = isPaid && refundAmount > 0;
  if (shouldRefund) {
    const wallet = await getOrCreateWallet(userId);

    const existingRefund = wallet.transactions.find(
      (transaction) =>
        transaction.type === "credit" &&
        transaction.order?.toString() === order._id.toString() &&
        (transaction.reason === refundReason ||
          transaction.description === refundReason ||
          transaction.reason === `Product cancellation refund (${item._id})` ||
          transaction.description === `Product cancellation refund (${item._id})`)
    );

    if (existingRefund) {
      item.isRefunded = true;
      item.refundAmount = refundAmount;
      shouldRefund = false;
    }
  }

  // 6. Restore the product stock
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

  // 7. Mark the item as cancelled and track refund status per item
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

  // 8. Calculate the remaining items
  const activeItemsAfter = order.items.filter(
    (orderItem) => !orderItem.cancelled
  );

  const remainingItemsTotal = activeItemsAfter.reduce(
    (total, orderItem) => {
      const itPrice = Number(orderItem.price || 0);
      const itQty = Number(orderItem.quantity || 1);
      const itTotal =
        Number(orderItem.total) > 0
          ? Number(orderItem.total)
          : Math.round(itPrice * itQty * 100) / 100;
      return total + itTotal;
    },
    0
  );

  const remainingCouponDiscount = Math.max(
    0,
    Math.round((currentCouponDiscount - couponShare) * 100) / 100
  );

  order.subtotal = remainingItemsTotal;
  order.discount = 0;
  order.couponDiscount = activeItemsAfter.length
    ? remainingCouponDiscount
    : 0;

  order.finalPrice = Math.max(
    0,
    Math.round(
      (
        remainingItemsTotal -
        Number(order.couponDiscount || 0) +
        Number(order.tax || 0) +
        Number(order.shipping || 0)
      ) * 100
    ) / 100
  );
  order.totalAmount = order.finalPrice;
  order.finalAmount = order.finalPrice;

  // 9. Status transition:
  // Only transition order to "cancelled" when ALL items are cancelled.
  // While active items remain, keep order.status as "pending" so remaining items can still be cancelled in UI.
  if (activeItemsAfter.length === 0) {
    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason =
      "All products in the order were cancelled";
    order.finalPrice = 0;
    order.totalAmount = 0;
    order.finalAmount = 0;
    if (isPaid) {
      order.paymentStatus = "refunded";
      order.isRefunded = true;
    } else {
      order.isRefunded = false;
    }
  } else {
    order.status = "pending";
    if (isPaid) {
      // Keep order paymentStatus as paid so it is never prematurely marked as refunded
      order.paymentStatus = "paid";
    }
  }

  // 10. Save the order
  await order.save();

  // 11. Credit the refund to wallet
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
  order.paymentStatus = "paid";
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

  return order;
};


