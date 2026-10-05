import { useState } from "react";

function PasswordInput({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">

      {/* Label */}
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>

      {/* Input Wrapper */}
      <div className="relative">

        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            w-full
            h-[50px]
            px-4
            pr-12
            rounded-lg
            border
            border-gray-200
            bg-white
            text-black
            text-sm
            outline-none
            transition
            focus:border-[#d90416]
            focus:ring-2
            focus:ring-[#d90416]/10
          "
        />

        {/* Show / Hide */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-500
            hover:text-[#d90416]
            transition
          "
          title={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            /* Eye Off */
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
                d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.9 5.1A10.8 10.8 0 0 1 12 4.5c5 0 8.5 5.5 9 7.5-.2.8-.9 2.1-2 3.4"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.6 6.6C4.4 8 3.3 10.1 3 12c.5 2 4 7.5 9 7.5 1.1 0 2.1-.2 3-.6"
              />
            </svg>
          ) : (
            /* Eye */
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
                d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
              />

              <circle
                cx="12"
                cy="12"
                r="2.5"
              />
            </svg>
          )}
        </button>

      </div>

    </div>
  );
}

export default PasswordInput;