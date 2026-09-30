import Order from "../../order/models/Order.js";

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
  const order = await Order.findOne({ orderId })
    .populate("user", "name email phone")
    .populate("items.product");

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
  const order = await Order.findOne({
    orderId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Update status
  order.status = status;

  // If order is cancelled
  if (status === "cancelled") {
    order.cancelledAt = new Date();
  } else {
    order.cancelledAt = null;
  }

  await order.save();

  // Return updated order
  const updatedOrder = await Order.findOne({
    orderId,
  })
    .populate("user", "name email phone")
    .populate("items.product");

  return updatedOrder;
};