import {
  getAllOrdersForAdminService,
  getSingleOrderForAdminService,
  updateOrderStatusForAdminService,
} from "../services/adminOrderService.js";


// GET ALL ORDERS
export const getAllOrdersForAdmin = async (
  req,
  res
) => {
  try {

    const orders =
      await getAllOrdersForAdminService();

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });

  } catch (error) {

    console.error(
      "Get admin orders error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to fetch orders",
    });
  }
};


// GET SINGLE ORDER
export const getSingleOrderForAdmin = async (
  req,
  res
) => {
  try {

    const { orderId } = req.params;

    const order =
      await getSingleOrderForAdminService(
        orderId
      );

    return res.status(200).json({
      message: "Order fetched successfully",
      order,
    });

  } catch (error) {

    console.error(
      "Get admin order details error:",
      error
    );

    return res.status(404).json({
      message:
        error.message ||
        "Order not found",
    });
  }
};


// UPDATE ORDER STATUS
export const updateOrderStatusForAdmin =
  async (req, res) => {
    try {

      const { orderId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          message: "Order status is required",
        });
      }

      const order =
        await updateOrderStatusForAdminService(
          orderId,
          status
        );

      return res.status(200).json({
        message:
          "Order status updated successfully",
        order,
      });

    } catch (error) {

      console.error(
        "Update admin order status error:",
        error
      );

      return res.status(400).json({
        message:
          error.message ||
          "Failed to update order status",
      });
    }
  };