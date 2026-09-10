import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import ResetPasswordImage from "../asset/Reset-bg.png";
import { resetPassword } from "../services/authService";

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
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!email) {
      alert("Email not found");
      return;
    }

    try {
      const data = await resetPassword(email, password);

      alert("Password reset successfully");

      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      alert(error.message);
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

      <div className="absolute top-[0%] left-[7%] z-10">
        <h1 className="text-[42px] leading-none font-black tracking-tight">
          <span className="text-black">J-</span>
          <span className="text-[#d90416]">HUB</span>
        </h1>
      </div>

      {/* Reset Password Content */}

      <div className="absolute z-20 left-[12%] top-[24%] w-[30%]">

        <h2 className="mt-3 text-[15px] font-semibold !text-black">
          Reset Password
        </h2>

        <p className="mt-3 text-[13px] text-[#555]">
          Create a new password for your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          {/* New Password */}

          <br />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="
                w-full
                h-[52px]
                rounded-[14px]
                border
                border-[#d5d5d5]
                bg-white/75
                px-5
                pr-12
                text-[14px]
                text-black
                placeholder-[#777]
                outline-none
                focus:border-[#d90416]
                transition
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-500
                hover:text-black
                transition
              "
            >
              {showPassword ? (

                /* Eye Off Icon */

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-5 h-5"
                >
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
                </svg>

              ) : (

                /* Eye Icon */

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  />
                </svg>

              )}
            </button>
          </div>

          {/* Confirm Password */}

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="
                w-full
                h-[52px]
                rounded-[14px]
                border
                border-[#d5d5d5]
                bg-white/75
                px-5
                pr-12
                text-[14px]
                text-black
                placeholder-[#777]
                outline-none
                focus:border-[#d90416]
                transition
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-500
                hover:text-black
                transition
              "
            >
              {showConfirmPassword ? (

                /* Eye Off Icon */

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-5 h-5"
                >
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
                </svg>

              ) : (

                /* Eye Icon */

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  />
                </svg>

              )}
            </button>
          </div>

          {/* Reset Button */}

          <button
            type="submit"
            className="
              w-full
              h-[55px]
              mt-2
              rounded-[14px]
              bg-[#d90416]
              hover:bg-[#b90312]
              text-white
              text-[16px]
              font-semibold
              transition
            "
          >
            Reset Password
          </button>

        </form>

      </div>
    </div>
  );
}

export default ResetPassword;