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
    res.status(500).json({
      message: error.message,
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
    res.status(500).json({
      message: error.message,
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
    res.status(404).json({
      message: error.message,
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
    res.status(404).json({
      message: error.message,
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
    res.status(404).json({
      message: error.message,
    });
  }
};