import { api } from "../../../services/api";

// APPLY COUPON
export const applyCoupon = async (
  code,
  subtotal
) => {
  const token = localStorage.getItem("token");

  return api("/coupon/apply", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      code,
      subtotal,
    }),
  });
};


// GET AVAILABLE COUPONS
export const getAvailableCoupons = async () => {
  const token = localStorage.getItem("token");

  return api("/coupon/available", {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};