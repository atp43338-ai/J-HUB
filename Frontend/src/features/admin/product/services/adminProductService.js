import { api } from "../../../../services/api";

export const getProducts = async (page = 1, limit = 5) => {
  const data = await api(
    `/admin/products?page=${page}&limit=${limit}`
  );

  return data;
};

export const createProduct = async (productData) => {
  const data = await api("/admin/products", {
    method: "POST",
    body: productData,
  });

  return data;
};

export const getProductById = async (id) => {
  const data = await api(`/admin/products/${id}`);

  return data.product;
};

export const updateProduct = async (id, productData) => {
  const data = await api(`/admin/products/${id}`, {
    method: "PUT",
    body: productData,
  });

  return data;
};

export const deleteProduct = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  const data = await api(`/admin/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  return data;
};

export const updateProductStatus = async (id, isListed) => {
  const adminToken = localStorage.getItem("adminToken");

  const data = await api(`/admin/products/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      isListed,
    }),
  });

  return data;
};

export const addVariant = async (productId, variantData) => {
  const data = await api(
    `/admin/products/${productId}/variants`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variantData),
    }
  );

  return data;
};

export const getVariants = async (productId) => {
  const data = await api(
    `/admin/products/${productId}/variants`
  );

  return data;
};

export const updateVariant = async (
  productId,
  variantId,
  variantData
) => {
  const data = await api(
    `/admin/products/${productId}/variants/${variantId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variantData),
    }
  );

  return data;
};

export const deleteVariant = async (productId, variantId) => {
  const data = await api(
    `/admin/products/${productId}/variants/${variantId}`,
    {
      method: "DELETE",
    }
  );

  return data;
};