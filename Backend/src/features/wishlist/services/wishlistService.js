import Wishlist from "../models/Wishlist.js";
import Product from "../../product/models/Product.js";

// Get wishlist
export const getWishlistService = async (userId) => {
  let wishlist = await Wishlist.findOne({
    user: userId,
  }).populate("products.product");

  // If wishlist doesn't exist, create empty wishlist
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [],
    });

    return wishlist;
  }

  return wishlist;
};

// Add product to wishlist
export const addToWishlistService = async (
  userId,
  productId,
  size
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

  // Find selected variant
  let selectedVariant;

  if (size) {
    selectedVariant = product.variants?.find(
      (variant) => variant.size === size
    );

    if (!selectedVariant) {
      throw new Error("Selected size is not available");
    }

    if (selectedVariant.stock <= 0) {
      throw new Error("Selected size is out of stock");
    }
  } else {
    // Automatically select first available size
    selectedVariant = product.variants?.find(
      (variant) => variant.stock > 0
    );

    if (!selectedVariant) {
      throw new Error(
        "Product is out of stock"
      );
    }
  }

  // Use selected/automatic size
  const selectedSize = selectedVariant.size;

  // Find user's wishlist
  let wishlist = await Wishlist.findOne({
    user: userId,
  });

  // Create wishlist if it doesn't exist
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [
        {
          product: productId,
          size: selectedSize,
        },
      ],
    });

    return wishlist.populate("products.product");
  }

  // Check if product already exists
  const alreadyExists = wishlist.products.some(
    (item) =>
      item.product.toString() === productId
  );

  if (alreadyExists) {
    throw new Error(
      "Product already in wishlist"
    );
  }

  // Add product with automatic size
  wishlist.products.push({
    product: productId,
    size: selectedSize,
  });

  await wishlist.save();

  return wishlist.populate("products.product");
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
    (item) =>
      item.product.toString() === productId
  );

  if (!productExists) {
    throw new Error("Product not found in wishlist");
  }

  wishlist.products = wishlist.products.filter(
    (item) =>
      item.product.toString() !== productId
  );

  await wishlist.save();

  return wishlist.populate("products.product");
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