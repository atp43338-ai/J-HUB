const API_URL =
  "http://localhost:5000/api/admin/orders";


// GET SINGLE ADMIN ORDER
export const getAdminOrderById = async (
  orderId
) => {
  const token =
    localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin login required");
  }

  const response = await fetch(
    `${API_URL}/${orderId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch order"
    );
  }

  return data;
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

  const response = await fetch(
    `${API_URL}/${orderId}/status`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update order status"
    );
  }

  return data;
};