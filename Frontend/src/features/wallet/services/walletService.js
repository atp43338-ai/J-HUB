import { api } from "../../../services/api";

// GET USER WALLET
export const getWallet = async (token) => {
  return api("/wallet", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// CREATE WALLET TOPUP RAZORPAY ORDER
export const createTopupOrder = async (amount, token) => {
  return api("/wallet/topup/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });
};

// VERIFY WALLET TOPUP RAZORPAY PAYMENT
export const verifyTopup = async (paymentData, token) => {
  return api("/wallet/topup/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });
};
