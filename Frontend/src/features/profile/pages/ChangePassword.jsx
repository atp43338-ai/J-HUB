import { useState } from "react";
import { useNavigate } from "react-router";
import ProfileImage from "../asset/Profile-bg.png";
import toast from "react-hot-toast";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profile Image
  const [profileImage, setProfileImage] = useState(ProfileImage);

  // Profile Name
  const [name, setName] = useState("Afsal");

  const handleSubmit = (e) => {
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

    toast.success("Password changed successfully");

    navigate("/profile");
  };

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
              type="button"
              onClick={() => navigate("/profile")}
              className="
                w-full
                h-[54px]
                rounded-[9px]
                flex
                items-center
                px-5
                text-gray-300
                text-[14px]
                font-semibold
                hover:bg-white/5
                transition
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
              type="button"
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

            {/* Change Password - Active */}

            <button
              type="button"
              className="
                w-full
                h-[54px]
                rounded-[9px]
                bg-[#650810]
                flex
                items-center
                px-5
                mt-2
                text-white
                text-[14px]
                font-semibold
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
              type="button"
              onClick={() => navigate("/")}
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
                 <span className="text-black">Change </span>
                 <span className="text-[#d90416]">Password</span>
               </h2>

                <p className="text-[11px] text-gray-500 mt-1">
                  Update your account password
                </p>

              </div>

              {/* Profile Image */}

              {/* <div className="relative">

                <img
                  src={profileImage}
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

              </div> */}

            </div>

            {/* Change Password Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Current Password */}

              <div>

                <label className="block text-[11px] font-semibold text-[#222] mb-2">
                  Current Password
                </label>

                <div className="relative">

                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(e.target.value)
                    }
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

                  {/* Lock Icon */}

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

              </div>

              {/* New Password */}

              <div>

                <label className="block text-[11px] font-semibold text-[#222] mb-2">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
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

                  {/* Lock Icon */}

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

              </div>

              {/* Confirm Password */}

              <div>

                <label className="block text-[11px] font-semibold text-[#222] mb-2">
                  Confirm New Password
                </label>

                <div className="relative">

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
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

                  {/* Lock Icon */}

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

              </div>

              {/* Change Password Button */}

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
                Change Password
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ChangePassword;