import {
  getWishlistService,
  addToWishlistService,
  removeFromWishlistService,
  clearWishlistService,
} from "../services/wishlistService.js";

// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await getWishlistService(userId);

    res.status(200).json({
      wishlist,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const wishlist = await addToWishlistService(
      userId,
      productId
    );

    res.status(201).json({
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist =
      await removeFromWishlistService(
        userId,
        productId
      );

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist =
      await clearWishlistService(userId);

    res.status(200).json({
      message: "Wishlist cleared successfully",
      wishlist,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};