import { useEffect, useState } from "react";

import { getReferralDetails } from "../services/referralService";

import ProfileLayout from "../../profile/components/ProfileLayout";
import ProfileHeader from "../../profile/components/ProfileHeader";

const Referral = () => {
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        setLoading(true);

        const data = await getReferralDetails();

        setReferral(data.referral);
      } catch (error) {
        console.error("Referral fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferral();
  }, []);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopyMessage("Copied successfully!");

      setTimeout(() => {
        setCopyMessage("");
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);

      setCopyMessage("Copy failed!");

      setTimeout(() => {
        setCopyMessage("");
      }, 2000);
    }
  };

  if (loading) {
    return (
      <ProfileLayout
        title="My"
        highlight="Referral"
        description="Manage and share your referral details"
      >
        <div className="min-h-[450px] flex items-center justify-center">
          <p className="text-gray-500 text-sm">
            Loading referral details...
          </p>
        </div>
      </ProfileLayout>
    );
  }

  if (!referral) {
    return (
      <ProfileLayout
        title="My"
        highlight="Referral"
        description="Manage and share your referral details"
      >
        <div className="min-h-[450px] flex items-center justify-center">
          <p className="text-gray-500 text-sm">
            Failed to load referral details.
          </p>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout
      title="My"
      highlight="Referral"
      description="Manage and share your referral details"
    >

      {/* COPY POPUP */}
      {copyMessage && (
        <div
          className="
            fixed
            bottom-6
            left-1/2
            -translate-x-1/2
            z-[9999]
            bg-black
            text-white
            px-6
            py-3
            rounded-lg
            shadow-lg
            text-sm
            font-semibold
            animate-pulse
          "
        >
          {copyMessage}
        </div>
      )}

      {/* Header */}
      <ProfileHeader
        title="Referral"
        highlight="Program"
        description="Invite your friends to J-HUB and earn together!"
      />

      {/* Fixed Instant Reward Banner */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-white to-rose-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d90416] text-white shadow-md shadow-red-500/20 font-bold text-xl">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#d90416]">
                  Instant Rewards
                </span>
                <h4 className="text-base font-extrabold text-gray-900">
                  Invite your friends to J-HUB and earn together!
                </h4>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 rounded-xl bg-white/90 border border-red-100 p-3 shadow-xs">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 font-bold text-xs">
                    ₹99
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">You Get</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      <span className="font-semibold text-[#d90416]">₹99</span> added directly to your wallet when your friend registers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl bg-white/90 border border-red-100 p-3 shadow-xs">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
                    ₹49
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Your Friend Gets</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      <span className="font-semibold text-[#d90416]">₹49</span> welcome wallet credit to start shopping immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="mt-6">

        <div className="p-5 rounded-xl border border-gray-200 bg-gray-50">

          <p className="text-xs text-gray-500">
            Referral Code
          </p>

          <div className="mt-3 flex gap-3">

            <input
              value={referral.referralCode || ""}
              readOnly
              className="
                flex-1
                h-[46px]
                px-4
                rounded-lg
                border
                border-gray-200
                bg-white
                text-sm
                font-semibold
                text-gray-800
                outline-none
              "
            />

            <button
              type="button"
              onClick={() =>
                copyText(referral.referralCode)
              }
              className="
                h-[46px]
                px-6
                rounded-lg
                bg-[#d90416]
                hover:bg-[#b90312]
                text-white
                text-sm
                font-semibold
                transition cursor-pointer
              "
            >
              Copy
            </button>

          </div>

        </div>

      </div>


      {/* Referral Link */}
      <div className="mt-5">

        <div className="p-5 rounded-xl border border-gray-200 bg-gray-50">

          <p className="text-xs text-gray-500">
            Referral Link
          </p>

          <div className="mt-3 flex gap-3">

            <input
              value={
                referral.referralCode
                  ? `${window.location.origin}/register?ref=${referral.referralCode}`
                  : referral.referralLink || ""
              }
              readOnly
              className="
                flex-1
                h-[46px]
                px-4
                rounded-lg
                border
                border-gray-200
                bg-white
                text-sm
                text-gray-800
                outline-none
              "
            />

            <button
              type="button"
              onClick={() =>
                copyText(
                  referral.referralCode
                    ? `${window.location.origin}/register?ref=${referral.referralCode}`
                    : referral.referralLink || ""
                )
              }
              className="
                h-[46px]
                px-6
                rounded-lg
                bg-[#d90416]
                hover:bg-[#b90312]
                text-white
                text-sm
                font-semibold
                transition cursor-pointer
              "
            >
              Copy
            </button>

          </div>

        </div>

      </div>


      {/* Referral Reward */}
      <div className="mt-10">

        <h3 className="text-lg font-bold text-black">
          Referral <span className="text-[#d90416]">Reward</span>
        </h3>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Reward Status */}
          <div className="p-5 rounded-xl border border-gray-200 bg-gray-50">

            <p className="text-xs text-gray-500">
              Reward Status
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span
                className={`
                  w-2.5
                  h-2.5
                  rounded-full
                  ${
                    referral.referralRewardClaimed
                      ? "bg-green-500"
                      : "bg-red-500"
                  }
                `}
              />

              <p className="text-sm font-semibold text-gray-800">
                {referral.referralRewardClaimed
                  ? "Reward Claimed"
                  : "Reward Not Claimed"}
              </p>

            </div>

          </div>


          {/* Referral Information */}
          <div className="p-5 rounded-xl border border-gray-200 bg-gray-50">

            <p className="text-xs text-gray-500">
              Referral Status
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-800">
              {referral.referredBy
                ? "You were referred by another user"
                : "Share your referral with friends"}
            </p>

          </div>

        </div>

      </div>

    </ProfileLayout>
  );
};

export default Referral;