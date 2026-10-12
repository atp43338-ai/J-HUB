const API_URL = import.meta.env.VITE_API_URL || "https://api.afsal.online/api";

export const api = async (endpoint, options = {}) => {
  const headers = {
    ...options.headers,
  };

  if (
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    if (window.location.protocol === "https:" && API_URL.startsWith("http://")) {
      throw new Error(
        "Mixed Content Error: Frontend is on HTTPS but API is on HTTP. Backend requires HTTPS."
      );
    }
    throw new Error(
      err.message === "Failed to fetch"
        ? "Unable to connect to backend server. Please verify the backend is running."
        : err.message
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export { API_URL };