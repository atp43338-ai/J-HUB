import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProfileImage from "../asset/Profile-bg.png";
import {
  getProfile,
  changeEmail,
  updateProfile,
} from "../services/profileService";

import toast from "react-hot-toast";

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
      <div className="fixed inset-0 flex items-center justify-center bg-[#111214] text-white">
        Loading...
      </div>
    );
  }

  // Profile image preview
  const imagePreview = profileImage
    ? URL.createObjectURL(profileImage)
    : user.profileImage
      ? user.profileImage.startsWith("http")
        ? user.profileImage
        : `http://localhost:5000${user.profileImage}`
      : ProfileImage;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">

      {/* Background */}

      <img
        src={ProfileImage}
        alt="Profile background"
        className="absolute inset-0 w-full h-full object-fill"
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/25"></div>

      {/* Main Container */}

      <div className="absolute inset-0 flex items-center justify-center">

        <div
          className="
            w-[70%]
            h-[82%]
            flex
            overflow-hidden
            rounded-[18px]
            shadow-2xl
          "
        >

          {/* ========================================= */}
          {/* LEFT SIDEBAR */}
          {/* ========================================= */}

          <div
            className="
              w-[28%]
              h-full
              bg-[#111214]
              px-5
              py-7
              flex
              flex-col
            "
          >

            {/* Profile */}

            <button
              onClick={() => navigate("/profile")}
              className="
                w-full
                h-[54px]
                rounded-[9px]
                flex
                items-center
                px-5
                text-white
                text-[14px]
                font-semibold
              "
            >

              {/* Profile Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-5 h-5 mr-4"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 20a7 7 0 0 1 14 0"
                />
              </svg>

              Profile

            </button>

            {/* Address */}

            <button
              onClick={() => navigate("/address")}
              className="
                w-full
                h-[54px]
                rounded-[9px]
                flex
                items-center
                px-5
                mt-2
                text-gray-300
                text-[14px]
                font-semibold
                hover:bg-white/5
                transition
              "
            >

              {/* Location Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-5 h-5 mr-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
                />

                <circle
                  cx="12"
                  cy="10"
                  r="2.5"
                />
              </svg>

              Address

            </button>

            {/* Change Password */}

            <button
              onClick={() => navigate("/change-password")}
              className="
                w-full
                h-[54px]
                rounded-[9px]
                flex
                items-center
                px-5
                mt-2
                text-gray-300
                text-[14px]
                font-semibold
                bg-white/[0.02]
                hover:bg-white/5
                transition
              "
            >

              {/* Lock Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-5 h-5 mr-4"
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

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14v2"
                />
              </svg>

              Change Password

            </button>

            {/* Settings */}

            <button
              type="button"
              className="
                w-full
                h-[54px]
                rounded-[9px]
                flex
                items-center
                px-5
                mt-2
                text-gray-300
                text-[14px]
                font-semibold
                bg-white/[0.02]
                hover:bg-white/5
                transition
              "
            >

              {/* Settings Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-5 h-5 mr-4"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.05.05-1.7 1.7-.05-.05a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.05.05-1.7-1.7.05-.05A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.04H6.6v-2.4h.24A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88l-.05-.05 1.7-1.7.05.05a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.68 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.05-.05 1.7 1.7-.05.05A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.04h.24v2.4h-.24A1.7 1.7 0 0 0 19.4 15Z"
                />
              </svg>

              Settings

            </button>

            {/* Logout */}

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/", { replace: true });
              }}
              className="
                w-full
                h-[54px]
                rounded-[9px]
                flex
                items-center
                px-5
                mt-2
                text-gray-300
                text-[14px]
                font-semibold
                hover:bg-white/5
                transition
              "
            >

              {/* Logout Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-5 h-5 mr-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 17l5-5-5-5"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H3"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 19V5a2 2 0 0 0-2-2h-6"
                />
              </svg>

              Logout

            </button>

          </div>

          {/* ========================================= */}
          {/* RIGHT SIDE */}
          {/* ========================================= */}

          <div
            className="
              w-[72%]
              h-full
              bg-white
              relative
              px-10
              py-8
            "
          >

            {/* Header */}

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                 <span className="text-black">Edit </span>
                 <span className="text-[#d90416]">Profile</span>
               </h2>

                <p className="text-[11px] text-gray-500 mt-1">
                  Update your personal information
                </p>

              </div>

              {/* Profile Image */}

              <div className="relative">

                <img
                  src={imagePreview}
                  alt="Profile"
                  className="
                    w-[72px]
                    h-[72px]
                    rounded-full
                    object-cover
                    border
                    border-[#ddd]
                  "
                />

                {/* Edit Image Button */}

                <label
                  htmlFor="profileImage"
                  className="
                    absolute
                    right-0
                    bottom-0
                    w-[24px]
                    h-[24px]
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
                    className="w-[12px] h-[12px] text-white"
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

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Full Name */}

              <div>

                <label className="block text-[11px] font-semibold text-[#222] mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="
                      w-full
                      h-[42px]
                      rounded-[7px]
                      border
                      border-[#d5d5d5]
                      bg-white
                      px-4
                      pr-11
                      text-[12px]
                      text-[#222]
                      outline-none
                      focus:border-[#d90416]
                      transition
                    "
                  />

                  {/* User Icon */}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      w-4
                      h-4
                      text-[#d90416]
                    "
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="3.5"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 20a7 7 0 0 1 14 0"
                    />
                  </svg>

                </div>

              </div>

              {/* Email */}

              <div>

                <label className="block text-[11px] font-semibold text-[#222] mb-2">
                  Email
                </label>

                <div className="relative">

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      w-full
                      h-[42px]
                      rounded-[7px]
                      border
                      border-[#d5d5d5]
                      bg-white
                      px-4
                      pr-11
                      text-[12px]
                      text-[#222]
                      outline-none
                      focus:border-[#d90416]
                      transition
                    "
                  />

                  {/* Email Icon */}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      w-4
                      h-4
                      text-[#d90416]
                    "
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7l9 6 9-6"
                    />
                  </svg>

                </div>

              </div>

              {/* Phone */}

              <div>

                <label className="block text-[11px] font-semibold text-[#222] mb-2">
                  Phone Number
                </label>

                <div className="relative">

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="
                      w-full
                      h-[42px]
                      rounded-[7px]
                      border
                      border-[#d5d5d5]
                      bg-white
                      px-4
                      pr-11
                      text-[12px]
                      text-[#222]
                      outline-none
                      focus:border-[#d90416]
                      transition
                    "
                  />

                  {/* Phone Icon */}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      w-4
                      h-4
                      text-[#d90416]
                    "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.6 3.5 9 3l2 4.5-2.1 1.7a12.5 12.5 0 0 0 5.9 5.9l1.7-2.1 4.5 2 .5 2.4c.2 1-.6 1.9-1.6 2A16.5 16.5 0 0 1 4.6 5.1c.1-1 .9-1.8 2-1.6Z"
                    />
                  </svg>

                </div>

              </div>

              {/* Save Changes */}

              <button
                type="submit"
                className="
                  w-full
                  h-[42px]
                  mt-3
                  rounded-[7px]
                  bg-[#d90416]
                  hover:bg-[#b90312]
                  flex
                  items-center
                  justify-center
                  text-white
                  text-[12px]
                  font-semibold
                  transition
                "
              >
                Save Changes
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EditProfile;