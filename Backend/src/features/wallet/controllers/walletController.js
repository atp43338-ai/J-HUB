import {
  getWallet,
  addMoneyToWallet,
} from "../services/walletService.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../payment/services/razorpayService.js";

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

// CREATE TOPUP RAZORPAY ORDER
export const createTopupOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const numericAmount = Number(amount);

    if (!numericAmount || Number.isNaN(numericAmount)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid amount",
      });
    }

    if (numericAmount < 10) {
      return res.status(400).json({
        success: false,
        message: "Minimum top-up amount is ₹10",
      });
    }

    if (numericAmount > 50000) {
      return res.status(400).json({
        success: false,
        message: "Maximum top-up amount is ₹50,000",
      });
    }

    const receipt = `WALLET-${Date.now()}`;
    const order = await createRazorpayOrder(numericAmount, receipt);

    return res.status(201).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create wallet topup error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create wallet top-up order",
    });
  }
};

// VERIFY TOPUP RAZORPAY PAYMENT
export const verifyTopup = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required",
      });
    }

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid top-up amount",
      });
    }

    const isValid = verifyRazorpayPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const updatedWallet = await addMoneyToWallet(
      userId,
      numericAmount,
      "Added to wallet via Razorpay"
    );

    return res.status(200).json({
      success: true,
      message: "Money added to wallet successfully",
      wallet: updatedWallet,
    });
  } catch (error) {
    console.error("Verify wallet topup error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add money to wallet",
    });
  }
};