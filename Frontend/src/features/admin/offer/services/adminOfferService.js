import { api } from "../../../../services/api";

// CREATE OFFER
export const createOffer = async (offerData) => {
  const adminToken = localStorage.getItem("adminToken");

  return api("/admin/offers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(offerData),
  });
};

// GET ALL OFFERS
export const getAllOffers = async () => {
  const adminToken = localStorage.getItem("adminToken");

  return api("/admin/offers", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};

// GET SINGLE OFFER
export const getOfferById = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/offers/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};

// UPDATE OFFER
export const updateOffer = async (id, offerData) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/offers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(offerData),
  });
};

// DELETE OFFER
export const deleteOffer = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/offers/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};

// UPDATE OFFER STATUS
export const updateOfferStatus = async (id, status) => {
  const adminToken = localStorage.getItem("adminToken");

  return api(`/admin/offers/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status }),
  });
};