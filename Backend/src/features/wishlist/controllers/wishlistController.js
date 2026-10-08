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

    const products = wishlist.products.map((item) => ({
      ...item.product.toObject(),
      size: item.size,
    }));

    res.status(200).json({
      wishlist: {
        ...wishlist.toObject(),
        products,
      },
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

    const { productId, size } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const wishlist = await addToWishlistService(
      userId,
      productId,
      size
    );

    const products = wishlist.products.map((item) => ({
      ...item.product.toObject(),
      size: item.size,
    }));

    res.status(201).json({
      message: "Product added to wishlist",
      wishlist: {
        ...wishlist.toObject(),
        products,
      },
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

    const products = wishlist.products.map(
      (item) => ({
        ...item.product.toObject(),
        size: item.size,
      })
    );

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: {
        ...wishlist.toObject(),
        products,
      },
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