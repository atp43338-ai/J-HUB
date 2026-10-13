import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  getProductReviews,
  checkReviewEligibility,
  addReview,
} from "../services/reviewService";

function ProductReviews({ product }) {
  const productId = product?._id;

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  // Verified buyer eligibility
  const [canReview, setCanReview] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  // Review form state
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews for this product
  const fetchReviews = async () => {
    if (!productId) return;
    try {
      const data = await getProductReviews(productId);
      if (data) {
        setReviews(data.reviews || []);
        setAverageRating(Number(data.averageRating) || 0);
        setTotalReviews(Number(data.totalReviews) || 0);
      }
    } catch (error) {
      console.error("Failed to fetch product reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is an eligible verified buyer
  const checkEligibility = async () => {
    if (!productId) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setCanReview(false);
      setCheckingEligibility(false);
      return;
    }

    try {
      setCheckingEligibility(true);
      const data = await checkReviewEligibility(productId);
      setCanReview(data?.canReview === true);
    } catch (error) {
      console.error("Failed to check review eligibility:", error);
      setCanReview(false);
    } finally {
      setCheckingEligibility(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
      checkEligibility();
    }
  }, [productId]);

  // Handle Review Submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a star rating between 1 and 5");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    try {
      setSubmitting(true);
      const response = await addReview({
        productId,
        rating,
        comment: comment.trim(),
      });

      toast.success(response.message || "Review submitted successfully!");

      // Reset form and immediately revoke eligibility so form disappears
      setComment("");
      setRating(5);
      setShowForm(false);
      setCanReview(false);

      // Refresh reviews list
      await fetchReviews();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to render star rating display
  const renderStars = (score) => {
    const rounded = Math.round(score);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg leading-none ${
              star <= rounded ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getRatingLabel = (val) => {
    switch (val) {
      case 5:
        return "Excellent";
      case 4:
        return "Very Good";
      case 3:
        return "Good";
      case 2:
        return "Fair";
      case 1:
        return "Poor";
      default:
        return "";
    }
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-10">
      {/* Header with Title and "Write a Review" button (Delivered Buyers Only) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-2xl font-bold !text-black"
        >
          Customer Reviews
        </motion.h2>

        {/* Write a Review Button - ONLY visible to delivered buyers */}
        {canReview && !showForm && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            type="button"
            onClick={() => setShowForm(true)}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-[#d90416]
              hover:bg-red-700
              text-white
              px-5
              py-2.5
              rounded-xl
              text-sm
              font-semibold
              transition-all
              shadow-sm
              hover:shadow
              active:scale-[0.98]
              self-start
              sm:self-auto
              cursor-pointer
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Write a Review</span>
          </motion.button>
        )}
      </div>

      {/* Rating Summary Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mt-6 p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
      >
        <div className="flex items-center gap-5">
          <div className="text-4xl font-extrabold text-black tracking-tight">
            {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
          </div>

          <div>
            {renderStars(averageRating)}
            <p className="mt-1 text-sm text-gray-500 font-medium">
              Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {totalReviews > 0 && (
          <div className="text-xs text-gray-500 font-medium sm:text-right">
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              100% Verified Buyer Reviews
            </span>
          </div>
        )}
      </motion.div>

      {/* Write a Review Form - ONLY shown to delivered buyers who clicked the button */}
      {canReview && showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-6 p-6 rounded-2xl border-2 border-[#d90416]/20 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Write Your Review
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Share your experience as a verified purchaser of this product
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmitReview} className="mt-5 space-y-5">
            {/* Star Rating Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Overall Rating <span className="text-[#d90416]">*</span>
              </label>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                    >
                      <span
                        className={
                          star <= (hoverRating || rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>

                <span className="text-sm font-semibold text-gray-700 min-w-[90px]">
                  {getRatingLabel(hoverRating || rating)}
                </span>
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Your Review <span className="text-[#d90416]">*</span>
              </label>

              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like about the jersey quality, fit, or fabric? Any tips for other buyers?"
                disabled={submitting}
                className="
                  w-full
                  p-4
                  rounded-xl
                  border
                  border-gray-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#d90416]/20
                  focus:border-[#d90416]
                  text-sm
                  text-gray-900
                  resize-none
                  transition
                "
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-semibold transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-[#d90416]
                  hover:bg-red-700
                  disabled:bg-gray-300
                  disabled:cursor-not-allowed
                  text-white
                  px-6
                  py-2.5
                  rounded-xl
                  text-sm
                  font-semibold
                  transition-all
                  shadow-sm
                  active:scale-[0.98]
                  cursor-pointer
                "
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Reviews List / Empty State */}
      <div className="mt-8">
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-2xl p-10 text-center bg-gray-50/50"
          >
            <div className="w-12 h-12 mx-auto mb-3 text-gray-400 flex items-center justify-center rounded-full bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>

            <p className="text-gray-700 font-semibold">
              No reviews yet.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Be the first to review this product after your order is delivered.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              >
                {/* Header: User Name, Verified Buyer Pill, and Date */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {/* User Avatar Initial */}
                    <div className="w-9 h-9 rounded-full bg-red-50 text-[#d90416] font-bold text-sm flex items-center justify-center border border-red-100">
                      {(review.userName || "U").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          {review.userName}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified Buyer
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="mt-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <span className="text-xs text-gray-400 sm:text-right">
                    {new Date(review.createdAt || review.date).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                {/* Comment Body */}
                <p className="mt-3.5 text-sm text-gray-700 leading-relaxed pl-12 whitespace-pre-line">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductReviews;