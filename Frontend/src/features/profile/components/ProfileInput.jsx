function ProfileInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}) {
  return (
    <div className="w-full">

      {/* Label */}
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full
          h-[50px]
          px-4
          rounded-lg
          border
          border-gray-200
          bg-white
          text-black
          text-sm
          outline-none
          transition
          ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "focus:border-[#d90416] focus:ring-2 focus:ring-[#d90416]/10"
          }
        `}
      />

    </div>
  );
}

export default ProfileInput;