function AddressField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
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
          focus:border-[#d90416]
          focus:ring-2
          focus:ring-[#d90416]/10
        "
      />
    </div>
  );
}

export default AddressField;