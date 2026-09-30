const API_URL = "http://localhost:5000/api/cart";

// Get token
const getToken = () => {
  return localStorage.getItem("token");
};


// Add item to cart
export const addToCart = async (cartData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(cartData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add item to cart");
  }

  return data;
};

// Get cart
export const getCart = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch cart");
  }

  return data;
};


// Update cart quantity
export const updateCartItem = async (itemId, quantity) => {
  const response = await fetch(
    `${API_URL}/${itemId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        quantity,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update cart"
    );
  }

  return data;
};



// Remove cart item
export const removeCartItem = async (itemId) => {
  const response = await fetch(`${API_URL}/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove item");
  }

  return data;
};

// Clear cart
export const clearCart = async () => {
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to clear cart");
  }

  return data;
};