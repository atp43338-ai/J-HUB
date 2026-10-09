
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import ResetPasswordImage from "../asset/Reset-bg.png";
import { resetPassword } from "../services/authService";
import toast from "react-hot-toast";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!email) {
      toast.error("Email not found");
      return;
    }

    try {
      const data = await resetPassword(email, password);

      toast.success("Password reset successfully");

      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Background Image */}
      <img
        src={ResetPasswordImage}
        alt="Reset Password background"
        className="absolute inset-0 w-full h-full object-fill"
      />

      {/* J-HUB Logo */}
      <div className="absolute top-[0%] left-[5%] z-10">
        <h1 className="text-[42px] leading-none font-black tracking-tight">
          <span className="text-black">J-</span>
          <span className="text-[#d90416]">HUB</span>
        </h1>
      </div>

      {/* Reset Password Content */}
      <div
        className="
          absolute
          z-20
          left-[3%]
          top-[20%]
          w-[42%]
          px-6
          py-8
          sm:px-10
          sm:py-10
        "
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          <span className="text-black">Reset </span>
          <span className="text-[#d90416]">Password</span>
        </h2>

        <p className="mt-3 text-[15px] text-gray-600">
          Create a new password for your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          {/* New Password */}
          <div>
            <label className="block mb-2 text-[15px] font-medium text-gray-800">
              New Password
            </label>

            <div className="relative w-[500px]">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="
                  w-[500px]
                  h-[54px]
                  rounded-[16px]
                  border
                  border-gray-300
                  bg-white/90
                  px-5
                  pr-12
                  text-[15px]
                  text-black
                  placeholder-gray-400
                  outline-none
                  focus:border-[#d90416]
                  focus:ring-1
                  focus:ring-[#d90416]
                  transition
                  [&::-ms-reveal]:hidden
                  [&::-ms-clear]:hidden
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-[#d90416]
                  transition
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-5 h-5"
                >
                  {showPassword ? (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.58 10.58a2 2 0 0 0 2.83 2.83"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 5.1A10.7 10.7 0 0 1 12 4.9c5.5 0 9 7.1 9 7.1a16.7 16.7 0 0 1-3.05 3.8M6.1 6.1C3.8 7.8 3 12 3 12s3.5 7 9 7c1.1 0 2.1-.2 3-.55"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 text-[15px] font-medium text-gray-800">
              Confirm Password
            </label>

            <div className="relative w-[500px]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="
                  w-[500px]
                  h-[54px]
                  rounded-[16px]
                  border
                  border-gray-300
                  bg-white/90
                  px-5
                  pr-12
                  text-[15px]
                  text-black
                  placeholder-gray-400
                  outline-none
                  focus:border-[#d90416]
                  focus:ring-1
                  focus:ring-[#d90416]
                  transition
                  [&::-ms-reveal]:hidden
                  [&::-ms-clear]:hidden
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-[#d90416]
                  transition
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-5 h-5"
                >
                  {showConfirmPassword ? (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.58 10.58a2 2 0 0 0 2.83 2.83"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 5.1A10.7 10.7 0 0 1 12 4.9c5.5 0 9 7.1 9 7.1a16.7 16.7 0 0 1-3.05 3.8M6.1 6.1C3.8 7.8 3 12 3 12s3.5 7 9 7c1.1 0 2.1-.2 3-.55"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            className="
              w-full
              h-[56px]
              mt-3
              rounded-[16px]
              bg-[#d90416]
              hover:bg-[#b90312]
              text-white
              text-[16px]
              font-semibold
              transition
            "
          >
            Reset Password&nbsp; →
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
