import { api } from "../../../services/api";


// GET ALL ADDRESSES
export const getAddresses = async (token) => {
  return api("/address", {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// GET SINGLE ADDRESS
export const getAddress = async (token, id) => {
  return api(`/address/${id}`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// ADD ADDRESS
export const addAddress = async (token, addressData) => {
  return api("/address", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(addressData),
  });
};


// UPDATE ADDRESS
export const updateAddress = async (
  token,
  id,
  addressData
) => {
  return api(`/address/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(addressData),
  });
};


// DELETE ADDRESS
export const deleteAddress = async (token, id) => {
  return api(`/address/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};