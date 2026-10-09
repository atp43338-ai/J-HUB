
import { useState, useEffect } from "react";
import otpBg from "../asset/otp-bg.png";
import { useNavigate, useLocation } from "react-router";

import {
  verifyOTP,
  resendOTP,
  verifyLoginOTP,
  resendLoginOTP,
} from "../services/authService";

import toast from "react-hot-toast";

function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from;
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Resend OTP
  const handleResend = async () => {
    try {
      if (!email) {
        toast.error("Email not found");
        return;
      }

      if (from === "login") {
        await resendLoginOTP(email);
      } else {
        await resendOTP(email);
      }

      setTimer(60);
      setOtp("");

      toast.success("OTP resent successfully");
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.message);
    }
  };

  // Verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    if (!email) {
      toast.error("Email not found");
      return;
    }

    try {
      let data;

      // Login OTP
      if (from === "login") {
        data = await verifyLoginOTP(email, otp);

        localStorage.setItem("token", data.token);

        toast.success("Login successful");

        navigate("/", { replace: true });
        return;
      }

      // Register / Forgot Password OTP
      data = await verifyOTP(email, otp);

      toast.success("OTP verified successfully");

      // Register
      if (from === "register") {
        navigate("/login", { replace: true });
        return;
      }

      // Forgot Password
      if (from === "forgot-password") {
        navigate("/reset-password", {
          state: { email },
        });
        return;
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.message);
    }
  };

  // Handle OTP input
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");

    if (!value) return;

    const newOtp = otp.split("");
    newOtp[index] = value.slice(-1);

    const updatedOtp = newOtp.join("").slice(0, 6);
    setOtp(updatedOtp);

    if (index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const newOtp = otp.split("");
      newOtp[index] = "";

      setOtp(newOtp.join(""));

      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white">

      {/* Jersey background */}
      <img
        src={otpBg}
        alt="J-HUB jersey background"
        className="fixed inset-0 hidden h-full w-full object-cover object-center md:block"
      />

      {/* Logo */}
      <div className="relative z-20 px-6 pt-8 md:absolute md:left-[6%] md:top-[6%] md:px-0 md:pt-0">
        <h1 className="text-[38px] font-black leading-none tracking-tight md:text-[42px]">
          <span className="text-black">J-</span>
          <span className="text-[#d90416]">HUB</span>
        </h1>

        <p className="mt-2 text-[10px] font-medium tracking-[2px] text-gray-500">
          YOUR JERSEY DESTINATION
        </p>
      </div>

      {/* OTP form */}
      <section className="relative z-20 mx-auto w-full max-w-[560px] px-6 pb-10 pt-12 md:absolute md:left-[6%] md:top-[24%] md:mx-0 md:w-[36%] md:max-w-none md:px-0 md:pb-0 md:pt-0">

        {/* Heading */}
        <div className="mb-8">
          <div className="mb-5 h-[3px] w-16 bg-[#d90416]" />

          <h2 className="text-3xl font-bold tracking-tight text-black md:text-[36px]">
            Verify Your <span className="text-[#d90416]">Email</span>
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500 md:text-base">
            We have sent a 6-digit OTP to your email.
            <br />
            Please enter the code below to continue.
          </p>

          {email && (
            <p className="mt-2 break-all text-sm font-medium text-gray-700">
              {email}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">

          {/* Six OTP fields */}
          <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={otp[index] || ""}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                aria-label={`OTP digit ${index + 1}`}
                className={`
                  h-[52px] min-w-0 flex-1 rounded-xl border
                  bg-white text-center text-xl font-semibold text-black
                  outline-none transition duration-200
                  sm:h-[62px] sm:max-w-[65px] sm:flex-1
                  ${
                    index === otp.length
                      ? "border-[#d90416] shadow-[0_0_0_1px_#d90416]"
                      : "border-gray-300"
                  }
                  focus:border-[#d90416]
                  focus:ring-2 focus:ring-red-100
                `}
              />
            ))}
          </div>

          {/* Resend OTP and countdown */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm md:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d90416"
              strokeWidth="1.7"
              className="h-5 w-5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"
              />
            </svg>

            <span className="text-gray-600">
              Didn't receive the code?
            </span>

            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className="font-semibold text-[#d90416] transition hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
            >
              Resend OTP
            </button>

            {timer > 0 && (
              <span className="text-gray-500">
                (00:{String(timer).padStart(2, "0")})
              </span>
            )}
          </div>

          {/* Verify button */}
          <button
            type="submit"
            className="flex h-[58px] w-full items-center justify-center gap-4 rounded-xl bg-[#d90416] text-base font-semibold text-white shadow-lg shadow-red-200/60 transition duration-200 hover:bg-[#b90312] focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
          >
            Verify OTP
            <span className="text-2xl">→</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Back to register */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="flex h-[54px] w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-800 transition hover:border-[#d90416] hover:text-[#d90416]"
          >
            <span className="text-xl">←</span>
            Back to Register
          </button>
        </form>
      </section>
    </main>
  );
}

export default OTPVerification;
