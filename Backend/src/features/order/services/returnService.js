import Return from "../models/Return.js";
import Order from "../models/Order.js";

// CREATE RETURN REQUEST
export const createReturnService = async (
  orderId,
  userId,
  reason,
  description
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

  // Check existing return request
  const existingReturn = await Return.findOne({
    order: order._id,
  });

  if (existingReturn) {
    throw new Error(
      "Return request already exists for this order"
    );
  }

  // Create return request
  const returnRequest = await Return.create({
    order: order._id,
    user: userId,
    reason,
    description,
  });

  return returnRequest;
};