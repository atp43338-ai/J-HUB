import { api } from "../../../services/api";

const getToken = () => localStorage.getItem("token");

// Get all reviews and rating summary for a product (Public)
export const getProductReviews = async (productId) => {
  return api(`/reviews/${productId}`);
};

// Check if current user is eligible to write a review (Protected)
export const checkReviewEligibility = async (productId) => {
  const token = getToken();
  if (!token) {
    return { canReview: false };
  }

  return api(`/reviews/check-eligibility/${productId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Add a new review (Protected)
export const addReview = async ({ productId, rating, comment }) => {
  const token = getToken();
  if (!token) {
    throw new Error("Please log in to submit a review");
  }

  return api("/reviews/add", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      rating,
      comment,
    }),
  });
};
