function AddressEmptyState({ onAdd }) {
  return (
    <div
      className="
        mt-8
        border
        border-gray-200
        rounded-xl
        bg-gray-50
        p-10
        text-center
      "
    >
      {/* Location Icon */}
      <div
        className="
          mx-auto
          w-16
          h-16
          rounded-full
          bg-red-50
          flex
          items-center
          justify-center
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="w-7 h-7 text-[#d90416]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
          />

          <circle
            cx="12"
            cy="10"
            r="2.5"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900 mt-5">
        No addresses found
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-500 mt-2">
        Add an address to make your delivery easier.
      </p>

      {/* Add Button */}
      <button
        type="button"
        onClick={onAdd}
        className="
          mt-6
          h-10
          px-6
          rounded-lg
          bg-[#d90416]
          hover:bg-[#b90312]
          text-white
          text-sm
          font-semibold
          transition
        "
      >
        Add Address
      </button>
    </div>
  );
}

export default AddressEmptyState;