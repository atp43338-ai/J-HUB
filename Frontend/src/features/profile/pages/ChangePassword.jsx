import { useState } from "react";
import { useNavigate } from "react-router";
import ProfileImage from "../asset/Profile-bg.png";

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
      alert("Please fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password changed successfully");

    navigate("/profile");
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">

      {/* Background Image */}

      <img
        src={ProfileImage}
        alt="Profile background"
        className="absolute inset-0 w-full h-full object-fill"
      />

      <div className="absolute inset-0">

        {/* Profile Image & Name */}

        <div
          className="
            absolute
            left-[10%]
            top-[15%]
            w-[20%]
            flex
            flex-col
            items-center
          "
        >

          {/* Profile Image */}

          <img
            src={profileImage}
            alt="Profile"
            className="
              w-[120px]
              h-[120px]
              rounded-full
              object-cover
              border-2
              border-[#d90416]
            "
          />

          {/* Name */}

          <p
            className="
              mt-4
              text-[28px]
              font-bold
              text-white
              text-center
            "
          >
            {name}
          </p>

          {/* User */}

          <p
            className="
              text-[15px]
              text-gray-300
              text-center
            "
          >
            User
          </p>

        </div>

        {/* Title */}

        <div className="absolute left-[60%] top-[15%]">
          <h2 className="text-[38px] font-bold leading-none">
            <span className="text-[#d90416]">Change</span>
            <span className="text-white ml-2">Password</span>
          </h2>

          <p className="text-[15px] text-gray-300 mt-3">
            Update your account password
          </p>
        </div>

        {/* Change Password Form */}

        <form onSubmit={handleSubmit}>

          {/* Current Password */}

          <div className="absolute left-[50%] top-[27%]">
            <label className="block text-[15px] text-gray-300 mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="
                w-[500px]
                h-[58px]
                rounded-[14px]
                border
                bg-[#1c2022]
                px-5
                text-[16px]
                text-white
                outline-none
                focus:border-[#d90416]
              "
            />
          </div>

          {/* New Password */}

          <div className="absolute left-[50%] top-[42%]">
            <label className="block text-[15px] text-gray-300 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="
                w-[500px]
                h-[58px]
                rounded-[14px]
                border
                bg-[#1c2022]
                px-5
                text-[16px]
                text-white
                outline-none
                focus:border-[#d90416]
              "
            />
          </div>

          {/* Confirm Password */}

          <div className="absolute left-[50%] top-[57%]">
            <label className="block text-[15px] text-gray-300 mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
                w-[500px]
                h-[58px]
                rounded-[14px]
                border
                bg-[#1c2022]
                px-5
                text-[16px]
                text-white
                outline-none
                focus:border-[#d90416]
              "
            />
          </div>

          {/* Change Password Button */}

          <button
            type="submit"
            className="
              absolute
              left-[50%]
              top-[75%]
              w-[500px]
              h-[55px]
              rounded-[14px]
              bg-[#d90416]
              hover:bg-[#b90312]
              text-white
              text-[16px]
              font-semibold
              transition
            "
          >
            Change Password
          </button>

        </form>

        {/* Profile */}

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="
            absolute
            left-[10%]
            top-[43%]
            w-[20%]
            h-[40px]
            rounded-[14px]
            border
            hover:bg-white/10
            flex
            items-center
            justify-center
            text-white
            text-[12px]
            font-semibold
          "
        >
          Profile
        </button>

        {/* Change Password - Active */}

        <button
          type="button"
          className="
            absolute
            left-[10%]
            top-[52%]
            w-[20%]
            h-[40px]
            rounded-[14px]
            border
            flex
            items-center
            justify-center
            text-white
            text-[12px]
            font-semibold
          "
        >
          Change Password
        </button>

        {/* Logout */}

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="
            absolute
            left-[25%]
            top-[77%]
            w-[10%]
            h-[40px]
            rounded-[20px]
            border
            hover:bg-white/30
            flex
            items-center
            justify-center
            text-white
            text-[12px]
            font-semibold
          "
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default ChangePassword;