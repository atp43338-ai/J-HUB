

// for profile.

export const getProfile = async (token) => {
  const response = await fetch("http://localhost:5000/api/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};



// for cahnge email



export const changeEmail = async (token, name, phone, newEmail) => {
  const response = await fetch(
    "http://localhost:5000/api/profile/change-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        phone,
        newEmail,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

// for update email.



export const updateProfile = async (token, formData) => {
  const response = await fetch("http://localhost:5000/api/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

// for email verificaion.



export const verifyEmailChange = async (token, otp) => {
  const response = await fetch(
    "http://localhost:5000/api/profile/verify-email-change",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        otp,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};