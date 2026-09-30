const API_URL =
  "http://localhost:5000/api/address";

// ==========================================
// GET ALL ADDRESSES
// ==========================================

export const getAddresses = async (token) => {
  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch addresses"
    );
  }

  return data;
};


// ==========================================
// GET SINGLE ADDRESS
// ==========================================

export const getAddress = async (
  token,
  id
) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch address"
    );
  }

  return data;
};


// ==========================================
// ADD ADDRESS
// ==========================================

export const addAddress = async (
  token,
  addressData
) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(addressData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to add address"
    );
  }

  return data;
};


// ==========================================
// UPDATE ADDRESS
// ==========================================

export const updateAddress = async (
  token,
  id,
  addressData
) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(addressData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update address"
    );
  }

  return data;
};


// ==========================================
// DELETE ADDRESS
// ==========================================

export const deleteAddress = async (
  token,
  id
) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete address"
    );
  }

  return data;
};