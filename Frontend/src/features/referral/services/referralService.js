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