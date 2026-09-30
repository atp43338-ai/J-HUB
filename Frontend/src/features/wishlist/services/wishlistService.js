const API_URL = "http://localhost:5000/api/wishlist";

const getToken = () => {
  return localStorage.getItem("token");
};

// Get wishlist
export const getWishlist = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch wishlist"
    );
  }

  return data;
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      productId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to add product to wishlist"
    );
  }

  return data;
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  const response = await fetch(
    `${API_URL}/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to remove product from wishlist"
    );
  }

  return data;
};

// Clear wishlist
export const clearWishlist = async () => {
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to clear wishlist"
    );
  }

  return data;
};