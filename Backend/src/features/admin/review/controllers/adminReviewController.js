import Review from "../../../review/models/Review.js";
import Product from "../../../product/models/Product.js";
import User from "../../../auth/models/User.js";

// GET ALL REVIEWS FOR ADMIN
export const getAllReviewsForAdmin = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : "";

    let query = {};
    if (search) {
      // Find matching products or users to include in review search
      const matchingProducts = await Product.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");
      const matchingProductIds = matchingProducts.map((p) => p._id);

      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      const matchingUserIds = matchingUsers.map((u) => u._id);

      query = {
        $or: [
          { comment: { $regex: search, $options: "i" } },
          { userName: { $regex: search, $options: "i" } },
          { productId: { $in: matchingProductIds } },
          { userId: { $in: matchingUserIds } },
        ],
      };
    }

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit) || 1;

    const reviews = await Review.find(query)
      .populate("productId", "name images price category")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      reviews,
      totalReviews,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Get admin reviews error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reviews",
    });
  }
};

// DELETE REVIEW FOR ADMIN
export const deleteReviewForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const productId = review.productId;

    await Review.findByIdAndDelete(id);

    // Recalculate affected product's rating metrics
    if (productId) {
      const remainingReviews = await Review.find({ productId });
      const numReviews = remainingReviews.length;
      const avg =
        numReviews > 0
          ? Math.round(
              (remainingReviews.reduce((sum, r) => sum + r.rating, 0) /
                numReviews) *
                10
            ) / 10
          : 0;

      await Product.findByIdAndUpdate(productId, {
        rating: avg,
        averageRating: avg,
        totalReviews: numReviews,
        numReviews: numReviews,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete review",
    });
  }
};
