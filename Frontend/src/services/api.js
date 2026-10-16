import toast from "react-hot-toast";

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

  let data;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    const rawText = await response.text();
    try {
      data = JSON.parse(rawText);
    } catch {
      data = {
        message:
          response.status === 404
            ? "API route not found (404). Please ensure the backend server is running and deployed with the latest routes."
            : response.status >= 500
            ? "Server error. Please check backend logs."
            : rawText || "Unexpected response from server",
      };
    }
  }

  if (!response.ok) {
    let errorMessage =
      data?.message ||
      (response.status === 404
        ? "API endpoint not found (404). If testing against the remote server, please deploy latest backend changes."
        : `Request failed with status ${response.status}`);

    // Intercept blocked user in real-time
    const isBlocked =
      data?.isBlocked === true ||
      (typeof errorMessage === "string" &&
        errorMessage.toLowerCase().includes("blocked"));

    if (response.status === 403 && isBlocked) {
      const isAuthPage =
        typeof window !== "undefined" &&
        (window.location.pathname === "/login" ||
          window.location.pathname === "/login/");

      if (!isAuthPage && typeof window !== "undefined") {
        // Clear authentication session
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Set flash message for login page
        sessionStorage.setItem(
          "blockedToast",
          errorMessage || "Your account has been blocked by the admin."
        );

        toast.error(
          errorMessage || "Your account has been blocked by the admin."
        );

        // Redirect immediately to login
        window.location.href = "/login";
      }
    }

    // Sanitize MongoDB duplicate key errors
    if (
      typeof errorMessage === "string" &&
      (errorMessage.includes("E11000") || errorMessage.toLowerCase().includes("dup key"))
    ) {
      errorMessage = "Category name already exists";
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    error.response = { status: response.status, data };
    error.isBlocked = isBlocked;
    throw error;
  }

  return data;
};

export { API_URL };