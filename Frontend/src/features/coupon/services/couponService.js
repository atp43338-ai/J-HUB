const API_URL = "http://localhost:5000/api/coupon";

// APPLY COUPON
export const applyCoupon = async (
  code,
  subtotal
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/apply`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        code,
        subtotal,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to apply coupon"
    );
  }

  return data;
};


// GET AVAILABLE COUPONS
export const getAvailableCoupons = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/available`,
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
        "Failed to fetch available coupons"
    );
  }

  return data;
};