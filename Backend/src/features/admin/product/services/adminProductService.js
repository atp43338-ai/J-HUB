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

// Add Variant
export const addVariantService = async (productId, variantData) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const { size, stock } = variantData;

  if (!size) {
    throw new Error("Size is required");
  }

  if (stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  const existingVariant = product.variants.find(
    (variant) => variant.size === size
  );

  if (existingVariant) {
    throw new Error("This size already exists");
  }

  product.variants.push({
    size,
    stock: Number(stock),
  });

  await product.save();

  return product;
};

export const getVariantsService = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  return product.variants;
};


export const updateVariantService = async (
  productId,
  variantId,
  variantData
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    throw new Error("Variant not found");
  }

  const { size, stock } = variantData;

  if (!size) {
    throw new Error("Size is required");
  }

  if (stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  const existingVariant = product.variants.find(
    (item) =>
      item.size === size &&
      item._id.toString() !== variantId
  );

  if (existingVariant) {
    throw new Error("This size already exists");
  }

  variant.size = size;
  variant.stock = Number(stock);

  await product.save();

  return product;
};




export const deleteVariantService = async (productId, variantId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    throw new Error("Variant not found");
  }

  product.variants.pull(variantId);

  await product.save();

  return product;
};