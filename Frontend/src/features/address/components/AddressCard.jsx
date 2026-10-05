function AddressCard({
  address,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="
        border
        border-gray-200
        rounded-xl
        bg-white
        p-5
        hover:border-[#d90416]
        transition
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          {/* Location Icon */}
          <div
            className="
              w-11
              h-11
              rounded-full
              bg-red-50
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="w-5 h-5 text-[#d90416]"
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

          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {address.name}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Home Address
            </p>
          </div>

        </div>

      </div>

      {/* Address Details */}
      <div className="mt-6 space-y-3">

        {/* Phone */}
        <div className="flex text-sm">
          <span className="text-gray-500 w-20">
            Phone
          </span>

          <span className="text-gray-800">
            {address.phone}
          </span>
        </div>

        {/* Address */}
        <div className="flex text-sm">
          <span className="text-gray-500 w-20">
            Address
          </span>

          <span className="text-gray-800">
            {address.address}
          </span>
        </div>

        {/* City */}
        <div className="flex text-sm">
          <span className="text-gray-500 w-20">
            City
          </span>

          <span className="text-gray-800">
            {address.city}
          </span>
        </div>

        {/* State */}
        <div className="flex text-sm">
          <span className="text-gray-500 w-20">
            State
          </span>

          <span className="text-gray-800">
            {address.state}
          </span>
        </div>

        {/* Pincode */}
        <div className="flex text-sm">
          <span className="text-gray-500 w-20">
            Pincode
          </span>

          <span className="text-gray-800">
            {address.pincode}
          </span>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-5" />

      {/* Buttons */}
      <div className="flex gap-3">

        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(address._id)}
          className="
            flex-1
            h-10
            rounded-lg
            border
            border-gray-200
            text-gray-600
            text-sm
            font-semibold
            hover:border-[#d90416]
            hover:text-[#d90416]
            transition
          "
        >
          Edit
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(address._id)}
          className="
            flex-1
            h-10
            rounded-lg
            bg-[#d90416]
            hover:bg-[#b90312]
            text-white
            text-sm
            font-semibold
            transition
          "
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default AddressCard;