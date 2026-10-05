import axios from "axios";

const API_URL = "http://localhost:5000/api/orders/return";

export const createReturn = async (
  orderId,
  reason,
  description
) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    {
      orderId,
      reason,
      description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};