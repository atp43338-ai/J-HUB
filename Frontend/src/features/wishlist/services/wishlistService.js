import { api } from "../../../services/api";

const getToken = () => {
  return localStorage.getItem("token");
};


// Get wishlist
export const getWishlist = async () => {
  const response = await api("/wishlist", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response;
};


// Add product to wishlist
export const addToWishlist = async (
  productId,
  size
) => {
  const response = await api("/wishlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      productId,
      size,
    }),
  });

  return response;
};


// Remove product from wishlist
export const removeFromWishlist = async (
  productId
) => {
  const response = await api(
    `/wishlist/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response;
};


// Clear wishlist
export const clearWishlist = async () => {
  const response = await api("/wishlist", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response;
};