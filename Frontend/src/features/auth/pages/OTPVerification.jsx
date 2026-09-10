import { useState, useEffect } from "react";
import otpBg from "../asset/otp-bg.png";
import { useNavigate, useLocation } from "react-router";
import { verifyOTP } from "../services/authService";

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
      setTimer((prv) => prv - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    setTimer(60);
    setOtp("");
    console.log("otp resend");
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  if (!email) {
    alert("email not found");
    return;
  }

  try {
    const data = await verifyOTP(email, otp);

    alert("OTP verified successfully");

    if (from === "register") {
      navigate("/login");
      return;
    }

    if (from === "forgot-password") {
      navigate("/reset-password", {
        state: {
          email: email,
        },
      });
      return;
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    alert(error.message);
  }
};

  return (
  <div className="fixed inset-0 w-full h-full overflow-auto">

    {/* Background Image */}

    <img
      src={otpBg}
      alt="OTP Background"
      className="absolute inset-0 w-full h-full object-fill"
    />

    {/* Center OTP Card */}

    <div className="relative z-10 w-full min-h-full flex items-center justify-center px-4 sm:px-6 py-6">

      <div
        className="
          w-full
          max-w-[680px]
          text-center
          bg-[#111214]
          border
          border-[#d90416]
          rounded-[20px]
          sm:rounded-[30px]

          px-5
          py-8

          sm:px-8
          sm:py-10

          md:px-12
          md:py-12
        "
        style={{
          boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
        }}
      >

        {/* Lock Icon */}

        <div
          className="
            mx-auto
            mb-6
            sm:mb-8
            w-[70px]
            h-[70px]
            sm:w-[85px]
            sm:h-[85px]
            md:w-[95px]
            md:h-[95px]
            rounded-[18px]
            sm:rounded-[22px]
            bg-[#d90416]
            flex
            items-center
            justify-center
          "
        >
          <span className="text-white text-[32px] sm:text-[38px] md:text-[42px]">
            🔒
          </span>
        </div>

        {/* Heading */}

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          <span className="text-white">OTP </span>
          <span className="text-[#d90416]">Verification</span>
        </h2>

        {/* Description */}

        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-7 sm:mb-10">
          Enter the 6-digit verification code sent to your
          <br className="hidden sm:block" />
          mobile number
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

          {/* OTP Input */}

          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={otp[index] || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  if (!value) return;

                  const newOtp = otp.split("");
                  newOtp[index] = value;

                  setOtp(newOtp.join("").slice(0, 6));

                  // Move automatically to next box
                  if (index < 5) {
                    document
                      .getElementById(`otp-${index + 1}`)
                      ?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace") {
                    e.preventDefault();

                    const newOtp = otp.split("");
                    newOtp[index] = "";

                    setOtp(newOtp.join(""));

                    // Move to previous box
                    if (index > 0) {
                      document
                        .getElementById(`otp-${index - 1}`)
                        ?.focus();
                    }
                  }
                }}
                className={`
                  w-[42px]
                  h-[52px]

                  sm:w-[55px]
                  sm:h-[62px]

                  md:w-[78px]
                  md:h-[78px]

                  rounded-[12px]
                  sm:rounded-[14px]
                  md:rounded-[16px]

                  bg-[#1d1f22]
                  text-white
                  text-xl
                  sm:text-2xl
                  font-semibold
                  text-center
                  outline-none
                  border

                  ${
                    index === otp.length
                      ? "border-[#d90416] shadow-[0_0_15px_rgba(217,4,22,0.6)]"
                      : "border-[#3b3d42]"
                  }
                `}
              />
            ))}
          </div>

          {/* Verify Button */}

          <button
            type="submit"
            className="
              w-full
              h-[55px]
              sm:h-[60px]
              md:h-[68px]

              bg-[#d90416]
              hover:bg-[#b90312]

              text-white
              text-base
              sm:text-lg
              md:text-xl

              font-bold
              rounded-[14px]
              sm:rounded-[16px]

              transition
            "
          >
            Verify OTP
            <span className="ml-3 sm:ml-4 text-xl sm:text-2xl">
              →
            </span>
          </button>

          {/* Timer */}

          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            <span className="text-[#d90416] mr-2">●</span>
            Code expires in{" "}
            <span className="text-[#d90416] font-bold">
              00:{String(timer).padStart(2, "0")}
            </span>
          </p>

          {/* Resend OTP */}

          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className="
                text-[#d90416]
                font-semibold
                hover:underline
                disabled:opacity-40
                disabled:no-underline
              "
            >
              Resend OTP
            </button>
          </p>

        </form>
      </div>
    </div>
  </div>
);
}

export default OTPVerification;