import { api } from "../../../services/api";

export const createPaymentOrder = async (amount, token) => {
  return api("/payment/create-order", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      amount,
    }),
  });
};



export const verifyPayment = async (
  paymentData,
  token
) => {
  return api("/payment/verify", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(paymentData),
  });
};