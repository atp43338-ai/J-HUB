const API_URL = "http://localhost:5000/api/admin/categories";

// Add Category
export const createCategory = async (categoryData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create category");
  }

  return data;
};

// Get Categories
export const getCategories = async (
  page = 1,
  limit = 5,
  search = ""
) => {
  const response = await fetch(
    `${API_URL}?page=${page}&limit=${limit}&search=${search}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch categories");
  }

  return data;
};

// Get Category By ID
export const getCategoryById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch category");
  }

  return data.category;
};

// Update Category
export const updateCategory = async (id, categoryData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update category");
  }

  return data;
};

// Delete Category
export const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete category");
  }

  return data;
};