const API_URL = "http://localhost:5000/api/admin/coupons";

// CREATE COUPON
export const createCoupon = async (couponData) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(couponData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create coupon"
    );
  }

  return data;
};

// GET ALL COUPONS
export const getAllCoupons = async () => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch coupons"
    );
  }

  return data;
};

// GET SINGLE COUPON
export const getCouponById = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch coupon"
    );
  }

  return data;
};

// UPDATE COUPON
export const updateCoupon = async (id, couponData) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(couponData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update coupon"
    );
  }

  return data;
};

// DELETE COUPON
export const deleteCoupon = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete coupon"
    );
  }

  return data;
};

// UPDATE COUPON STATUS
export const updateCouponStatus = async (
  id,
  status
) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update coupon status"
    );
  }

  return data;
};