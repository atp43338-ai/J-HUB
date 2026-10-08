const API_URL = "http://localhost:5000/api/payment";

export const createPaymentOrder = async (amount, token) => {
  const response = await fetch(`${API_URL}/create-order`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      amount,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create payment order");
  }

  return data;
};




export const verifyPayment = async (
  paymentData,
  token
) => {
  const response = await fetch(
    `${API_URL}/verify`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(paymentData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Payment verification failed"
    );
  }

  return data;
};