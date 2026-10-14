import Review from "../models/Review.js";
import Order from "../../order/models/Order.js";
import Product from "../../product/models/Product.js";
import User from "../../auth/models/User.js";

// GET ALL REVIEWS FOR A PRODUCT (Public)
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10
          ) / 10
        : 0;

    return res.status(200).json({
      success: true,
      reviews,
      averageRating,
      totalReviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch reviews",
    });
  }
};

// CHECK REVIEW ELIGIBILITY (Protected: Delivered buyer who hasn't reviewed yet)
export const checkReviewEligibility = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({
        canReview: false,
        message: "Product ID is required",
      });
    }

    // 1. Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userId,
    });

    if (existingReview) {
      return res.status(200).json({
        canReview: false,
        alreadyReviewed: true,
        message: "You have already reviewed this product.",
      });
    }

    // 2. Check if user has an order containing this product with status "delivered"
    const deliveredOrder = await Order.findOne({
      user: userId,
      status: { $regex: /^delivered$/i },
      items: {
        $elemMatch: {
          product: productId,
          cancelled: { $ne: true },
        },
      },
    });

    if (!deliveredOrder) {
      return res.status(200).json({
        canReview: false,
        hasDeliveredOrder: false,
        message:
          "Only customers who have purchased and received this product can write a review.",
      });
    }

    return res.status(200).json({
      canReview: true,
    });
  } catch (error) {
    console.error("Check review eligibility error:", error);
    return res.status(500).json({
      canReview: false,
      message: error.message || "Failed to check review eligibility",
    });
  }
};

// ADD A NEW REVIEW (Protected)
export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Review comment cannot be empty",
      });
    }

    // 1. Check for duplicate review
    const existingReview = await Review.findOne({
      productId,
      userId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already submitted a review for this product",
      });
    }

    // 2. Validate delivery status on the server
    const deliveredOrder = await Order.findOne({
      user: userId,
      status: { $regex: /^delivered$/i },
      items: {
        $elemMatch: {
          product: productId,
          cancelled: { $ne: true },
        },
      },
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        message:
          "You can only review products that have been delivered to you",
      });
    }

    // 3. Get user's name
    const user = await User.findById(userId).select("name");
    const userName = user?.name || "Verified Buyer";

    // 4. Create review
    const review = await Review.create({
      productId,
      userId,
      userName,
      rating: numRating,
      comment: comment.trim(),
    });

    // 5. Update Product's average rating and total review count
    const allReviews = await Review.find({ productId });
    const totalReviews = allReviews.length;
    const averageRating =
      totalReviews > 0
        ? Math.round(
            (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) *
              10
          ) / 10
        : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: averageRating,
      totalReviews,
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      review,
      averageRating,
      totalReviews,
    });
  } catch (error) {
    console.error("Add review error:", error);

    // Handle Mongo duplicate key error if concurrent submissions occur
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    return res.status(500).json({
      message: error.message || "Failed to submit review",
    });
  }
};

// GET ALL REVIEWS FOR ADMIN (Protected: Admin)
export const getAllReviewsForAdmin = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : "";

    let query = {};
    if (search) {
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

// DELETE REVIEW FOR ADMIN (Protected: Admin)
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

