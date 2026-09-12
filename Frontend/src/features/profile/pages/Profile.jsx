import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Profilebg from "../asset/Profile-bg.png";
import { getProfile } from "../services/profileService";
import toast from "react-hot-toast";

function Profile() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

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
      } catch (error) {
        console.error("Profile error:", error);
        toast.error(error.message);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Profile image URL
  const profileImageUrl = user?.profileImage
    ? user.profileImage.startsWith("http")
      ? user.profileImage
      : `http://localhost:5000${user.profileImage}`
    : null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">

      {/* Background Image */}

      <img
        src={Profilebg}
        alt="Profile background"
        className="absolute inset-0 w-full h-full object-fill"
      />

      {/* Main Overlay */}

      <div className="absolute inset-0 flex items-center justify-center">

        {/* Main Profile Container */}

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
              bg-[#111214]/95
              px-6
              py-8
              flex
              flex-col
            "
          >

            {/* Profile */}

            <Link
              to="/profile"
              className="
                w-full
                h-[42px]
                rounded-[7px]
                bg-[#650810]
                flex
                items-center
                px-4
                text-white
                text-[15px]
                font-medium
              "
            >

              {/* Profile Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-4 h-4 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 20.25a7.5 7.5 0 0 1 15 0"
                />
              </svg>

              Profile

            </Link>

            {/* Orders */}

            {/* <button
              type="button"
              className="
                w-full
                h-[42px]
                rounded-[7px]
                flex
                items-center
                px-4
                mt-2
                text-gray-300
                text-[12px]
                font-medium
                hover:bg-white/5
                transition
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-4 h-4 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 8h12M6 12h12M6 16h8"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                />
              </svg>

              Orders

            </button> */}

            {/* Address */}

            <Link
              to="/address"
              className="
                w-full
                h-[42px]
                rounded-[7px]
                flex
                items-center
                px-4
                mt-2
                text-gray-300
                text-[15px]
                font-medium
                hover:bg-white/5
                transition
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-4 h-4 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                />
              </svg>

              Address

            </Link>

            {/* Wishlist */}

            {/* <button
              type="button"
              className="
                w-full
                h-[42px]
                rounded-[7px]
                flex
                items-center
                px-4
                mt-2
                text-gray-300
                text-[12px]
                font-medium
                hover:bg-white/5
                transition
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-4 h-4 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                />
              </svg>

              Wishlist

            </button> */}


            {/* Change Password */}

            <Link
              to="/change-password"
              className="
                w-full
                h-[42px]
                rounded-[7px]
                flex
                items-center
                px-4
                mt-2
                text-gray-300
                text-[15px]
                font-medium
                hover:bg-white/5
                transition
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-4 h-4 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V7a4.5 4.5 0 1 0-9 0v3.5"
                />

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
                  d="M12 14v2"
                />
              </svg>

              Change Password

            </Link>

            {/* Settings */}

            <button
              type="button"
              className="
                w-full
                h-[42px]
                rounded-[7px]
                flex
                items-center
                px-4
                mt-2
                text-gray-300
                text-[15px]
                font-medium
                hover:bg-white/5
                transition
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-4 h-4 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.04H6.6v-2.4h.24A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88L8 8.06l1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.68 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.04h.24v2.4h-.24A1.7 1.7 0 0 0 19.4 15Z"
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
                h-[42px]
                rounded-[7px]
                flex
                items-center
                px-4
                mt-2
                text-gray-300
                text-[15px]
                font-medium
                hover:bg-white/5
                transition
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-4 h-4 mr-3"
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

            {/* Sidebar Bottom Text */}

            <div className="mt-auto px-2">

              <div/>

            </div>

          </div>

          {/* ========================================= */}
          {/* RIGHT PROFILE SECTION */}
          {/* ========================================= */}

          <div
            className="
              w-[72%]
              h-full
              bg-white
              px-10
              py-8
              relative
            "
          >

            {/* Heading */}

            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                 <span className="text-black">My </span>
                 <span className="text-[#d90416]">Profile</span>
               </h2>

                <p className="text-[11px] text-gray-500 mt-1">
                  Manage your personal information
                </p>

              </div>

              {/* Profile Image */}

              <div
                className="
                  w-[70px]
                  h-[70px]
                  rounded-full
                  bg-[#e5e7eb]
                  overflow-hidden
                  flex
                  items-center
                  justify-center
                  relative
                "
              >

                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-[38px] h-[38px] text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 20.25a7.5 7.5 0 0 1 15 0"
                    />
                  </svg>
                )}

                {/* Camera Icon */}

                <div
                  className="
                    absolute
                    right-0
                    bottom-0
                    w-[22px]
                    h-[22px]
                    rounded-full
                    bg-[#d90416]
                    flex
                    items-center
                    justify-center
                    border-2
                    border-white
                  "
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-[11px] h-[11px] text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7h3l2-2h6l2 2h3v11H4V7Z"
                    />

                    <circle
                      cx="12"
                      cy="13"
                      r="3"
                    />
                  </svg>

                </div>

              </div>

            </div>

            {/* Form Fields */}

            <div className="mt-8 space-y-5">

              {/* Full Name */}

              <div>

                <label className="block text-[11px] font-medium text-[#222] mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <input
                    type="text"
                    value={user?.name || ""}
                    readOnly
                    className="
                      w-full
                      h-[40px]
                      rounded-[7px]
                      border
                      border-[#d7d7d7]
                      bg-white
                      px-4
                      text-[12px]
                      text-[#222]
                      outline-none
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 20.25a7.5 7.5 0 0 1 15 0"
                    />
                  </svg>

                </div>

              </div>

              {/* Email */}

              <div>

                <label className="block text-[11px] font-medium text-[#222] mb-2">
                  Email
                </label>

                <div className="relative">

                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="
                      w-full
                      h-[40px]
                      rounded-[7px]
                      border
                      border-[#d7d7d7]
                      bg-white
                      px-4
                      text-[12px]
                      text-[#222]
                      outline-none
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

                <label className="block text-[11px] font-medium text-[#222] mb-2">
                  Phone Number
                </label>

                <div className="relative">

                  <input
                    type="tel"
                    value={user?.phone || ""}
                    readOnly
                    className="
                      w-full
                      h-[40px]
                      rounded-[7px]
                      border
                      border-[#d7d7d7]
                      bg-white
                      px-4
                      text-[12px]
                      text-[#222]
                      outline-none
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

            </div>

            {/* Edit Profile Button */}

            <Link
              to="/edit-profile"
              className="
                absolute
                left-10
                right-10
                bottom-8
                h-[42px]
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
              Edit Profile
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;