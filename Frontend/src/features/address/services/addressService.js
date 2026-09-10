// GET ALL ADDRESSES
export const getAddresses = async (token) => {
  const response = await fetch(
    "http://localhost:5000/api/address",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};


// GET SINGLE ADDRESS
export const getAddress = async (token, id) => {
  const response = await fetch(
    `http://localhost:5000/api/address/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};


// ADD ADDRESS
export const addAddress = async (token, addressData) => {
  const response = await fetch(
    "http://localhost:5000/api/address",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};


// UPDATE ADDRESS
export const updateAddress = async (token, id, addressData) => {
  const response = await fetch(
    `http://localhost:5000/api/address/${id}`,
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
    throw new Error(data.message);
  }

  return data;
};


// DELETE ADDRESS
export const deleteAddress = async (token, id) => {
  const response = await fetch(
    `http://localhost:5000/api/address/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};