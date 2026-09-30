import Wishlist from "../models/Wishlist.js";
import Product from "../../product/models/Product.js";

// Get wishlist
export const getWishlistService = async (userId) => {
  let wishlist = await Wishlist.findOne({
    user: userId,
  }).populate("products");

  // If wishlist doesn't exist, return empty wishlist
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [],
    });
  }

  return wishlist;
};

// Add product to wishlist
export const addToWishlistService = async (
  userId,
  productId
) => {
  // Check product
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Don't allow blocked/unlisted products
  if (product.isBlocked || !product.isListed) {
    throw new Error("Product is not available");
  }

  // Find user's wishlist
  let wishlist = await Wishlist.findOne({
    user: userId,
  });

  // Create wishlist if it doesn't exist
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [productId],
    });

    return wishlist.populate("products");
  }

  // Check if product already exists
  const alreadyExists = wishlist.products.some(
    (item) => item.toString() === productId
  );

  if (alreadyExists) {
    throw new Error("Product already in wishlist");
  }

  // Add product
  wishlist.products.push(productId);

  await wishlist.save();

  return wishlist.populate("products");
};

// Remove product from wishlist
export const removeFromWishlistService = async (
  userId,
  productId
) => {
  const wishlist = await Wishlist.findOne({
    user: userId,
  });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  const productExists = wishlist.products.some(
    (item) => item.toString() === productId
  );

  if (!productExists) {
    throw new Error("Product not found in wishlist");
  }

  wishlist.products = wishlist.products.filter(
    (item) => item.toString() !== productId
  );

  await wishlist.save();

  return wishlist.populate("products");
};

// Clear wishlist
export const clearWishlistService = async (
  userId
) => {
  const wishlist = await Wishlist.findOne({
    user: userId,
  });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  wishlist.products = [];

  await wishlist.save();

  return wishlist;
};