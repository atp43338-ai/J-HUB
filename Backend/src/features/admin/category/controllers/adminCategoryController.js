import {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/adminCategoryService.js";

// Add Category
export const createCategory = async (req, res) => {
  try {
    const category = await createCategoryService(req.body);

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    // Catch MongoDB duplicate index error code 11000
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Category name already exists",
      });
    }

    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to create category",
    });
  }
};

// Get Categories
export const getCategories = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const data = await getCategoriesService(
      page,
      limit,
      search
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to fetch categories",
    });
  }
};

// Get Category By ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await getCategoryByIdService(req.params.id);

    res.status(200).json({
      category,
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({
      message: error.message || "Category not found",
    });
  }
};

// Edit Category
export const updateCategory = async (req, res) => {
  try {
    const category = await updateCategoryService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Category name already exists",
      });
    }

    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to update category",
    });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await deleteCategoryService(req.params.id);

    res.status(200).json({
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({
      message: error.message || "Failed to delete category",
    });
  }
};