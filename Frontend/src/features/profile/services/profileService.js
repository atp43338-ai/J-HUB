import { api } from "../../../services/api";


// Get Profile
export const getProfile = async (token) => {
  return api("/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// Change Email
export const changeEmail = async (
  token,
  name,
  phone,
  newEmail
) => {
  return api("/profile/change-email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      phone,
      newEmail,
    }),
  });
};


// Change Password
export const changePassword = async (
  token,
  currentPassword,
  newPassword
) => {
  return api("/auth/change-password", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
};


// Update Profile
export const updateProfile = async (token, formData) => {
  return api("/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};


// Verify Email Change
export const verifyEmailChange = async (token, otp) => {
  return api("/profile/verify-email-change", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      otp,
    }),
  });
};


// Resend Email Change OTP
export const resendEmailChangeOTP = async (token) => {
  return api("/profile/resend-email-change-otp", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};