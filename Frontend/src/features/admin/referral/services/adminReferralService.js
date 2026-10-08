import { api } from "../../../../services/api";

// CREATE REFERRAL OFFER
export const createReferralOffer = async (referralData) => {
  const adminToken = localStorage.getItem("adminToken");

  return api("/admin/referrals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(referralData),
  });
};

// GET ALL REFERRAL OFFERS
export const getAllReferralOffers = async () => {
  const adminToken = localStorage.getItem("adminToken");

  return api("/admin/referrals", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};

// GET REFERRAL OFFER BY ID
export const getReferralOfferById = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/referrals/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};

// UPDATE REFERRAL OFFER
export const updateReferralOffer = async (
  id,
  referralData
) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/referrals/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(referralData),
  });
};

// DELETE REFERRAL OFFER
export const deleteReferralOffer = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/referrals/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};

// UPDATE REFERRAL OFFER STATUS
export const updateReferralOfferStatus = async (
  id,
  status
) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/referrals/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status }),
  });
};