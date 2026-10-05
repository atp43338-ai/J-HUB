import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import {
  verifyEmailChange,
  resendEmailChangeOTP,
} from "../services/profileService";

import toast from "react-hot-toast";

import ProfileLayout from "../components/ProfileLayout";
import ProfileHeader from "../components/ProfileHeader";

function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const name = location.state?.name;
  const phone = location.state?.phone;

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);

  // Timer
  useEffect(() => {
    if (timer === 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prv) => prv - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // OTP submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    if (!email) {
      toast.error("Email not found");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      await verifyEmailChange(token, otp);

      toast.success("Email changed successfully");

      navigate("/profile");
    } catch (error) {
      console.error("Email verification error:", error);
      toast.error(error.message);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      await resendEmailChangeOTP(token);

      setTimer(60);
      setOtp("");

      toast.success("New OTP sent successfully");
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.message);
    }
  };

  return (
    <ProfileLayout
      title="Email"
      highlight="Verification"
      description="Verify your new email address"
    >
      <ProfileHeader
        title="Email"
        highlight="Verification"
        description="Enter the verification code sent to your new email"
      />

      {/* Verification Card */}
      <div className="max-w-[700px] mx-auto">

        {/* Mail Icon */}
        <div className="flex justify-center">
          <div className="
            w-16
            h-16
            rounded-2xl
            bg-red-50
            border
            border-red-100
            flex
            items-center
            justify-center
          ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-7 h-7 text-[#d90416]"
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

        {/* Description */}
        <div className="text-center mt-6">

          <h3 className="text-xl md:text-2xl font-bold text-black">
            Verify Your <span className="text-[#d90416]">Email</span>
          </h3>

          <p className="mt-2 text-sm text-gray-500 leading-6">
            Enter the 6-digit verification code sent to
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-800 break-all">
            {email || "your email"}
          </p>

        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="mt-8">

          {/* OTP Inputs */}
          <div className="flex justify-center gap-2 sm:gap-4">

            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index] || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(
                    /\D/g,
                    ""
                  );

                  const otpArray = otp.split("");

                  otpArray[index] = value;

                  setOtp(
                    otpArray.join("").slice(0, 6)
                  );

                  // Move to next box
                  if (value && index < 5) {
                    e.target.nextElementSibling?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace") {

                    if (otp[index]) {
                      const otpArray = otp.split("");

                      otpArray[index] = "";

                      setOtp(
                        otpArray.join("").slice(0, 6)
                      );

                      return;
                    }

                    if (index > 0) {
                      e.target.previousElementSibling?.focus();
                    }
                  }
                }}
                className="
                  w-[48px]
                  h-[56px]
                  sm:w-[60px]
                  sm:h-[64px]
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  text-black
                  text-center
                  text-xl
                  sm:text-2xl
                  font-semibold
                  outline-none
                  transition
                  focus:border-[#d90416]
                  focus:ring-2
                  focus:ring-[#d90416]/10
                "
              />
            ))}

          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="
              mt-8
              w-full
              h-[50px]
              rounded-lg
              bg-[#d90416]
              hover:bg-[#b90312]
              text-white
              text-sm
              font-semibold
              transition
            "
          >
            Verify Email
          </button>

          {/* Timer */}
          <div className="
            mt-6
            flex
            justify-center
            items-center
            gap-2
            text-sm
            text-gray-500
          ">

            <span className="w-2 h-2 rounded-full bg-[#d90416]" />

            <span>
              Code expires in
            </span>

            <span className="font-bold text-[#d90416]">
              {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </span>

          </div>

          {/* Resend */}
          <div className="
            mt-4
            text-center
            text-sm
            text-gray-500
          ">
            Didn't receive the code?

            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className={`
                ml-2
                font-semibold
                transition
                ${
                  timer > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#d90416] hover:text-[#b90312]"
                }
              `}
            >
              Resend OTP
            </button>
          </div>

        </form>

        {/* Security Note */}
        <div className="
          mt-8
          p-4
          rounded-xl
          bg-gray-50
          border
          border-gray-200
          text-center
        ">
          <p className="text-xs text-gray-500">
            For your security, never share your verification
            code with anyone.
          </p>
        </div>

      </div>
    </ProfileLayout>
  );
}

export default EmailVerification;