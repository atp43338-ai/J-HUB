import Return from "../../order/models/Return.js";
import Order from "../../order/models/Order.js";
import Product from "../../product/models/Product.js";


// GET ALL RETURN REQUESTS

export const getAllReturnsService = async () => {

  const returns = await Return.find()
    .populate("user", "name email")
    .populate("order")
    .sort({ createdAt: -1 });

  return returns;
};



// APPROVE RETURN

export const approveReturnService = async (
  returnId
) => {

  // FIND RETURN REQUEST

  const returnRequest =
    await Return.findById(returnId);

  if (!returnRequest) {
    throw new Error(
      "Return request not found"
    );
  }


  // CHECK RETURN STATUS

  if (returnRequest.status !== "requested") {
    throw new Error(
      "Return request has already been processed"
    );
  }


  // FIND ORDER

  const order = await Order.findById(
    returnRequest.order
  );

  if (!order) {
    throw new Error(
      "Order not found"
    );
  }


  // RETURN ONLY DELIVERED ORDERS

  if (order.status !== "delivered") {
    throw new Error(
      "Only delivered orders can be returned"
    );
  }


  // RESTORE STOCK

  for (const item of order.items) {

    // If an item was cancelled earlier,
    // its stock was already restored.
    //
    // So don't restore it again.

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


  // UPDATE RETURN STATUS

  returnRequest.status =
    "approved";


  // UPDATE ORDER STATUS

  order.status = "returned";


  await order.save();

  await returnRequest.save();


  return returnRequest;
};



// REJECT RETURN

export const rejectReturnService = async (
  returnId
) => {

  const returnRequest =
    await Return.findById(returnId);

  if (!returnRequest) {
    throw new Error(
      "Return request not found"
    );
  }


  // CHECK RETURN STATUS

  if (returnRequest.status !== "requested") {
    throw new Error(
      "Return request has already been processed"
    );
  }


  // REJECT RETURN

  returnRequest.status =
    "rejected";


  await returnRequest.save();

  return returnRequest;
};