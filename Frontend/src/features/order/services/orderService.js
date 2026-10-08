import { api } from "../../../services/api";

const getToken = () => {
  return localStorage.getItem("token");
};


// CREATE ORDER
export const createOrder = async (orderData) => {
  const token = getToken();

  return api("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
};


// GET SINGLE ORDER
export const getOrderById = async (orderId) => {
  const token = getToken();

  return api(`/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// GET ALL ORDERS
export const getOrders = async () => {
  const token = getToken();

  return api("/orders", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// CANCEL ORDER
export const cancelOrder = async (orderId, reason) => {
  const token = getToken();

  return api(`/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      reason,
    }),
  });
};


// CANCEL SPECIFIC ORDER ITEM
export const cancelOrderItem = async (
  orderId,
  itemId,
  reason
) => {
  const token = getToken();

  return api(
    `/orders/${orderId}/items/${itemId}/cancel`,
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
};


// RETURN ORDER
export const returnOrder = async (orderId, reason) => {
  // Backend later
};


// DOWNLOAD INVOICE
export const downloadInvoice = async (orderId) => {
  // Backend later
};


// CREATE FAILED PAYMENT ORDER
export const createFailedPaymentOrder = async (
  orderData
) => {
  const token = getToken();

  return api("/orders/failed-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
};


// RETRY PAYMENT ORDER
export const retryPaymentOrder = async (orderId) => {
  const token = getToken();

  return api(`/orders/${orderId}/retry-payment`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// COMPLETE RETRY PAYMENT ORDER
export const completeRetryPaymentOrder = async (orderId) => {
  const token = getToken();

  return api(
    `/orders/${orderId}/complete-retry-payment`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};