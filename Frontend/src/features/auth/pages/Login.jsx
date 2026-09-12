import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import { loginUser, googleLoginUser } from "../services/authService.js";

import loginImage from "../asset/Login-bg.png";

function Login() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Show / Hide Password
  const [showPassword, setShowPassword] = useState(false);

  // Normal Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);

      toast.success("Login successful");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const data = await googleLoginUser(
        credentialResponse.credential
      );

      localStorage.setItem("token", data.token);

      toast.success("Google login successful");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Google login error:", error);

      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">

      {/* Background Image */}

      <img
        src={loginImage}
        alt="J-HUB background"
        className="absolute inset-0 w-full h-full object-fill"
      />

      {/* J-HUB Logo */}

      <div className="absolute top-[0%] left-[7%] z-10">
        <h1 className="text-[42px] leading-none font-black tracking-tight">
          <span className="text-black">J-</span>
          <span className="text-[#d90416]">HUB</span>
        </h1>
      </div>

      {/* Login Content */}

      <div className="absolute z-20 left-[12%] top-[24%] w-[30%]">

        <h2 className="mt-3 text-[15px] font-semibold !text-black">
          Login
        </h2>

        <form onSubmit={handleSubmit} autoComplete="off" className="mt-6 space-y-4">

          {/* Email */}

          <input
            type="email"
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="
              w-full
              h-[52px]
              rounded-[14px]
              border
              border boarder-black
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

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="
                w-full
                h-[52px]
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

            {/* Show / Hide Password Button */}

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
                    d="M9.88 5.1A10.7 10.7 0 0 1 12 4.9c5.5 0 9 7.1 9 7.1s-3.5 7-9 7c-1.1 0-2.1-.2-3-.55"
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

          {/* Forgot Password */}

          <p className="text-right text-[13px]">
            <Link
              to="/forgot-password"
              className="text-[#d90416] font-semibold hover:underline"
            >
              Forgot Password?
            </Link>
          </p>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-[55px]
              mt-2
              rounded-[14px]
              bg-[#d90416]
              hover:bg-[#b90312]
              disabled:opacity-60
              disabled:cursor-not-allowed
              text-white
              text-[16px]
              font-semibold
              transition
            "
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <span className="ml-3 text-xl">→</span>}
          </button>

        </form>

        {/* Social Login */}

        <div className="flex items-center gap-3 mt-4">

          <div className="flex-1 h-px bg-[#bbb]" />

          <span className="text-[12px] text-[#555]">
            or login with
          </span>

          <div className="flex-1 h-px bg-[#bbb]" />

        </div>

        <div className="flex justify-center gap-4 mt-3">

          {/* Google */}

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log("Google Login Failed");
              toast.error("Google login failed");
            }}
          />

        </div>

        {/* Register Link */}

        <p className="text-center text-[15px] text-black font-semibold mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#d90416] font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;