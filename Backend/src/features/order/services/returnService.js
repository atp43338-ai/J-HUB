import Return from "../models/Return.js";
import Order from "../models/Order.js";

// CREATE RETURN REQUEST
export const createReturnService = async (
  orderId,
  userId,
  reason,
  description,
  itemId = null
) => {
  // Find order using custom orderId
  const order = await Order.findOne({
    orderId: orderId,
    user: userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Return only allowed for delivered orders
  if (order.status !== "delivered") {
    throw new Error(
      "Only delivered orders can be returned"
    );
  }

  // For COD orders that reached Delivered status, ensure paymentStatus is marked as paid
  const isCod =
    String(order.paymentMethod || "").toUpperCase() === "COD" ||
    String(order.paymentMethod || "").toLowerCase() === "cash on delivery";
  if (isCod && order.paymentStatus !== "paid") {
    order.paymentStatus = "paid";
    await order.save();
  }

  // Check existing return request
  const query = {
    order: order._id,
  };
  if (itemId) {
    query.item = itemId;
  }

  const existingReturn = await Return.findOne(query);

  if (existingReturn) {
    throw new Error(
      "Return request already exists for this order"
    );
  }

  // Create return request
  const returnRequest = await Return.create({
    order: order._id,
    item: itemId || null,
    user: userId,
    reason,
    description,
  });

  return returnRequest;
};