const API_URL = "http://localhost:5000/api/admin";

// Admin Login
export const adminLogin = async (email, password) => {
  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Admin login failed");
  }

  return data;
};

// Get Users
export const getUsers = async (page = 1, limit = 5) => {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/users?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
};

// Update User Block Status
export const updateUserBlockStatus = async (userId, isBlocked) => {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/users/${userId}/block`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isBlocked,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update user status");
  }

  return data;
};