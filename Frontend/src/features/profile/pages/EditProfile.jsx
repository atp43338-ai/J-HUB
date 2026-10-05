import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import ProfileImage from "../asset/Profile-bg.png";

import {
  getProfile,
  changeEmail,
  updateProfile,
} from "../services/profileService";

import toast from "react-hot-toast";

import ProfileLayout from "../components/ProfileLayout";
import ProfileHeader from "../components/ProfileHeader";
import ProfileInput from "../components/ProfileInput";

function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [oldEmail, setOldEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // Get logged-in user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const data = await getProfile(token);

        setUser(data.user);

        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setPhone(data.user.phone || "");

        // Store original email
        setOldEmail(data.user.email || "");
      } catch (error) {
        console.error("Profile error:", error);
        toast.error(error.message);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Save changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      // Email changed
      if (email !== oldEmail) {
        await changeEmail(
          token,
          name,
          phone,
          email
        );

        toast.success("OTP sent to your new email");

        navigate("/email-verification", {
          state: {
            email: email,
            name: name,
            phone: phone,
            from: "email-change",
          },
        });

        return;
      }

      // Email NOT changed
      const formData = new FormData();

      formData.append("name", name);
      formData.append("phone", phone);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await updateProfile(token, formData);

      toast.success("Profile updated successfully");

      navigate("/profile");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.message);
    }
  };

  if (!user) {
    return (
      <ProfileLayout
        title="Edit"
        highlight="Profile"
        description="Update your personal information"
      >
        <div className="min-h-[450px] flex items-center justify-center">
          <p className="text-gray-500 text-sm">
            Loading profile...
          </p>
        </div>
      </ProfileLayout>
    );
  }

  // Profile image preview
  const imagePreview = profileImage
    ? URL.createObjectURL(profileImage)
    : user.profileImage
      ? user.profileImage.startsWith("http")
        ? user.profileImage
        : `http://localhost:5000${user.profileImage}`
      : null;

  return (
    <ProfileLayout
      title="Edit"
      highlight="Profile"
      description="Update your personal information"
    >
      <ProfileHeader
        title="Edit"
        highlight="Profile"
        description="Update your account details"
      />

      {/* Profile Image Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-gray-200">

        <div className="relative">

          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#d90416] bg-gray-100 flex items-center justify-center">

            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-gray-400">
                {name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}

          </div>

          {/* Edit Image Button */}
          <label
            htmlFor="profileImage"
            className="
              absolute
              right-0
              bottom-0
              w-9
              h-9
              rounded-full
              bg-[#d90416]
              border-2
              border-white
              flex
              items-center
              justify-center
              cursor-pointer
              hover:bg-[#b90312]
              transition
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182L8.25 18.463 3.75 19.5l1.037-4.5L16.862 3.487Z"
              />
            </svg>
          </label>

          {/* Hidden File Input */}
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProfileImage(e.target.files[0])
            }
            className="hidden"
          />

        </div>

        <div>
          <h3 className="text-xl font-bold text-black">
            Profile Photo
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Choose a new profile image
          </p>

          <p className="mt-2 text-xs text-gray-400">
            JPG, PNG or other image formats
          </p>
        </div>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <ProfileInput
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />

          {/* Email */}
          <ProfileInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          {/* Phone */}
          <ProfileInput
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />

        </div>

        {/* Email Change Notice */}
        {email !== oldEmail && (
          <div className="mt-6 p-4 rounded-lg border border-red-100 bg-red-50">

            <p className="text-sm text-red-700">
              Changing your email will require OTP
              verification.
            </p>

          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">

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
            Save Changes
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

export default EditProfile;