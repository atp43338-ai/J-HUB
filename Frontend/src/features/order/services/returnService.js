import { api } from "../../../services/api";

export const createReturn = async (
  orderId,
  reason,
  description
) => {
  const token = localStorage.getItem("token");

  return api("/orders/return", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      orderId,
      reason,
      description,
    }),
  });
};