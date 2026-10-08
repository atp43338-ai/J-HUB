import { api } from "../../../../services/api";


// CREATE COUPON
export const createCoupon = async (couponData) => {
  const adminToken = localStorage.getItem("adminToken");

  return api("/admin/coupons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(couponData),
  });
};


// GET ALL COUPONS
export const getAllCoupons = async () => {
  const adminToken = localStorage.getItem("adminToken");

  return api("/admin/coupons", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};


// GET SINGLE COUPON
export const getCouponById = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/coupons/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};


// UPDATE COUPON
export const updateCoupon = async (id, couponData) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/coupons/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(couponData),
  });
};


// DELETE COUPON
export const deleteCoupon = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/coupons/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};


// UPDATE COUPON STATUS
export const updateCouponStatus = async (id, status) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/coupons/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status }),
  });
};