const API_URL = "http://localhost:5000/api/products";

export const getProducts = async (
  page = 1,
  limit = 6,
  search = "",
  sort = "",
  category = "",
  minPrice = "",
  maxPrice = "",
  brand = ""
) => {
  const response = await fetch(
    `${API_URL}?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}&sort=${sort}&category=${encodeURIComponent(
      category
    )}&minPrice=${minPrice}&maxPrice=${maxPrice}&brand=${encodeURIComponent(
      brand
    )}`
  );
  

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data;
};


export const createProduct = async (productData) => {
  const response = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    body: productData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create product");
  }

  return data;
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product");
  }

  return data;
};


export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: productData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update product");
  }

  return data;
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }

  return data;
};