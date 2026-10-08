import {
  getWallet,
} from "../services/walletService.js";

// GET USER WALLET
export const getWalletController = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const wallet = await getWallet(userId);

    res.status(200).json({
      success: true,
      message: "Wallet fetched successfully",
      wallet,
    });
  } catch (error) {
    console.error(
      "Get wallet error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch wallet",
    });
  }
};