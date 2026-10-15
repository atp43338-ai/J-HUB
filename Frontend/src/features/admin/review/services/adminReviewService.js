import { api } from "../../../../services/api";

// GET ALL REVIEWS FOR ADMIN
export const getAdminReviews = async (page = 1, limit = 10, search = "") => {
  const token = localStorage.getItem("adminToken");

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search && search.trim()) {
    queryParams.append("search", search.trim());
  }

  try {
    return await api(`/admin/reviews?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error.status === 404 || error.message?.includes("404")) {
      return await api(`/reviews?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    throw error;
  }
};

// DELETE REVIEW FOR ADMIN
export const deleteAdminReview = async (reviewId) => {
  const token = localStorage.getItem("adminToken");

  try {
    return await api(`/admin/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error.status === 404 || error.message?.includes("404")) {
      return await api(`/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    throw error;
  }
};

