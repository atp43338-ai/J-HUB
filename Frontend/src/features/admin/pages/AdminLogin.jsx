import { useState } from "react";
import AdminLoginImage from "../asset/admin-login-bg.png";
import { adminLogin } from "../services/adminService.js";
import { useNavigate } from "react-router";

function AdminLogin() {
    const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const data = await adminLogin(email, password);

      localStorage.setItem("adminToken", data.token);

      alert("Admin login successful");

      navigate("/admin/users", { replace: true});

      console.log(data.admin);
    } catch (error) {
      console.error("Admin login error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* Background Image */}

      <img
        src={AdminLoginImage}
        alt="Admin login background"
        className="fixed inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}

      <div className="fixed inset-0 bg-black/40"></div>

      {/* Main Content */}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-10">

        {/* Login Card */}

        <div
          className="
            w-full
            max-w-[500px]
            bg-[#111214]/90
            backdrop-blur-md
            border
            border-[#333]
            rounded-[25px]
            p-6
            sm:p-8
            md:p-10
            shadow-2xl
          "
        >

          {/* Heading */}

          <div className="text-center mb-8">

            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              <span className="text-[#d90416]">
                Admin
              </span>{" "}
              Login
            </h1>

            <p className="text-gray-400 text-sm sm:text-base mt-2">
              Sign in to access the admin panel
            </p>

          </div>

          {/* Form */}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}

            <div>

              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="
                  w-full
                  h-[52px]
                  rounded-[12px]
                  border
                  border-[#444]
                  bg-[#181a1d]/90
                  px-4
                  text-white
                  text-sm
                  placeholder-gray-500
                  outline-none
                  focus:border-[#d90416]
                  transition
                "
              />

            </div>

            {/* Password */}

            <div>

              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="
                    w-full
                    h-[52px]
                    rounded-[12px]
                    border
                    border-[#444]
                    bg-[#181a1d]/90
                    px-4
                    pr-12
                    text-white
                    text-sm
                    placeholder-gray-500
                    outline-none
                    focus:border-[#d90416]
                    transition
                  "
                />

                {/* Show / Hide Password */}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-white
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

            </div>

            {/* Login Button */}

            <button
              type="submit"
              className="
                w-full
                h-[52px]
                mt-3
                rounded-[12px]
                bg-[#d90416]
                hover:bg-[#b90312]
                text-white
                text-[15px]
                font-semibold
                transition
              "
            >
              Login
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;