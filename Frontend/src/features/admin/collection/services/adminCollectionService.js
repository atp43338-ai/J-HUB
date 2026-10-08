import { api } from "../../../../services/api";

// Get all collections
export const getCollections = async () => {
  const data = await api("/admin/collections");

  return data.collections;
};

// Get collection by ID
export const getCollectionById = async (id) => {
  const data = await api(`/admin/collections/${id}`);

  return data.collection;
};

// Create collection
export const createCollection = async (collectionData) => {
  return api("/admin/collections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(collectionData),
  });
};

// Update collection
export const updateCollection = async (id, collectionData) => {
  return api(`/admin/collections/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(collectionData),
  });
};

// Delete collection
export const deleteCollection = async (id) => {
  return api(`/admin/collections/${id}`, {
    method: "DELETE",
  });
};