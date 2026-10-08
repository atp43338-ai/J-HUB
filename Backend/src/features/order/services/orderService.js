import Order from "../models/Order.js";
import Product from "../../product/models/Product.js";
import Address from "../../address/models/Address.js";
import Offer from "../../admin/offer/models/Offer.js";
import Coupon from "../../admin/coupon/models/Coupon.js";

import {
  removePurchasedItemsFromCartService,
} from "../../cart/services/cartService.js";

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

  if (!["COD", "UPI", "CARD","WALLET"].includes(paymentMethod)) {
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

    let itemPrice = product.price;

    let itemDiscount = 0;

    if (highestOffer) {

      itemDiscount =
        (product.price * highestOffer.discount) / 100;

      itemPrice =
        product.price - itemDiscount;

      itemDiscount =
        Math.round(itemDiscount);

      itemPrice =
        Math.round(itemPrice);

      discount +=
        itemDiscount * quantity;
    }


    // Calculate item total

    const itemTotal =
      itemPrice * quantity;


    subtotal +=
      product.price * quantity;


    // Add item to order

    orderItems.push({
      product: product._id,

      name: product.name,

      image: product.images?.[0] || "",

      size,

      quantity,

      price: itemPrice,

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

    if (
      coupon.discountType === "percentage"
    ) {

      couponDiscount =
        (subtotal * coupon.discountValue) / 100;


      // MAXIMUM DISCOUNT

      if (
        coupon.maximumDiscount !== null &&
        couponDiscount >
          coupon.maximumDiscount
      ) {
        couponDiscount =
          coupon.maximumDiscount;
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
      couponDiscount >
      discountedSubtotal
    ) {
      couponDiscount =
        discountedSubtotal;
    }


    couponDiscount =
      Math.round(couponDiscount);

    appliedCoupon = coupon;
  }


  // PRICE CALCULATION

  const tax = 0;

  const shipping = 0;

  const discountedSubtotal =
    subtotal - discount;

  const finalPrice =
    discountedSubtotal -
    couponDiscount +
    tax +
    shipping;


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
  paymentMethod,
  paymentStatus: "pending",
  subtotal,
  discount,
  couponDiscount,
  tax,
  shipping,
  finalPrice,
  status: "pending",
});

// REMOVE PURCHASED ITEMS FROM CART
await removePurchasedItemsFromCartService(userId, items);

// INCREASE COUPON USAGE COUNT
if (appliedCoupon) {
  appliedCoupon.usedCount += 1;
  await appliedCoupon.save();
}

return order;


  // ==========================================
  // INCREASE COUPON USAGE COUNT
  // ==========================================

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
    orderId,
    user: userId,
  }).populate("items.product");

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};



// GET ALL USER ORDERS

export const getOrdersService = async (
  userId
) => {
  const now = new Date();

  // Remove expired failed-payment orders
  await Order.deleteMany({
    user: userId,
    paymentStatus: "failed",
    paymentRetryExpiresAt: {
      $lte: now,
    },
  });



  // Get active orders
  const orders = await Order.find({
    user: userId,
  }).sort({ createdAt: -1 });

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

  order.cancellationReason =
    reason || "";

  order.cancelledAt = new Date();


  // RESTORE STOCK

  for (const item of order.items) {

    // IMPORTANT:
    // If this item was already cancelled,
    // its stock has already been restored.
    //
    // So DO NOT restore it again.

    if (item.cancelled) {
      continue;
    }


    const product =
      await Product.findById(item.product);

    if (!product) {
      continue;
    }


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


  await order.save();

  return order;
};



// CANCEL SPECIFIC ORDER ITEM

export const cancelOrderItemService = async (
  userId,
  orderId,
  itemId,
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
      "Products can only be cancelled while the order is pending"
    );
  }


  // FIND ORDER ITEM

  const item = order.items.id(itemId);

  if (!item) {
    throw new Error("Order item not found");
  }


  // CHECK IF ALREADY CANCELLED

  if (item.cancelled) {
    throw new Error(
      "This product has already been cancelled"
    );
  }


  // CANCEL ITEM

  item.cancelled = true;

  item.cancellationReason =
    reason || "";

  item.cancelledAt = new Date();


  // RESTORE STOCK

  const product = await Product.findById(
    item.product
  );

  if (product) {

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


  // RECALCULATE ORDER PRICE

  const activeItems =
    order.items.filter(
      (orderItem) =>
        !orderItem.cancelled
    );


  const newSubtotal =
    activeItems.reduce(
      (total, orderItem) =>
        total + orderItem.total,
      0
    );


  order.subtotal =
    newSubtotal;


  order.finalPrice =
    newSubtotal -
    order.discount +
    order.tax +
    order.shipping;


  // IF ALL ITEMS ARE CANCELLED

  if (activeItems.length === 0) {

    order.status = "cancelled";

    order.cancelledAt = new Date();

    order.cancellationReason =
      "All products in the order were cancelled";
  }


  await order.save();

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

    let itemPrice = product.price;
    let itemDiscount = 0;

    if (highestOffer) {
      itemDiscount =
        (product.price *
          highestOffer.discount) /
        100;

      itemPrice =
        product.price -
        itemDiscount;

      itemDiscount =
        Math.round(itemDiscount);

      itemPrice =
        Math.round(itemPrice);

      discount +=
        itemDiscount * quantity;
    }

    const itemTotal =
      itemPrice * quantity;

    subtotal +=
      product.price * quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image:
        product.images?.[0] || "",
      size,
      quantity,
      price: itemPrice,
      total: itemTotal,
    });
  }

  // PRICE

  const tax = 0;
  const shipping = 0;

  const finalPrice =
    subtotal -
    discount +
    tax +
    shipping;

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

    finalPrice,

    status: "pending",
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
  order.paymentRetryExpiresAt = null;

  await order.save();

  return order;
};


