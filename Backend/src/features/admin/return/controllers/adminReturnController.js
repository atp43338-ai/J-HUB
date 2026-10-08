import {
  getAllReturnsService,
  approveReturnService,
  rejectReturnService,
} from "../services/adminReturnService.js";


// GET ALL RETURN REQUESTS
export const getAllReturns = async (req, res) => {
  try {
    const returns = await getAllReturnsService();

    res.status(200).json({
      message: "Return requests fetched successfully",
      returns,
    });

  } catch (error) {
    console.error(
      "Get return requests error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// APPROVE RETURN
export const approveReturn = async (req, res) => {
  try {
    const { returnId } = req.params;

    const returnRequest =
      await approveReturnService(returnId);

    res.status(200).json({
      message: "Return request approved successfully",
      returnRequest,
    });

  } catch (error) {
    console.error(
      "Approve return error:",
      error
    );

    res.status(400).json({
      message: error.message,
    });
  }
};


// REJECT RETURN
export const rejectReturn = async (req, res) => {
  try {
    const { returnId } = req.params;

    const returnRequest =
      await rejectReturnService(returnId);

    res.status(200).json({
      message: "Return request rejected successfully",
      returnRequest,
    });

  } catch (error) {
    console.error(
      "Reject return error:",
      error
    );

    res.status(400).json({
      message: error.message,
    });
  }
};