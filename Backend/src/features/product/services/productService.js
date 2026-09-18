import Product from "../models/Product.js";

export const createProductService = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

export const getProductsService = async (
  page = 1,
  limit = 6,
  search = "",
  sort = "",
  category = "",
  minPrice = "",
  maxPrice = "",
  brand = "",
) => {
  const skip = (page - 1) * limit;

  const query = {
    isListed: true,
    isBlocked: false,
  };

  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    query.category = category;
  }

  if (brand) query.brand = brand;

  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }



  let sortOption = { createdAt: -1 };

  if (sort === "priceLow") {
    sortOption = { price: 1 };
  }

  if (sort === "priceHigh") {
    sortOption = { price: -1 };
  }

  if (sort === "nameAZ") {
    sortOption = { name: 1 };
  }

  if (sort === "nameZA") {
    sortOption = { name: -1 };
  }

  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(query);

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