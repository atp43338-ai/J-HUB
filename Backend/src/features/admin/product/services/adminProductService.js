import Product from "../../../product/models/Product.js";


// CREATE PRODUCT
export const createProductService = async (productData) => {

  // Convert price to number
  const price = Number(productData.price);

  // Validate price
  if (
    !Number.isFinite(price) ||
    price < 1 ||
    price > 1000000
  ) {
    throw new Error(
      "Price must be between ₹1 and ₹10,00,000"
    );
  }

  // Save correct number into MongoDB
  productData.price = price;

  const product = await Product.create(productData);

  return product;
};


export const getProductsService = async (page = 1, limit = 5) => {
  const skip = (page - 1) * limit;

  // Admin should see both active and inactive products
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments();

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



// UPDATE PRODUCT
export const updateProductService = async (
  productId,
  productData
) => {
  // Check price only if price is being updated
  if (productData.price !== undefined) {
    const price = Number(productData.price);

    if (
      !Number.isFinite(price) ||
      price < 1 ||
      price > 1000000
    ) {
      throw new Error(
        "Price must be between ₹1 and ₹10,00,000"
      );
    }

    productData.price = price;
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    productData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};



export const deleteProductService = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

// UPDATE PRODUCT STATUS
export const updateProductStatusService = async (
  productId,
  isListed
) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { isListed },
    {
      new: true,
      runValidators: true,
    }
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

