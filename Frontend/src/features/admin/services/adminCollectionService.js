const API_URL = "http://localhost:5000/api/admin/collections";

// Get all collections
export const getCollections = async () => {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch collections");
  }

  return data.collections;
};

// Get collection by ID
export const getCollectionById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch collection");
  }

  return data.collection;
};

// Create collection
export const createCollection = async (collectionData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(collectionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create collection");
  }

  return data;
};

// Update collection
export const updateCollection = async (id, collectionData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(collectionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update collection");
  }

  return data;
};

// Delete collection
export const deleteCollection = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete collection");
  }

  return data;
};