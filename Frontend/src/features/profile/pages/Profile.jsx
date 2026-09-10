import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Profilebg from "../asset/Profile-bg.png";
import { getProfile } from "../services/profileService";

function Profile() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          navigate("/login");
          return;
        }

        const data = await getProfile(token);

        setUser(data.user);
      } catch (error) {
        console.error("Profile error:", error);
        alert(error.message);
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

      {/* Profile Content */}

      <div className="absolute inset-0">

        {/* Profile Image */}

        <div
          className="
            absolute
            left-[17%]
            top-[15%]
            w-[120px]
            h-[120px]
            rounded-full
            border
            border-white
            bg-[#1c2022]
            overflow-hidden
            flex
            items-center
            justify-center
          "
        >
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            // User Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-[65px] h-[65px] text-gray-400"
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
        </div>

        {/* My Profile Heading */}

        <div
          className="
            absolute
            left-[55%]
            top-[19%]
          "
        >
          <h2 className="text-[38px] font-bold leading-none">
            <span className="text-[#d90416]">My</span>
            <span className="text-white ml-2">Profile</span>
          </h2>

          <p className="text-[15px] text-gray-300 mt-3">
            Manage your personal information
          </p>
        </div>

        {/* Name */}

        <p
          className="
            absolute
            left-[19%]
            top-[32%]
            text-[25px]
            font-bold
            text-white
          "
        >
          {user?.name || "Loading..."}
        </p>

        {/* User */}

        <p
          className="
            absolute
            left-[20%]
            top-[35%]
            text-[15px]
            text-gray-300
          "
        >
          User
        </p>

        {/* Full Name */}

        <div className="absolute left-[47%] top-[30%]">

          <label className="block text-[15px] text-gray-300 mb-2">
            Full Name
          </label>

          <input
            type="text"
            value={user?.name || ""}
            readOnly
            className="
              w-[500px]
              h-[55px]
              rounded-[14px]
              border
              bg-[#1c2022]
              px-5
              text-[16px]
              text-white
              outline-none
            "
          />

        </div>

        {/* Email Address */}

        <div className="absolute left-[47%] top-[43%]">

          <label className="block text-[15px] text-gray-300 mb-2">
            Email Address
          </label>

          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="
              w-[500px]
              h-[55px]
              rounded-[14px]
              border
              bg-[#1c2022]
              px-5
              text-[16px]
              text-white
              outline-none
            "
          />

        </div>

        {/* Phone Number */}

        <div className="absolute left-[47%] top-[55%]">

          <label className="block text-[15px] text-gray-300 mb-2">
            Phone Number
          </label>

          <input
            type="tel"
            value={user?.phone || ""}
            readOnly
            className="
              w-[500px]
              h-[55px]
              rounded-[14px]
              border
              bg-[#1c2022]
              px-5
              text-[16px]
              text-white
              outline-none
            "
          />

        </div>

        {/* Edit Profile */}

        <Link
          to="/edit-profile"
          className="
            absolute
            left-[47%]
            top-[78%]
            w-[33%]
            h-[55px]
            rounded-[14px]
            bg-[#d90416]
            hover:bg-[#b90312]
            flex
            items-center
            justify-center
            text-white
            text-[16px]
            font-semibold
            transition
          "
        >
          Edit Profile
        </Link>

        {/* Profile Button */}

        <Link
          to="/profile"
          className="
            absolute
            left-[10%]
            top-[40%]
            w-[20%]
            h-[40px]
            rounded-[14px]
            border
            border-white
            hover:bg-white/20
            flex
            items-center
            justify-center
            text-white
            text-[12px]
            font-semibold
            transition
          "
        >
          Profile
        </Link>

        {/* Change Password */}

        <Link
          to="/change-password"
          className="
            absolute
            left-[10%]
            top-[48%]
            w-[20%]
            h-[40px]
            rounded-[14px]
            border
            border-white
            hover:bg-white/20
            flex
            items-center
            justify-center
            text-white
            text-[12px]
            font-semibold
            transition
          "
        >
          Change Password
        </Link>

        {/* Address */}

        <Link
          to="/address"
          className="
            absolute
            left-[10%]
            top-[56%]
            w-[20%]
            h-[40px]
            rounded-[14px]
            border
            border-white
            hover:bg-white/20
            flex
            items-center
            justify-center
            text-white
            text-[12px]
            font-semibold
            transition
          "
        >
          Address
        </Link>

        {/* Logout */}

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="
            absolute
            left-[25%]
            top-[77%]
            w-[10%]
            h-[40px]
            rounded-[20px]
            border
            border-white
            hover:bg-white/30
            flex
            items-center
            justify-center
            text-white
            text-[12px]
            font-semibold
            transition
          "
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Profile;