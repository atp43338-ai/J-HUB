import { api } from "../../../../services/api";

// Admin Login
export const adminLogin = async (email, password) => {
  return api("/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

// Get Users
export const getUsers = async (page = 1, limit = 5) => {
  const token = localStorage.getItem("adminToken");

  return api(`/admin/users?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update User Block Status
export const updateUserBlockStatus = async (
  userId,
  isBlocked
) => {
  const token = localStorage.getItem("adminToken");

  return api(`/admin/users/${userId}/block`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      isBlocked,
    }),
  });
};