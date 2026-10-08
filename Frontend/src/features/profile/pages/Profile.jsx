import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { getProfile } from "../services/profileService";

import toast from "react-hot-toast";

import ProfileLayout from "../components/ProfileLayout";
import ProfileHeader from "../components/ProfileHeader";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileInput from "../components/ProfileInput";

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

  const copyReferralCode = () => {
    if (!user?.referralCode) return;

    navigator.clipboard.writeText(user.referralCode);

    toast.success("Referral code copied");
  };

  const copyReferralLink = () => {
    if (!user?.referralCode) return;

    const referralLink =
      `${window.location.origin}/register?ref=${user.referralCode}`;

    navigator.clipboard.writeText(referralLink);

    toast.success("Referral link copied");
  };

  if (!user) {
    return (
      <ProfileLayout
        title="My"
        highlight="Profile"
        description="Manage your personal information"
      >
        <div className="min-h-[450px] flex items-center justify-center">
          <p className="text-gray-500 text-sm">
            Loading profile...
          </p>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout
      title="My"
      highlight="Profile"
      description="Manage your personal information"
    >
      {/* Header */}
      <ProfileHeader
        title="Personal"
        highlight="Information"
        description="View your account details"
      />

      {/* Profile Top Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-8 border-b border-gray-200">

        {/* Avatar */}
        <ProfileAvatar
          image={user.profileImage}
          name={user.name}
        />

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => navigate("/edit-profile")}
          className="
            h-[46px]
            px-7
            rounded-lg
            bg-[#d90416]
            hover:bg-[#b90312]
            text-white
            text-sm
            font-semibold
            transition
            self-center
            md:self-end
          "
        >
          Edit Profile
        </button>

      </div>

      {/* Profile Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        <ProfileInput
          label="Full Name"
          value={user.name || ""}
          disabled
        />

        <ProfileInput
          label="Email"
          type="email"
          value={user.email || ""}
          disabled
        />

        <ProfileInput
          label="Phone Number"
          type="tel"
          value={user.phone || ""}
          disabled
        />

        <ProfileInput
          label="Account Status"
          value={
            user.isBlocked
              ? "Blocked"
              : "Active"
          }
          disabled
        />

      </div>

      {/* Account Information */}
      <div className="mt-10">

        <h3 className="text-lg font-bold text-black">
          Account <span className="text-[#d90416]">Information</span>
        </h3>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Email Verification */}
          <div className="p-5 rounded-xl border border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Email Verification
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span
                className={`
                  w-2.5
                  h-2.5
                  rounded-full
                  ${
                    user.isEmailVerified
                      ? "bg-green-500"
                      : "bg-red-500"
                  }
                `}
              />

              <p className="text-sm font-semibold text-gray-800">
                {user.isEmailVerified
                  ? "Verified"
                  : "Not Verified"}
              </p>

            </div>
          </div>

          {/* Member */}
          <div className="p-5 rounded-xl border border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Membership
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-800">
              J-HUB Member
            </p>
          </div>

        </div>

      </div>

      {/* Referral Information */}
      <div className="mt-10">

        <h3 className="text-lg font-bold text-black">
          Referral <span className="text-[#d90416]">Program</span>
        </h3>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Referral Code */}
          <div className="p-5 rounded-xl border border-gray-200 bg-gray-50">

            <p className="text-xs text-gray-500">
              Your Referral Code
            </p>

            <div className="mt-3 flex items-center gap-3">

              <p className="text-base font-bold text-gray-800">
                {user.referralCode || "Not available"}
              </p>

              {user.referralCode && (
                <button
                  type="button"
                  onClick={copyReferralCode}
                  className="
                    px-3
                    py-1.5
                    rounded-lg
                    bg-black
                    text-white
                    text-xs
                    font-semibold
                    hover:bg-gray-800
                    transition
                  "
                >
                  Copy
                </button>
              )}

            </div>

          </div>


          {/* Referral Link */}
          <div className="p-5 rounded-xl border border-gray-200 bg-gray-50">

            <p className="text-xs text-gray-500">
              Your Referral Link
            </p>

            <div className="mt-3 flex items-center gap-3">

              <p className="text-sm font-medium text-gray-800 truncate">
                {user.referralCode
                  ? `${window.location.origin}/register?ref=${user.referralCode}`
                  : "Not available"}
              </p>

              {user.referralCode && (
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="
                    shrink-0
                    px-3
                    py-1.5
                    rounded-lg
                    bg-[#d90416]
                    text-white
                    text-xs
                    font-semibold
                    hover:bg-[#b90312]
                    transition
                  "
                >
                  Copy
                </button>
              )}

            </div>

          </div>

        </div>

      </div>

    </ProfileLayout>
  );
}

export default Profile;