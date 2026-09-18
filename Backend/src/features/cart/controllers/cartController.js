import { addToCartService,
          getCartService ,
          updateCartItemService,
          removeCartItemService,
        } from "../services/cartService.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId, size, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    if (!size) {
      return res.status(400).json({
        message: "Size is required",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await addToCartService(
      userId,
      productId,
      size,
      Number(quantity)
    );

    res.status(201).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await getCartService(userId);

    res.status(200).json({
      cart,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};




export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await updateCartItemService(
      userId,
      itemId,
      Number(quantity)
    );

    res.status(200).json({
      message: "Cart quantity updated successfully",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;

    const cart = await removeCartItemService(userId, itemId);

    res.status(200).json({
      message: "Cart item removed successfully",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};