const API_URL = "http://localhost:5000/api/products";

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
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch inventory");
  }

  return data;
};

// Update product stock
export const updateInventoryStock = async (
  productId,
  variants
) => {
  const response = await fetch(
    `${API_URL}/${productId}/stock`,
    {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({
        variants,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update stock"
    );
  }

  return data;
};