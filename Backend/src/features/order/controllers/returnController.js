import { createReturnService } from "../services/returnService.js";


// CREATE RETURN REQUEST
export const createReturn = async (req, res) => {
  try {
    const { orderId, reason, description } = req.body;

    // Validation
    if (!orderId || !reason) {
      return res.status(400).json({
        message: "Order ID and reason are required",
      });
    }

    const returnRequest = await createReturnService(
      orderId,
      req.user.id,
      reason,
      description
    );

    res.status(201).json({
      message: "Return request submitted successfully",
      returnRequest,
    });

  } catch (error) {
    console.error("Create return error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};