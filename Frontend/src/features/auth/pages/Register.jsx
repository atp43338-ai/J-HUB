import { useState } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router";

import toast from "react-hot-toast";

import RegisterImage from "../asset/Register-bg.png";

import { registerUser } from "../services/authService.js";

function Register() {
  const navigate = useNavigate();

  // Referral code from URL
  const [searchParams] = useSearchParams();

  const [referralCode, setReferralCode] = useState(
    searchParams.get("ref") || ""
  );

  const [showReferralCode, setShowReferralCode] =
    useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // Password rules
  const passwordRules = {
    length: password.length >= 8,

    uppercase: /[A-Z]/.test(password),

    lowercase: /[a-z]/.test(password),

    number: /[0-9]/.test(password),

    special: /[@$!%*?&]/.test(password),
  };

  const isPasswordValid =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordRules.special;

  // Normal registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    // Strong password validation
    if (!isPasswordValid) {
      toast.error(
        "Password must contain 8 characters, uppercase, lowercase, number and special character"
      );
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await registerUser(
        name,
        email,
        password,
        referralCode.trim() || undefined,
        undefined
      );

      toast.success("Registration successful");

      navigate("/otp-verification", {
        state: {
          from: "register",
          email: email,
        },
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      toast.error(error.message);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="fixed inset-0 w-full h-full overflow-hidden">

        {/* Background Image */}
        <img
          src={RegisterImage}
          alt="J-HUB background"
          className="absolute inset-0 w-full h-full object-fill"
        />

        {/* J-HUB Logo */}
        <div className="absolute top-[0%] left-[5%] z-10">
          <h1 className="text-[42px] leading-none font-black tracking-tight">
            <span className="text-black">
              J-
            </span>

            <span className="text-[#d90416]">
              HUB
            </span>
          </h1>
        </div>

        {/* Registration Content */}
        <div className="absolute z-20 left-[7%] top-[21%] w-[30%]">

          <h2 className="mt-3 text-[15px] font-semibold !text-black">
            Registration
          </h2>

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="mt-4 space-y-2.5"
          >

            {/* Name */}
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              className="
                w-full
                h-[48px]
                rounded-[14px]
                border
                border-black
                bg-white/75
                px-5
                text-[14px]
                text-black
                placeholder-[#777]
                outline-none
                focus:border-[#d90416]
                transition
              "
            />

            {/* Email */}
            <input
              type="email"
              value={email}
              autoComplete="off"
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="
                w-full
                h-[48px]
                rounded-[14px]
                border
                border-black
                bg-white/75
                px-5
                text-[14px]
                text-black
                placeholder-[#777]
                outline-none
                focus:border-[#d90416]
                transition
              "
            />

            {/* Password */}
            <div>
              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className="
                    w-full
                    h-[48px]
                    rounded-[14px]
                    border
                    border-black
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

                {/* Show / Hide Password */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                    hover:text-black
                  "
                >
                  {showPassword ? (
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
                        d="M3.98 8.5C2.9 10.04 2.5 12 2.5 12s3.5 7 9.5 7c1.25 0 2.4-.25 3.43-.67M6.42 6.42C7.9 5.5 9.58 5 12 5c6 0 9.5 7 9.5 7s-.9 1.8-2.5 3.42M3 3l18 18"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                      />
                    </svg>
                  ) : (
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

              {/* Compact Password Rules */}
              {password && !isPasswordValid && (
                <p className="mt-1 ml-1 text-[10px] leading-4 text-red-500">
                  8+ characters • Uppercase •
                  Lowercase • Number • Special
                  character
                </p>
              )}

              {password && isPasswordValid && (
                <p className="mt-1 ml-1 text-[10px] leading-4 text-green-600">
                  ✓ Strong password
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm your password"
                className="
                  w-full
                  h-[48px]
                  rounded-[14px]
                  border
                  border-black
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

              {/* Show / Hide Confirm Password */}
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-black
                "
              >
                {showConfirmPassword ? (
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
                      d="M3.98 8.5C2.9 10.04 2.5 12 2.5 12s3.5 7 9.5 7c1.25 0 2.4-.25 3.43-.67M6.42 6.42C7.9 5.5 9.58 5 12 5c6 0 9.5 7 9.5 7s-.9 1.8-2.5 3.42M3 3l18 18"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                    />
                  </svg>
                ) : (
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

            {/* Referral Code */}
            <div className="mt-1">

              <button
                type="button"
                onClick={() =>
                  setShowReferralCode(
                    !showReferralCode
                  )
                }
                className="
                  text-[12px]
                  text-[#d90416]
                  font-semibold
                  hover:underline
                "
              >
                Referral Code
              </button>

              {showReferralCode && (
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) =>
                    setReferralCode(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="Enter referral code"
                  className="
                    mt-2
                    w-full
                    h-[46px]
                    rounded-[10px]
                    border
                    border-black
                    bg-white
                    px-4
                    text-[13px]
                    text-black
                    placeholder-[#777]
                    outline-none
                    focus:border-[#d90416]
                    transition
                  "
                />
              )}

            </div>

            {/* Create Account */}
            <button
              type="submit"
              className="
                w-full
                h-[48px]
                mt-1
                rounded-[14px]
                bg-[#d90416]
                hover:bg-[#b90312]
                text-white
                text-[16px]
                font-semibold
                transition
              "
            >
              Create Account

              <span className="ml-3 text-xl">
                →
              </span>
            </button>

          </form>

          {/* Login Link */}
          <p className="text-center text-[14px] text-black font-semibold mt-3">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-[#d90416] font-semibold hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
}

export default Register;