import { api } from "../../../../services/api";

// GET ALL RETURN REQUESTS
export const getAllReturns = async () => {
  const token = localStorage.getItem("adminToken");

  return api("/admin/returns", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// APPROVE RETURN
export const approveReturn = async (returnId) => {
  const token = localStorage.getItem("adminToken");

  return api(`/admin/returns/${returnId}/approve`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// REJECT RETURN
export const rejectReturn = async (returnId) => {
  const token = localStorage.getItem("adminToken");

  return api(`/admin/returns/${returnId}/reject`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};