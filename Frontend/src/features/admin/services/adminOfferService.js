const API_URL = "http://localhost:5000/api/admin/offers";

// CREATE OFFER
export const createOffer = async (offerData) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(offerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create offer");
  }

  return data;
};

// GET ALL OFFERS
export const getAllOffers = async () => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch offers");
  }

  return data;
};

// GET SINGLE OFFER
export const getOfferById = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch offer");
  }

  return data;
};

// UPDATE OFFER
export const updateOffer = async (id, offerData) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(offerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update offer");
  }

  return data;
};

// DELETE OFFER
export const deleteOffer = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete offer");
  }

  return data;
};

// UPDATE OFFER STATUS
export const updateOfferStatus = async (id, status) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update offer status");
  }

  return data;
};