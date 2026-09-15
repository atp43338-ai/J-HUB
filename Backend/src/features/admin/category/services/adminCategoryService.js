import Category from "../models/Category.js";

// Add Category
export const createCategoryService = async (categoryData) => {
  const category = await Category.create(categoryData);

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
      $regex: search,
      $options: "i",
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
    throw new Error("Category not found");
  }

  return category;
};

// Edit Category
export const updateCategoryService = async (
  categoryId,
  categoryData
) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    categoryData,
    { new: true }
  );

  if (!category) {
    throw new Error("Category not found");
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
    throw new Error("Category not found");
  }

  return category;
};