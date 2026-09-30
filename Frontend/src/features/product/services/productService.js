
//this is product list address.
const API_URL = "http://localhost:5000/api/products";


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
  const response = await fetch(
    `${API_URL}?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}&sort=${sort}&category=${encodeURIComponent(
      category
    )}&minPrice=${minPrice}&maxPrice=${maxPrice}&brand=${encodeURIComponent(
      brand
    )}&collection=${encodeURIComponent(collection)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data;
};



// Get one product using its ID
export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product");
  }

  return data;
};



// Get related products for a specific product
export const getRelatedProducts = async (productId) => {
  const response = await fetch(
    `${API_URL}/${productId}/related`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch related products"
    );
  }

  return data;
};