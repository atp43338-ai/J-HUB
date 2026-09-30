const API_URL = "http://localhost:5000/api/orders";

// CREATE ORDER
export const createOrder = async (orderData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to place order");
  }

  return data;
};


// GET SINGLE ORDER
export const getOrderById = async (orderId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order");
  }

  return data;
};


// GET ALL ORDERS
export const getOrders = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data;
};


// CANCEL ORDER
export const cancelOrder = async (orderId, reason) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/${orderId}/cancel`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reason,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to cancel order"
    );
  }

  return data;
};


// CANCEL SPECIFIC ORDER ITEM

export const cancelOrderItem = async (
  orderId,
  itemId,
  reason
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/${orderId}/items/${itemId}/cancel`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reason,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to cancel product"
    );
  }

  return data;
};


// RETURN ORDER
export const returnOrder = async (orderId, reason) => {
  // Backend later
};


// DOWNLOAD INVOICE
export const downloadInvoice = async (orderId) => {
  // Backend later
};