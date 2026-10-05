import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/returns";


// GET ALL RETURN REQUESTS
export const getAllReturns = async () => {
  const token = localStorage.getItem("adminToken");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


// APPROVE RETURN
export const approveReturn = async (returnId) => {
  const token = localStorage.getItem("adminToken");

  const response = await axios.patch(
    `${API_URL}/${returnId}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// REJECT RETURN
export const rejectReturn = async (returnId) => {
  const token = localStorage.getItem("adminToken");

  const response = await axios.patch(
    `${API_URL}/${returnId}/reject`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};