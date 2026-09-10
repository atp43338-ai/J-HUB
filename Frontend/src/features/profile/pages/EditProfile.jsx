import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProfileImage from "../asset/Profile-bg.png";
import {
  getProfile,
  changeEmail,
  updateProfile,
} from "../services/profileService";

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
          alert("Please login first");
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
        alert(error.message);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Save changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
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

        alert("OTP sent to your new email");

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

      alert("Profile updated successfully");

      navigate("/profile");
    } catch (error) {
      console.error("Update profile error:", error);
      alert(error.message);
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

      {/* Content */}

      <div className="absolute inset-0">

        {/* Profile Image */}

        <img
          src={imagePreview}
          alt="Profile"
          className="
            absolute
            left-[17%]
            top-[15%]
            w-[120px]
            h-[120px]
            rounded-full
            object-cover
            border
            border-white
          "
        />

        {/* Edit Profile Image Icon */}

        <label
          htmlFor="profileImage"
          className="
            absolute
            left-[23%]
            top-[27%]
            w-[32px]
            h-[32px]
            rounded-full
            bg-[#d90416]
            border
            border-white
            flex
            items-center
            justify-center
            cursor-pointer
            hover:bg-[#b90312]
            transition
            z-10
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[16px] h-[16px] text-white"
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
          onChange={(e) => setProfileImage(e.target.files[0])}
          className="hidden"
        />

        {/* Heading */}

        <div className="absolute left-[55%] top-[15%]">

          <h2 className="text-[38px] font-bold leading-none">
            <span className="text-[#d90416]">Edit</span>
            <span className="text-white ml-2">Profile</span>
          </h2>

          <p className="text-[15px] text-gray-300 mt-3">
            Update your personal information
          </p>

        </div>

        {/* Name */}

        <div className="absolute left-[47%] top-[27%]">

          <label className="block text-[15px] text-gray-300 mb-2">
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-[500px]
              h-[55px]
              rounded-[14px]
              border
              border-[#444]
              bg-[#1c2022]
              px-5
              text-[16px]
              text-white
              outline-none
              focus:border-[#d90416]
            "
          />

        </div>

        {/* Email */}

        <div className="absolute left-[47%] top-[40%]">

          <label className="block text-[15px] text-gray-300 mb-2">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-[500px]
              h-[55px]
              rounded-[14px]
              border
              border-[#444]
              bg-[#1c2022]
              px-5
              text-[16px]
              text-white
              outline-none
              focus:border-[#d90416]
            "
          />

        </div>

        {/* Phone */}

        <div className="absolute left-[47%] top-[53%]">

          <label className="block text-[15px] text-gray-300 mb-2">
            Phone Number
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="
              w-[500px]
              h-[55px]
              rounded-[14px]
              border
              border-[#444]
              bg-[#1c2022]
              px-5
              text-[16px]
              text-white
              outline-none
              focus:border-[#d90416]
            "
          />

        </div>

        {/* Save Changes */}

        <button
          onClick={handleSubmit}
          className="
            absolute
            left-[47%]
            top-[70%]
            w-[500px]
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
          Save Changes
        </button>

        {/* Profile */}

        <button
          onClick={() => navigate("/profile")}
          className="
            absolute
            left-[10%]
            top-[43%]
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
          "
        >
          Profile
        </button>

        {/* Change Password */}

        <button
          onClick={() => navigate("/change-password")}
          className="
            absolute
            left-[10%]
            top-[51%]
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
          "
        >
          Change Password
        </button>

        {/* Address */}

        <button
          onClick={() => navigate("/address")}
          className="
            absolute
            left-[10%]
            top-[59%]
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
          "
        >
          Address
        </button>

      </div>
    </div>
  );
}

export default EditProfile;