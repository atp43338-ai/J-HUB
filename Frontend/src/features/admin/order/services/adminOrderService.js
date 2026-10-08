import { api } from "../../../../services/api";

// GET SINGLE ADMIN ORDER
export const getAdminOrderById = async (
  orderId
) => {
  const token =
    localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin login required");
  }

  return api(`/admin/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// UPDATE ORDER STATUS
export const updateAdminOrderStatus = async (
  orderId,
  status
) => {
  const token =
    localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin login required");
  }

  return api(`/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status,
    }),
  });
};