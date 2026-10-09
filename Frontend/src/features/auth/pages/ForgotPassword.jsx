import { useState } from "react";
import { Link, useNavigate } from "react-router";
import ForgotPasswordImage from "../asset/Forgot-bg.png";
import { forgotPassword } from "../services/authService";
import toast from "react-hot-toast";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter email");
      return;
    }

    try {
      const data = await forgotPassword(email);

      toast.success("OTP sent successfully");

      navigate("/otp-verification", {
        state: {
          from: "forgot-password",
          email: email,
        },
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 h-full w-full overflow-y-auto overflow-x-hidden bg-white">

      {/* Background Image */}
      <img
        src={ForgotPasswordImage}
        alt="Forgot Password background"
        className="fixed inset-0 h-full w-full object-fill"
      />

      {/* J-HUB Logo */}
      <div className="absolute left-[7%] top-[5%] z-10">
        <h1 className="text-[42px] font-black leading-none tracking-tight">
          <span className="text-black">J-</span>
          <span className="text-[#d90416]">HUB</span>
        </h1>
      </div>

      {/* Forgot Password Form - White Side */}
      <div className="relative z-20 flex min-h-screen w-full items-center justify-start px-5 py-24 sm:px-10 md:px-[7%]">

        <div className="w-full max-w-[440px] px-6 py-9 sm:px-10 sm:py-11">

          {/* Heading */}
          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
            <span className="text-black">Forgot </span>
            <span className="text-[#d90416]">Password</span>
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Enter your email to reset your password.
          </p>

          {/* Email Form */}
          <form
            onSubmit={handlesubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="forgot-email"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Email Address
              </label>

              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="h-[52px] w-full rounded-[14px] border border-gray-300 bg-white px-5 text-[14px] text-black outline-none transition placeholder:text-gray-400 focus:border-[#d90416] focus:ring-2 focus:ring-[#d90416]/10"
              />
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="mt-2 h-[55px] w-full rounded-[14px] bg-[#d90416] text-[16px] font-semibold text-white transition hover:bg-[#b90312] active:scale-[0.99]"
            >
              Continue
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm font-semibold text-gray-800">
            Remember your password?{" "}
            <Link
              to="/"
              className="font-semibold text-[#d90416] hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;