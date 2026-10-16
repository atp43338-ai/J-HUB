import { api } from "../../../services/api";

export const getReferralDetails = async () => {
  const token = localStorage.getItem("token");

  return api("/referral", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getActiveReferralOffer = async () => {
  const token = localStorage.getItem("token");

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return api("/referrals/active-offer", {
    method: "GET",
    headers,
  });
};