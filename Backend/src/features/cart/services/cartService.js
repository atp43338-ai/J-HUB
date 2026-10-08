import Cart from "../models/Cart.js";
import Product from "../../product/models/Product.js";

// Add item to cart
export const addToCartService = async (
  userId,
  productId,
  size,
  quantity
) => {
  // Find product
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Find selected size variant
  const variant = product.variants.find(
    (item) => item.size === size
  );

  if (!variant) {
    throw new Error("Selected size not available");
  }

  // Check stock
  if (variant.stock < quantity) {
    throw new Error("Not enough stock");
  }

  // Find user's cart
  let cart = await Cart.findOne({ user: userId });

  // If cart doesn't exist, create it
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [
        {
          product: productId,
          size,
          quantity,
        },
      ],
    });

    return cart;
  }

  // Check if same product + same size already exists
  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.size === size
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (variant.stock < newQuantity) {
      throw new Error("Not enough stock");
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      size,
      quantity,
    });
  }

  await cart.save();

  return cart;
};

// Get user's cart
export const getCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product"
  );

  if (!cart) {
    return {
      user: userId,
      items: [],
    };
  }

  return cart;
};



// Update cart item quantity
export const updateCartItemService = async (
  userId,
  itemId,
  quantity
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = cart.items.id(itemId);

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Find product
  const product = await Product.findById(cartItem.product);

  if (!product) {
    throw new Error("Product not found");
  }

  // Find selected size variant
  const variant = product.variants.find(
    (item) => item.size === cartItem.size
  );

  if (!variant) {
    throw new Error("Selected size is not available");
  }

  // Check stock
  if (quantity > variant.stock) {
    throw new Error("Not enough stock");
  }

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  // Update quantity
  cartItem.quantity = quantity;

  await cart.save();

  return cart;
};


// Remove cart item
export const removeCartItemService = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = cart.items.id(itemId);

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  cart.items.pull(itemId);

  await cart.save();

  return cart;
};

// Remove purchased items from cart
export const removePurchasedItemsFromCartService = async (
  userId,
  purchasedItems
) => {
  const cart = await Cart.findOne({ user: userId });

  // No cart = nothing to remove
  if (!cart) {
    return null;
  }

  // Remove only purchased product + size combinations
  cart.items = cart.items.filter((cartItem) => {
    const isPurchased = purchasedItems.some(
      (purchasedItem) =>
        cartItem.product.toString() === purchasedItem.productId.toString() &&
        cartItem.size === purchasedItem.size
    );

    return !isPurchased;
  });

  await cart.save();

  return cart;
};