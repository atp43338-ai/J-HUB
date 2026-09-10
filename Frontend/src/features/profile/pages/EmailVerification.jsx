import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import EmailVerificationImage from "../asset/otp-bg.png";
import { verifyEmailChange } from "../services/profileService";

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
    alert("Please enter OTP");
    return;
  }

  if (otp.length !== 6) {
    alert("OTP must be 6 digits");
    return;
  }

  if (!email) {
    alert("Email not found");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    await verifyEmailChange(token, otp);

    alert("Email changed successfully");

    navigate("/profile");
  } catch (error) {
    console.error("Email verification error:", error);
    alert(error.message);
  }
};

  // Resend OTP
  const handleResend = () => {
    setTimer(60);
    setOtp("");

    alert("OTP resent successfully");
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">

      {/* Background Image */}

      <img
        src={EmailVerificationImage}
        alt="Email verification background"
        className="absolute inset-0 w-full h-full object-fill"
      />

      {/* Center Verification Box */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[730px]
          min-h-[665px]
          rounded-[30px]
          border
          border-[#d90416]
          bg-[#111214]
          shadow-[0_20px_50px_rgba(0,0,0,0.35)]
          px-[58px]
          py-[58px]
        "
      >

        {/* Mail Icon */}

        <div
          className="
            mx-auto
            w-[102px]
            h-[102px]
            rounded-[25px]
            bg-[#d90416]
            flex
            items-center
            justify-center
          "
        >
          <span className="text-[48px]">
            ✉️
          </span>
        </div>

        {/* Title */}

        <h2
          className="
            text-center
            text-[27px]
            font-bold
            mt-[38px]
          "
        >
          <span className="text-white">
            Email
          </span>

          <span className="text-[#d90416] ml-2">
            Verification
          </span>
        </h2>

        {/* Description */}

        <p
          className="
            text-center
            text-[17px]
            text-gray-400
            mt-3
            leading-7
          "
        >
          Enter the 6-digit verification code sent to your
          <br />

          <span className="text-white font-semibold">
            {email || "your email"}
          </span>
        </p>

        {/* OTP Form */}

        <form onSubmit={handleSubmit}>

          {/* OTP Input */}

          <div className="flex justify-center gap-[18px] mt-[30px]">

            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index] || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  const otpArray = otp.split("");

                  otpArray[index] = value;

                  setOtp(otpArray.join("").slice(0, 6));
                }}
                className="
                  w-[82px]
                  h-[82px]
                  rounded-[17px]
                  border
                  border-[#36383c]
                  bg-[#1c1f22]
                  text-white
                  text-center
                  text-[28px]
                  font-semibold
                  outline-none
                  focus:border-[#d90416]
                  focus:shadow-[0_0_12px_rgba(217,4,22,0.45)]
                "
              />
            ))}

          </div>

          {/* Verify Button */}

          <button
            type="submit"
            className="
              mt-[38px]
              w-full
              h-[73px]
              rounded-[16px]
              bg-[#d90416]
              hover:bg-[#b90312]
              text-white
              text-[22px]
              font-bold
              transition
            "
          >
            Verify Email
            <span className="ml-4">
              →
            </span>
          </button>

          {/* Timer */}

          <div
            className="
              flex
              justify-center
              items-center
              gap-3
              mt-[42px]
              text-[17px]
              text-gray-400
            "
          >
            <span className="text-[#d90416] text-[20px]">
              ●
            </span>

            <span>
              Code expires in
            </span>

            <span className="text-[#d90416] font-bold">
              {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </span>
          </div>

          {/* Resend */}

          <div
            className="
              text-center
              mt-3
              text-[17px]
              text-gray-400
            "
          >
            Didn't receive the code?

            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className={`
                ml-2
                font-medium
                ${
                  timer > 0
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-[#d90416] hover:text-[#b90312]"
                }
              `}
            >
              Resend OTP
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EmailVerification;