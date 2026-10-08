import { api } from "../../../../services/api";

const getAdminToken = () => {
  return localStorage.getItem("adminToken");
};

const getHeaders = () => {
  const token = getAdminToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get all products for inventory
export const getInventoryProducts = async () => {
  return api("/products", {
    method: "GET",
    headers: getHeaders(),
  });
};

// Update product stock
export const updateInventoryStock = async (
  productId,
  variants
) => {
  return api(`/products/${productId}/stock`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({
      variants,
    }),
  });
};