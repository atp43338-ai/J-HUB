import Product from "../models/Product.js";

export const createProductService = async (productData) => {
  const product = await Product.create(productData);

  return product;
};

export const getProductsService = async () => {
  const products = await Product.find({
    isListed: true,
  });

  return products;
};

export const getProductByIdService = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const updateProductService = async (productId, productData) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    productData,
    { new: true }
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const deleteProductService = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { isListed: false },
    { new: true }
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};