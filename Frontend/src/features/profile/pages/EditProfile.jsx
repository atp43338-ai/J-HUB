import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  getProfile,
  changeEmail,
  updateProfile,
  getProfileImageUrl,
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
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);

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

        if (data.user) {
          const stored = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem(
            "user",
            JSON.stringify({ ...stored, ...data.user })
          );
          window.dispatchEvent(new Event("userUpdated"));
        }
      } catch (error) {
        console.error("Profile error:", error);
        toast.error(error.message);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle image selection with validation and instant preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file works
    e.target.value = "";

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Save changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    // Phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      toast.error(
        "Please enter a valid 10-digit phone number"
      );
      return;
    }

    try {
      setSaving(true);
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

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const res = await updateProfile(token, formData);
      const newUrl = res?.imageUrl || res?.user?.profileImage;

      // Update localStorage & sync global state
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...stored,
          ...(res?.user || {}),
          name,
          phone,
          profileImage: newUrl || stored.profileImage,
        })
      );
      window.dispatchEvent(new Event("userUpdated"));

      toast.success(
        imageFile
          ? "Profile and photo updated successfully"
          : "Profile updated successfully"
      );

      navigate("/profile");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
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

  // Profile image preview (prioritizes local object URL preview)
  const displayImage = previewUrl || getProfileImageUrl(user.profileImage);

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

            {displayImage ? (
              <img
                src={displayImage}
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
            htmlFor="profileImageInput"
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
              shadow-md
            "
            title="Change Profile Photo"
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
            id="profileImageInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange}
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
            JPG, PNG or WebP formats (Max 5MB)
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
            disabled={saving}
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
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {saving ? "Saving Changes..." : "Save Changes"}
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