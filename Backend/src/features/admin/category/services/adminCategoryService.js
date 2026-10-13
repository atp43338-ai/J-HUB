import Category from "../models/category.js";

// Add Category
export const createCategoryService = async (categoryData) => {
  const trimmedName = categoryData.name?.trim();

  // Case-insensitive duplicate check
  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
  });

  if (existingCategory) {
    const error = new Error("Category name already exists");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.create({
    ...categoryData,
    name: trimmedName,
  });

  return category;
};

// Get Categories
export const getCategoriesService = async (
  page = 1,
  limit = 5,
  search = ""
) => {
  const skip = (page - 1) * limit;

  const query = {
    isListed: true,
  };

  if (search) {
    query.name = {
      $regex: search,$options: "i",
    };
  }

  const categories = await Category.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCategories = await Category.countDocuments(query);
  const totalPages = Math.ceil(totalCategories / limit);

  return {
    categories,
    currentPage: page,
    totalPages,
    totalCategories,
  };
};

// Get Category By ID
export const getCategoryByIdService = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

// Edit Category
export const updateCategoryService = async (
  categoryId,
  categoryData
) => {
  if (categoryData.name) {
    const trimmedName = categoryData.name.trim();

    // Prevent renaming to another category that already exists
    const existingCategory = await Category.findOne({
      _id: { $ne: categoryId },
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });

    if (existingCategory) {
      const error = new Error("Category name already exists");
      error.statusCode = 400;
      throw error;
    }

    categoryData.name = trimmedName;
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    categoryData,
    { new: true }
  );

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

// Delete Category
export const deleteCategoryService = async (categoryId) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { isListed: false },
    { new: true }
  );

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};