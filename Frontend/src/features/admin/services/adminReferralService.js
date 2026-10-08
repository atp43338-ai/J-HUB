const API_URL = "http://localhost:5000/api/admin/referrals";

// CREATE REFERRAL OFFER
export const createReferralOffer = async (referralData) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(referralData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create referral offer"
    );
  }

  return data;
};

// GET ALL REFERRAL OFFERS
export const getAllReferralOffers = async () => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch referral offers"
    );
  }

  return data;
};

// GET REFERRAL OFFER BY ID
export const getReferralOfferById = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch referral offer"
    );
  }

  return data;
};

// UPDATE REFERRAL OFFER
export const updateReferralOffer = async (
  id,
  referralData
) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(referralData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update referral offer"
    );
  }

  return data;
};

// DELETE REFERRAL OFFER
export const deleteReferralOffer = async (id) => {
  const adminToken = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete referral offer"
    );
  }

  return data;
};

// UPDATE REFERRAL OFFER STATUS
export const updateReferralOfferStatus = async (
  id,
  status
) => {
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
    throw new Error(
      data.message ||
        "Failed to update referral offer status"
    );
  }

  return data;
};