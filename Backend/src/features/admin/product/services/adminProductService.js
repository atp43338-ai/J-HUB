import Product from "../../../product/models/Product.js";

export const createProductService = async (productData) => {
  const product = await Product.create(productData);

  return product;
};

export const getProductsService = async (page = 1, limit = 5) => {
  const skip = (page - 1) * limit;

  const products = await Product.find({
    isListed: true,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments({
    isListed: true,
  });

  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products,
    currentPage: page,
    totalPages,
    totalProducts,
  };
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