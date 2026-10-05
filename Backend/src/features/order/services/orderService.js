import Order from "../models/Order.js";
import Product from "../../product/models/Product.js";
import Address from "../../address/models/Address.js";

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
  } = orderData;


  // CHECK ITEMS

  if (!items || items.length === 0) {
    throw new Error("Order items are required");
  }


  // CHECK PAYMENT METHOD

  if (paymentMethod !== "COD") {
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


    // Calculate item total

    const itemTotal =
      product.price * quantity;


    subtotal += itemTotal;


    // Add item to order

    orderItems.push({
      product: product._id,

      name: product.name,

      image: product.images?.[0] || "",

      size,

      quantity,

      price: product.price,

      total: itemTotal,
    });


    // DECREASE STOCK

    variant.stock -= quantity;

    await product.save();
  }


  // PRICE CALCULATION

  const discount = 0;

  const tax = 0;

  const shipping = 0;

  const finalPrice =
    subtotal -
    discount +
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

    tax,

    shipping,

    finalPrice,

    status: "pending",
  });


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