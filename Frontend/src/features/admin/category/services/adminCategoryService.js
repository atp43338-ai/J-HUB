import { api } from "../../../../services/api";

// Add Category
export const createCategory = async (categoryData) => {
  return api("/admin/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });
};


// Get Categories
export const getCategories = async (
  page = 1,
  limit = 5,
  search = ""
) => {
  return api(
    `/admin/categories?page=${page}&limit=${limit}&search=${search}`
  );
};


// Get Category By ID
export const getCategoryById = async (id) => {
  const data = await api(`/admin/categories/${id}`);

  return data.category;
};


// Update Category
export const updateCategory = async (
  id,
  categoryData
) => {
  return api(`/admin/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });
};


// Delete Category
export const deleteCategory = async (id) => {
  return api(`/admin/categories/${id}`, {
    method: "DELETE",
  });
};