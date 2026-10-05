const API_URL = "http://localhost:5000/api/admin/products";

export const getProducts = async (page = 1, limit = 5) => {
  const response = await fetch(
    `${API_URL}?page=${page}&limit=${limit}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data;
};

export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
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

  return data.product;
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
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to permanently delete product");
  }

  return data;
};



export const updateProductStatus = async (id, isListed) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      isListed,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update product status"
    );
  }

  return data;
};



export const addVariant = async (productId, variantData) => {
  const response = await fetch(
    `http://localhost:5000/api/admin/products/${productId}/variants`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variantData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add variant");
  }

  return data;
};


export const getVariants = async (productId) => {
  const response = await fetch(
    `http://localhost:5000/api/admin/products/${productId}/variants`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch variants");
  }

  return data;
};



export const updateVariant = async (
  productId,
  variantId,
  variantData
) => {
  const response = await fetch(
    `http://localhost:5000/api/admin/products/${productId}/variants/${variantId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variantData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update variant");
  }

  return data;
};



export const deleteVariant = async (productId, variantId) => {
  const response = await fetch(
    `http://localhost:5000/api/admin/products/${productId}/variants/${variantId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete variant");
  }

  return data;
};