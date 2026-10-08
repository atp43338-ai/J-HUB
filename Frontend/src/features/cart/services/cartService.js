import { api } from "../../../services/api";

// Get token
const getToken = () => {
  return localStorage.getItem("token");
};


// Add item to cart
export const addToCart = async (cartData) => {
  return api("/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(cartData),
  });
};


// Get cart
export const getCart = async () => {
  return api("/cart", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};


// Update cart quantity
export const updateCartItem = async (itemId, quantity) => {
  return api(`/cart/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      quantity,
    }),
  });
};


// Remove cart item
export const removeCartItem = async (itemId) => {
  return api(`/cart/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};


// Clear cart
export const clearCart = async () => {
  return api("/cart", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};