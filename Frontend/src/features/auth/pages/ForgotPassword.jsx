import { useState } from "react";
import { Link, useNavigate } from "react-router";
import ForgotPasswordImage from "../asset/Forgot-bg.png";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

const handlesubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    alert("Please enter email");
    return;
  }

  try {
    const data = await forgotPassword(email);

    alert("OTP sent successfully");

    navigate("/otp-verification", {
      state: {
        from: "forgot-password",
        email: email,
      },
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    alert(error.message);
  }
};

  

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">

      {/* Background Image */}

      <img
        src={ForgotPasswordImage}
        alt="Forgot Password background"
        className="absolute inset-0 w-full h-full object-fill"
      />

      {/* J-HUB Logo */}

      <div className="absolute top-[0%] left-[7%] z-10">
        <h1 className="text-[42px] leading-none font-black tracking-tight">
          <span className="text-black">J-</span>
          <span className="text-[#d90416]">HUB</span>
        </h1>
      </div>

      {/* Forgot Password Content */}

      <div className="absolute z-20 left-[12%] top-[24%] w-[30%]">

        <h2 className="mt-3 text-[15px] font-semibold !text-black">
          Forgot Password
        </h2>

        <p className="mt-3 text-[13px] text-[#555]">
          Enter your email to reset your password
        </p>

        <form
          onSubmit={handlesubmit}
          className="mt-6 space-y-4"
        >

          {/* Email */}

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="
                w-full
                h-[52px]
                rounded-[14px]
                border
                border-[#d5d5d5]
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
          </div>

          {/* Continue Button */}

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
            Continue
            
          </button>

        </form>
        <br /><br />

        {/* Login Link */}

        <p className="text-center text-[15px] text-black font-semibold mt-4">
          Remember your password?{" "}
          <Link
            to="/"
            className="text-[#d90416] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;