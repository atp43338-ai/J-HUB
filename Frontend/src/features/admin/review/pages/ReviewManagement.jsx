import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAdminReviews, deleteAdminReview } from "../services/adminReviewService";

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal & action state
  const [deleteTarget, setDeleteTarget] = useState(null); // review object
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const reviewsPerPage = 10;

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAdminReviews(
        currentPage,
        reviewsPerPage,
        search
      );

      if (data && data.success) {
        setReviews(data.reviews || []);
        setTotalPages(data.totalPages || 1);
        setTotalReviews(data.totalReviews || 0);
      } else {
        setReviews(data?.reviews || []);
      }
    } catch (error) {
      console.error("Failed to fetch admin reviews:", error);
      toast.error(error.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, search]);

  // Handle Search Input
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteAdminReview(deleteTarget._id);

      toast.success("Review deleted successfully");

      // Update state locally immediately
      const remaining = reviews.filter((r) => r._id !== deleteTarget._id);
      setReviews(remaining);
      setTotalReviews((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);

      // If page is now empty and not on first page, navigate to previous page
      if (remaining.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (remaining.length === 0) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error(error.message || "Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to resolve product image URL
  const getProductImage = (images) => {
    if (!images || !images.length) return null;
    const first = images[0];
    if (typeof first !== "string") return null;
    if (first.startsWith("http")) {
      return first.replace("http://localhost:5000", "https://api.afsal.online");
    }
    return `https://api.afsal.online${first.startsWith("/") ? "" : "/"}${first}`;
  };

  // Helper to render star rating
  const renderStars = (rating) => {
    const num = Math.min(5, Math.max(1, Math.round(rating || 0)));
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-base leading-none ${
              star <= num ? "text-amber-400" : "text-gray-200"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-xs font-semibold text-gray-700">
          {rating}/5
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="text-black">Review </span>
            <span className="text-[#d90416]">Management</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Moderate and manage customer product ratings and reviews
          </p>
        </div>

        {/* Total Reviews Counter Pill */}
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-sm font-semibold text-gray-700 self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Total Reviews: {totalReviews}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by product, customer, or keyword..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#d90416] transition"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-lg transition"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Reviews Table Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">
                  Product
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">
                  Rating
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">
                  Review Comment
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#d90416] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Loading reviews...</span>
                    </div>
                  </td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((review) => {
                  const productImg = getProductImage(review.productId?.images);
                  const productName = review.productId?.name || "Deleted Product";
                  const customerName = review.userName || review.userId?.name || "Verified Buyer";
                  const customerEmail = review.userId?.email || "No email available";

                  return (
                    <tr
                      key={review._id}
                      className="hover:bg-red-50/30 transition-colors"
                    >
                      {/* Product Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          {productImg ? (
                            <img
                              src={productImg}
                              alt={productName}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                              className="w-12 h-12 rounded-lg object-contain bg-gray-100 border border-gray-200 p-0.5 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs shrink-0 font-medium">
                              No Pic
                            </div>
                          )}
                          <div className="truncate max-w-[200px]">
                            <p className="font-semibold text-gray-900 text-sm truncate" title={productName}>
                              {productName}
                            </p>
                            {review.productId?.category && (
                              <span className="text-xs text-gray-400">
                                {review.productId.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Customer Column */}
                      <td className="px-6 py-4">
                        <div className="min-w-[160px]">
                          <p className="font-medium text-gray-900 text-sm">
                            {customerName}
                          </p>
                          <p className="text-xs text-gray-500 truncate" title={customerEmail}>
                            {customerEmail}
                          </p>
                        </div>
                      </td>

                      {/* Rating Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(review.rating)}
                      </td>

                      {/* Comment Column */}
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line line-clamp-3" title={review.comment}>
                            "{review.comment}"
                          </p>
                        </div>
                      </td>

                      {/* Date Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(review.createdAt || review.date || Date.now()).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(review)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg text-xs font-semibold transition border border-red-200 cursor-pointer"
                          title="Delete review"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
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
                      <p className="font-semibold text-gray-700">No reviews found</p>
                      <p className="text-xs text-gray-400">
                        {search
                          ? "No reviews match your search query."
                          : "Customer reviews will appear here once submitted."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing page {currentPage} of {totalPages} ({totalReviews} total reviews)
          </p>

          <div className="flex items-center gap-2">
            {/* Previous */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                  currentPage === page
                    ? "bg-[#d90416] text-white shadow-xs"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Delete Review
                </h2>
                <p className="text-xs text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mt-4">
              Are you sure you want to delete this customer review for{" "}
              <strong className="text-gray-900">
                "{deleteTarget.productId?.name || "this product"}"
              </strong>
              ? The product's overall rating and review count will be automatically recalculated.
            </p>

            {/* Review Preview snippet */}
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <div className="flex items-center justify-between text-gray-700 font-medium mb-1">
                <span>By {deleteTarget.userName || "Verified Buyer"}</span>
                <span className="text-amber-500 font-bold">★ {deleteTarget.rating}/5</span>
              </div>
              <p className="text-gray-500 italic line-clamp-2">
                "{deleteTarget.comment}"
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#d90416] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Review</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewManagement;
