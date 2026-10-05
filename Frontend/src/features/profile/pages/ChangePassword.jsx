import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import ProfileLayout from "../components/ProfileLayout";
import ProfileHeader from "../components/ProfileHeader";
import PasswordInput from "../components/PasswordInput";

import { changePassword } from "../services/profileService";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!currentPassword || !newPassword || !confirmPassword) {
    toast.error("Please fill all fields");
    return;
  }

  if (newPassword.length < 6) {
    toast.error("New password must be at least 6 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    await changePassword(
      token,
      currentPassword,
      newPassword
    );

    toast.success("Password changed successfully");

    navigate("/profile");
  } catch (error) {
    console.error("Change password error:", error);

    toast.error(
      error.message || "Failed to change password"
    );
  }
};

  return (
    <ProfileLayout
      title="Change"
      highlight="Password"
      description="Update your account password"
    >
      <ProfileHeader
        title="Change"
        highlight="Password"
        description="Create a new password for your account"
      />

      {/* Security Information */}
      <div className="mb-8 p-5 rounded-xl border border-red-100 bg-red-50">
        <div className="flex items-start gap-4">

          <div className="w-10 h-10 rounded-lg bg-[#d90416] flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-5 h-5 text-white"
            >
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10V7a4 4 0 0 1 8 0v3"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800">
              Keep your account secure
            </h3>

            <p className="mt-1 text-xs text-gray-500 leading-5">
              Use a password that is difficult for others to
              guess and avoid sharing it with anyone.
            </p>
          </div>

        </div>
      </div>

      {/* Change Password Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-[650px] space-y-6"
      >

        {/* Current Password */}
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(e.target.value)
          }
          placeholder="Enter your current password"
        />

        {/* New Password */}
        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
          placeholder="Enter your new password"
        />

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          placeholder="Confirm your new password"
        />

        {/* Password Requirement */}
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">

          <p className="text-xs font-semibold text-gray-700">
            Password requirement
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Your new password must contain at least 6
            characters.
          </p>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">

          <button
            type="submit"
            className="
              h-[48px]
              px-8
              rounded-lg
              bg-[#d90416]
              hover:bg-[#b90312]
              text-white
              text-sm
              font-semibold
              transition
            "
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="
              h-[48px]
              px-8
              rounded-lg
              border
              border-gray-200
              bg-white
              hover:bg-gray-50
              text-gray-700
              text-sm
              font-semibold
              transition
            "
          >
            Cancel
          </button>

        </div>

      </form>
    </ProfileLayout>
  );
}

export default ChangePassword;