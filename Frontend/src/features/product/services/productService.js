import { api } from "../../../services/api";

// Get all products with search, sort, filters and pagination
export const getProducts = async (
  page = 1,
  limit = 6,
  search = "",
  sort = "",
  category = "",
  minPrice = "",
  maxPrice = "",
  brand = "",
  collection = ""
) => {
  const query = `?page=${page}&limit=${limit}&search=${encodeURIComponent(
    search
  )}&sort=${sort}&category=${encodeURIComponent(
    category
  )}&minPrice=${minPrice}&maxPrice=${maxPrice}&brand=${encodeURIComponent(
    brand
  )}&collection=${encodeURIComponent(collection)}`;

  return api(`/products${query}`);
};


// Get one product using its ID
export const getProductById = async (id) => {
  return api(`/products/${id}`);
};


// Get related products for a specific product
export const getRelatedProducts = async (productId) => {
  return api(`/products/${productId}/related`);
};